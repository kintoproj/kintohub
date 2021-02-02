package kube

import (
	"context"
	"fmt"
	corev1 "k8s.io/api/core/v1"
	k8serrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"kintoproj/kinto-deploy/internal/config"
	"kintoproj/kinto-deploy/internal/types"
	"strings"
)

func genProxlessServiceName(serviceName string) string {
	return fmt.Sprintf("%s-proxless", serviceName)
}

/**
Here is how proxless works:
1 - we create another an `ExternalName` service called "[blockname]" that target the proxless pod.
2 - we create a `ClusterIP` service called "[blockname]-proxless" that targets the user pod. This service only works
when the pod is up and running. Therefore the user don't use it, nor see it.
3 - then we add the proxless annotations into the `ExternalName` "[blockname]" service so that proxless can pick them
up. The proxless pod will act as a proxy and redirects to the above service. The user uses this service to connect to
their app.

The communication flow is `[blockname] -> proxless pod -> [blockname-proxless] -> user pod`.

Note: the optimal workflow should just be:
1 - Create the "[blockname]-proxless" service
2 - Create the "[blockname]" service with annotation
But we have to respect the above steps cuz of an issue where nginx don't `refresh/reload` when an `ExternalName` service
is created. So that nginx can reload on step 2 and proxless not print any error because of service not found in
annotations.
*/
func upsertServicesForProxless(kubeClient kubernetes.Interface, release *types.Release) error {
	// 1 - we create another an `ExternalName` service called "[blockname]" that target the proxless pod.
	externalNameSvc, err :=
		kubeClient.CoreV1().Services(release.EnvId).Get(context.TODO(), release.BlockName, metav1.GetOptions{})

	if k8serrors.IsNotFound(err) {
		externalNameSvc = genProxlessExternalNameServiceObject(release)

		_, err = kubeClient.CoreV1().Services(release.EnvId).Create(
			context.TODO(), externalNameSvc, metav1.CreateOptions{})

		if err != nil {
			return err
		}
	} else if err != nil {
		return err
	} else {
		updateProxlessExternalNameServiceObject(externalNameSvc)

		_, err = kubeClient.CoreV1().Services(release.EnvId).Update(context.TODO(), externalNameSvc, metav1.UpdateOptions{})

		if err != nil {
			return err
		}
	}

	// 2 - we create a `ClusterIP` service called "[blockname]-proxless" that targets the user pod. This service only works
	// when the pod is up and running. Therefore the user don't use it, nor see it.
	proxlessServiceName := genProxlessServiceName(release.BlockName)

	clusterIPService, err :=
		kubeClient.CoreV1().Services(release.EnvId).Get(context.TODO(), proxlessServiceName, metav1.GetOptions{})

	if k8serrors.IsNotFound(err) {
		clusterIPService = genServiceObject(release)
		clusterIPService.Name = proxlessServiceName

		_, err = kubeClient.CoreV1().Services(release.EnvId).Create(context.TODO(), clusterIPService, metav1.CreateOptions{})

		if err != nil {
			return err
		}
	} else if err != nil {
		return err
	} else {
		updateServiceObject(release, clusterIPService)

		_, err = kubeClient.CoreV1().Services(release.EnvId).Update(context.TODO(), clusterIPService, metav1.UpdateOptions{})

		if err != nil {
			return err
		}
	}

	// 3 - then we add the proxless annotations into the `ExternalName` "[blockname]" service so that proxless can pick them
	// up. The proxless pod will act as a proxy and redirects to the above service. The user uses this service to connect to
	// their app.
	externalNameSvc, err =
		kubeClient.CoreV1().Services(release.EnvId).Get(context.TODO(), release.BlockName, metav1.GetOptions{})

	if err != nil {
		return err
	}

	addProxlessAnnotations(externalNameSvc, release)

	_, err = kubeClient.CoreV1().Services(release.EnvId).Update(context.TODO(), externalNameSvc, metav1.UpdateOptions{})

	if err != nil {
		return err
	}

	return nil
}

func genProxlessExternalNameServiceObject(release *types.Release) *corev1.Service {
	return &corev1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name:   release.BlockName,
			Labels: release.Labels,
		},
		Spec: corev1.ServiceSpec{
			Type:         "ExternalName",
			ExternalName: config.ProxlessFQDN,
		},
	}
}

func addProxlessAnnotations(service *corev1.Service, release *types.Release) {
	domains := ""
	for _, domain := range release.Hosts {
		domains += fmt.Sprintf("%s,", domain)
	}
	domains = strings.TrimSuffix(domains, ",")

	service.Annotations = map[string]string{
		"proxless/domains":                   domains,
		"proxless/deployment":                genDeploymentName(release.BlockName, release.Id),
		"proxless/ttl-seconds":               release.ProxlessConfig.ServerlessTTLSeconds,
		"proxless/readiness-timeout-seconds": release.ProxlessConfig.DeploymentReadinessTimeoutSeconds,
		"proxless/service":                   genProxlessServiceName(release.BlockName),
	}

}

func updateProxlessExternalNameServiceObject(service *corev1.Service) {
	// clean cluster ip information
	service.Spec.ClusterIP = ""
	service.Spec.Ports = nil
	service.Spec.Selector = nil

	service.Spec.Type = "ExternalName"
	service.Spec.ExternalName = config.ProxlessFQDN
}
