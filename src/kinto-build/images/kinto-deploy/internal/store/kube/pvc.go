package kube

import (
	"context"
	k8serrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func deletePVCs(kubeClient kubernetes.Interface, appLabelValue, namespace string) []error {
	pvcs, err := kubeClient.CoreV1().PersistentVolumeClaims(namespace).List(
		context.TODO(),
		metav1.ListOptions{
			LabelSelector: labelsToLabelSelector(map[string]string{"app": appLabelValue}),
		})

	if k8serrors.IsNotFound(err) {
		return nil
	} else if err != nil {
		return append([]error{}, err)
	}

	if pvcs == nil || len(pvcs.Items) == 0 {
		return nil
	}

	var errs []error

	for _, pvc := range pvcs.Items {
		err := kubeClient.CoreV1().PersistentVolumeClaims(namespace).Delete(
			context.TODO(), pvc.Name, metav1.DeleteOptions{})

		if err != nil {
			errs = append(errs, err)
		}
	}

	return errs
}
