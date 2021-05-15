package kube

import (
	"context"
	"github.com/kintohub/utils-go/klog"
	"github.com/kintoproj/kinto-core/pkg/consts"
	v1 "k8s.io/api/core/v1"
	k8serrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"time"
)

func upsertDockerSecret(
	kubeClient kubernetes.Interface, dockerSecretName, kintoCoreNamespace, userNamespace string) (*v1.Secret, error) {
	defer klog.LogDuration(time.Now(), "upsertDockerSecret")

	// retrieving the kinto build docker secret
	kintoBuildDockerSecret, err := kubeClient.CoreV1().Secrets(kintoCoreNamespace).Get(
		context.TODO(), dockerSecretName, metav1.GetOptions{})

	if err != nil {
		return nil, err
	}

	// retrieving the user docker secret
	userDockerSecret, err := kubeClient.CoreV1().Secrets(userNamespace).Get(
		context.TODO(), dockerSecretName, metav1.GetOptions{})

	if k8serrors.IsNotFound(err) { // we create it if not found
		userDockerSecret := genDockerSecretFromExistingCoreSecret(kintoBuildDockerSecret, userNamespace)
		return kubeClient.CoreV1().Secrets(userNamespace).Create(
			context.TODO(), userDockerSecret, metav1.CreateOptions{})
	} else if err != nil {
		return nil, err
	}

	// we update it if found
	userDockerSecret.Data = kintoBuildDockerSecret.Data
	return kubeClient.CoreV1().Secrets(userNamespace).Update(
		context.TODO(), userDockerSecret, metav1.UpdateOptions{})
}

func genDockerSecretFromExistingCoreSecret(kintoBuildDockerSecret *v1.Secret, userNamespace string) *v1.Secret {
	return &v1.Secret{
		ObjectMeta: metav1.ObjectMeta{
			Name:      kintoBuildDockerSecret.Name,
			Namespace: userNamespace,
			Labels: map[string]string{
				consts.OwnerLabelKey: consts.OwnerLabelValue,
			},
		},
		Data: kintoBuildDockerSecret.Data,
		Type: v1.SecretTypeDockerConfigJson,
	}
}
