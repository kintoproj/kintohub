package kube

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/kintohub/kinto-kube-core/pkg/consts"
	appsv1 "k8s.io/api/apps/v1"
	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	k8stypes "k8s.io/apimachinery/pkg/types"
	"k8s.io/client-go/kubernetes"
	"k8s.io/utils/pointer"
	k8sstrings "k8s.io/utils/strings"
	"kinto.io/kinto-kube-deploy/internal/types"
)

func createDeployment(kubeClient kubernetes.Interface, release *types.Release) (*appsv1.Deployment, error) {
	deploy := genDeploymentObject(release)
	return kubeClient.AppsV1().Deployments(release.EnvId).Create(context.TODO(), deploy, metav1.CreateOptions{})
}

func deleteDeployments(kubeClient kubernetes.Interface, envId string, labels map[string]string) []error {
	deploys, err := listDeployments(kubeClient, envId, labels)

	if err != nil {
		return append([]error{}, err)
	}

	var errs []error
	for _, deploy := range deploys.Items {
		err := kubeClient.AppsV1().Deployments(deploy.Namespace).Delete(
			context.TODO(), deploy.Name, metav1.DeleteOptions{})

		if err != nil {
			errs = append(errs, err)
		}
	}

	return errs
}

func rollbackDeployment(kubeClient kubernetes.Interface, release *types.Release) error {
	name := genDeploymentName(release.BlockName, release.Id)
	return kubeClient.AppsV1().Deployments(release.EnvId).Delete(context.TODO(), name, metav1.DeleteOptions{})
}

func cleanOldDeployments(kubeClient kubernetes.Interface, release *types.Release) []error {
	deploys, err := listDeployments(kubeClient, release.EnvId, release.Labels)

	if err != nil {
		return append([]error{}, err)
	}

	var errs []error
	for _, deploy := range deploys.Items {
		if deploy.Labels[types.LabelReleaseId] != release.Id {
			err := kubeClient.AppsV1().Deployments(deploy.Namespace).Delete(
				context.TODO(), deploy.Name, metav1.DeleteOptions{})

			if err != nil {
				errs = append(errs, err)
			}
		}
	}

	return errs
}

func suspendDeployment(kubeClient kubernetes.Interface, blockName, namespace string) []error {
	var errs []error

	deploys, err := kubeClient.AppsV1().Deployments(namespace).List(
		context.TODO(),
		metav1.ListOptions{
			LabelSelector: fmt.Sprintf("app=%s", blockName),
		})

	if err != nil {
		return append(errs, err)
	}

	if len(deploys.Items) == 0 {
		return nil
	}

	type patchInt32Value struct {
		Op    string `json:"op"`
		Path  string `json:"path"`
		Value int32  `json:"value"`
	}
	payload := []patchInt32Value{{
		Op:    "replace",
		Path:  "/spec/replicas",
		Value: 0,
	}}
	payloadBytes, err := json.Marshal(payload)

	if err != nil {
		return append(errs, err)
	}

	for _, deploy := range deploys.Items {
		_, err = kubeClient.
			AppsV1().
			Deployments(namespace).
			Patch(context.TODO(), deploy.Name, k8stypes.JSONPatchType, payloadBytes, metav1.PatchOptions{})

		if err != nil {
			errs = append(errs, err)
		}
	}

	return errs
}

func listDeployments(
	kubeClient kubernetes.Interface, namespace string, labels map[string]string) (*appsv1.DeploymentList, error) {

	return kubeClient.AppsV1().Deployments(namespace).List(
		context.TODO(),
		metav1.ListOptions{
			LabelSelector: labelsToLabelSelector(labels),
		})
}

func genDeploymentObject(release *types.Release) *appsv1.Deployment {
	deploy := &appsv1.Deployment{
		ObjectMeta: metav1.ObjectMeta{
			Name:   genDeploymentName(release.BlockName, release.Id),
			Labels: types.EnrichLabels(release.Labels, release.Id),
		},
		Spec: appsv1.DeploymentSpec{
			Replicas: &release.Replicas,
			Selector: &metav1.LabelSelector{
				MatchLabels: types.EnrichLabels(release.Labels, release.Id),
			},
			Template: v1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: types.EnrichLabels(release.Labels, release.Id),
				},
				Spec: v1.PodSpec{
					Affinity: &v1.Affinity{
						PodAntiAffinity: &v1.PodAntiAffinity{
							RequiredDuringSchedulingIgnoredDuringExecution: []v1.PodAffinityTerm{
								{
									LabelSelector: &metav1.LabelSelector{
										MatchExpressions: []metav1.LabelSelectorRequirement{
											{
												Key:      consts.AppLabelKey,
												Operator: "In",
												Values:   []string{release.BlockName},
											},
											{
												Key:      consts.ReleaseLabelKey,
												Operator: "In",
												Values:   []string{release.Id},
											},
										},
									},
									TopologyKey: "kubernetes.io/hostname",
								},
							},
						},
					},
					AutomountServiceAccountToken: pointer.BoolPtr(false),
					Containers: []v1.Container{
						{
							Name:      release.BlockName,
							Image:     release.Image,
							Env:       genEnvVars(release.EnvVars),
							Resources: genResourceRequirements(release.Cpu, release.Memory),
						},
					},
				},
			},
		},
	}
	enrichContainerWithNetworkInfo(&deploy.Spec.Template.Spec.Containers[0], release.Port, int32(release.TimeoutInSec))
	return deploy
}

func enrichContainerWithNetworkInfo(container *v1.Container, port, timeoutInSec int32) {
	if port < 1 {
		container.Ports = nil
		container.ReadinessProbe = nil
		container.LivenessProbe = nil
	} else {
		container.Ports = genContainerPortList(port)
		container.ReadinessProbe = genProbe(port, timeoutInSec)
		container.LivenessProbe = genProbe(port, timeoutInSec)
	}
}

func genDeploymentName(blockName, releaseId string) string {
	return fmt.Sprintf("%s-%s", k8sstrings.ShortenString(blockName, 20), releaseId)
}
