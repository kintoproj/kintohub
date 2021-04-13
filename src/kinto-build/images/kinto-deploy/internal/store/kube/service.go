package kube

import (
	"context"
	"fmt"
	corev1 "k8s.io/api/core/v1"
	k8serrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/intstr"
	"k8s.io/client-go/kubernetes"
	"kintoproj/kinto-deploy/internal/types"
)

func upsertService(kubeClient kubernetes.Interface, release *types.Release) (*corev1.Service, error) {
	existingService, err := kubeClient.CoreV1().Services(release.EnvId).Get(
		context.TODO(), release.BlockName, metav1.GetOptions{})

	if k8serrors.IsNotFound(err) {
		service := genServiceObject(release)
		return kubeClient.CoreV1().Services(release.EnvId).Create(context.TODO(), service, metav1.CreateOptions{})
	}

	updateServiceObject(release, existingService)
	return kubeClient.CoreV1().Services(release.EnvId).Update(context.TODO(), existingService, metav1.UpdateOptions{})
}

func deleteService(kubeClient kubernetes.Interface, name, namespace string) error {
	_, err := kubeClient.CoreV1().Services(namespace).Get(
		context.TODO(), name, metav1.GetOptions{})

	if k8serrors.IsNotFound(err) {
		return nil
	} else if err != nil {
		return err
	}

	return kubeClient.CoreV1().Services(namespace).Delete(
		context.TODO(), name, metav1.DeleteOptions{})
}

func genServiceObject(release *types.Release) *corev1.Service {
	return &corev1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name:   release.BlockName,
			Labels: release.Labels,
		},
		Spec: corev1.ServiceSpec{
			Ports:    genServicePort(release.Port),
			Selector: types.EnrichLabels(release.Labels, release.Id),
			Type:     "ClusterIP",
		},
	}
}

func updateServiceObject(release *types.Release, service *corev1.Service) {
	// clean proxless information
	service.Spec.ExternalName = ""
	service.Annotations = nil

	service.Spec.Ports = genServicePort(release.Port)
	service.Spec.Selector = types.EnrichLabels(release.Labels, release.Id)
	service.Spec.Type = "ClusterIP"
}

func genServicePort(port int32) []corev1.ServicePort {
	ports := []corev1.ServicePort{
		{
			Name: fmt.Sprintf("http-%d", port),
			Port: port,
		},
	}

	if port != 80 {
		ports = append(ports, corev1.ServicePort{
			Name: "http-80",
			Port: 80,
			TargetPort: intstr.IntOrString{
				IntVal: port,
			},
		})
	}

	return ports
}
