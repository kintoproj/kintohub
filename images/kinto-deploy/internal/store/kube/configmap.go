package kube

import (
	"context"
	"github.com/kintohub/kinto-kube-core/pkg/types"
	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func getConfigMap(kubeClient kubernetes.Interface, name, namespace string) (*v1.ConfigMap, error) {
	return kubeClient.CoreV1().ConfigMaps(namespace).Get(
		context.TODO(), types.GenBlockConfigMapName(name), metav1.GetOptions{})
}
