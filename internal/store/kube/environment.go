package kube

import (
	"context"
	"fmt"
	"time"

	"k8s.io/client-go/kubernetes"

	"github.com/kintohub/kinto-core/pkg/consts"
	"github.com/kintohub/kinto-core/pkg/types"
	"github.com/kintohub/utils-go/klog"
	utilsGoServer "github.com/kintohub/utils-go/server"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func (k *KubeStore) GetEnvironment(envId string) (*types.Environment, *utilsGoServer.Error) {
	defer klog.LogDuration(time.Now(), "GetEnvironment")

	ns, uErr := getNamespace(k.kubeClient, envId)
	if uErr != nil {
		return nil, uErr
	}

	env := &types.Environment{
		Id:   ns.Name,
		Name: ns.Labels[consts.EnvNameLabelKey],
	}

	// TODO see how to upsert network policy in a better place - having it here is useful for processing all
	// the existing namespaces.
	_, err := upsertNetworkPolicy(k.kubeClient, envId)
	if err != nil { // we don't return the error since it does not impact the user
		klog.ErrorfWithErr(err, "error upserting the network policy for namespace %s", envId)
	}

	return env, nil
}

func (k *KubeStore) GetEnvironments() (*types.Environments, *utilsGoServer.Error) {
	defer klog.LogDuration(time.Now(), "GetEnvironments")

	list, err := k.kubeClient.CoreV1().Namespaces().List(context.TODO(), metav1.ListOptions{
		LabelSelector: fmt.Sprintf("%s=%s", consts.OwnerLabelKey, consts.OwnerLabelValue),
	})
	if err != nil {
		return nil, utilsGoServer.NewInternalErrorWithErr("Issue getting list if environments", err)
	}

	var envs []*types.Environment
	for _, ns := range list.Items {
		envs = append(envs, &types.Environment{
			Id:   ns.Name,
			Name: ns.Labels[consts.EnvNameLabelKey],
		})
	}

	return &types.Environments{
		Items: envs,
	}, nil

}

func (k *KubeStore) CreateEnvironment(env *types.Environment) *utilsGoServer.Error {
	defer klog.LogDuration(time.Now(), "CreateEnvironment")
	_, err := k.kubeClient.CoreV1().Namespaces().Create(
		context.TODO(),
		&corev1.Namespace{
			ObjectMeta: metav1.ObjectMeta{
				Name: env.Id,
				Labels: map[string]string{
					consts.OwnerLabelKey:   consts.OwnerLabelValue,
					consts.EnvNameLabelKey: env.Name,
				},
			},
		},
		metav1.CreateOptions{},
	)

	if err != nil {
		return utilsGoServer.NewInternalErrorWithErr("error creating k8s namespace", err)
	}

	return nil
}

func (k *KubeStore) UpdateEnvironment(env *types.Environment) *utilsGoServer.Error {
	defer klog.LogDuration(time.Now(), "UpdateEnvironment")
	ns, err := getNamespace(k.kubeClient, env.Id)
	if err != nil {
		return err
	}
	ns.Labels[consts.EnvNameLabelKey] = env.Name

	_, uErr := k.kubeClient.CoreV1().Namespaces().Update(context.TODO(), ns, metav1.UpdateOptions{})
	if uErr != nil {
		return utilsGoServer.NewInternalErrorWithErr("Issue updating the namespace", uErr)
	}
	return nil
}

func (k *KubeStore) DeleteEnvironment(id string) *utilsGoServer.Error {
	defer klog.LogDuration(time.Now(), "DeleteEnvironment")
	err := k.kubeClient.CoreV1().Namespaces().Delete(context.TODO(), id, metav1.DeleteOptions{})

	if err != nil {
		if errors.IsNotFound(err) {
			return utilsGoServer.NewErrorf(utilsGoServer.StatusCode_NotFound, "environment %s not found", id)
		} else {
			return utilsGoServer.NewInternalErrorWithErr("error occured deleting k8s namespace", err)
		}
	}

	return nil
}

func getNamespace(kubeClient kubernetes.Interface, id string) (*corev1.Namespace, *utilsGoServer.Error) {
	ns, err := kubeClient.CoreV1().Namespaces().Get(context.TODO(), id, metav1.GetOptions{})

	if err != nil {
		if errors.IsNotFound(err) {
			return nil, utilsGoServer.NewErrorf(utilsGoServer.StatusCode_NotFound, "environment %s not found", id)
		} else {
			return nil, utilsGoServer.NewInternalErrorWithErr("error getting k8s namespace", err)
		}
	}
	return ns, nil
}
