package kube

import (
	"context"
	"fmt"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"strings"
)

func upsertProxlessServiceDomainNameAnnotation(
	kubeClient kubernetes.Interface, blockName, namespace string, hosts ...string) error {

	svc, err := kubeClient.CoreV1().Services(namespace).Get(context.TODO(), blockName, metav1.GetOptions{})

	if err != nil {
		return err
	}

	patchValue := ""
	for _, host := range hosts {
		patchValue += fmt.Sprintf("%s,", host)
	}
	patchValue = strings.TrimSuffix(patchValue, ",")

	if svc.Annotations == nil {
		svc.Annotations = map[string]string{}
	}

	svc.Annotations["proxless/domains"] = patchValue

	_, err = kubeClient.CoreV1().Services(namespace).Update(context.TODO(), svc, metav1.UpdateOptions{})

	if err != nil {
		return err
	}

	return nil
}
