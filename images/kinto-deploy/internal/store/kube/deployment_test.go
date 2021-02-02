package kube

import (
	"context"
	"fmt"
	"github.com/kintoproj/kinto-core/pkg/consts"
	"github.com/stretchr/testify/assert"
	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/intstr"
	"k8s.io/client-go/kubernetes/fake"
	"k8s.io/utils/pointer"
	"kintoproj/kinto-deploy/internal/types"
	"testing"
)

func Test_deploymentFullFlow(t *testing.T) {
	kubeClient := fake.NewSimpleClientset()

	release := genDummyRelease()

	want := &appsv1.Deployment{
		ObjectMeta: metav1.ObjectMeta{
			Name:      fmt.Sprintf("%s-%s", release.BlockName, release.Id),
			Labels:    types.EnrichLabels(release.Labels, release.Id),
			Namespace: release.EnvId,
		},
		Spec: appsv1.DeploymentSpec{
			Replicas: &release.Replicas,
			Selector: &metav1.LabelSelector{
				MatchLabels: types.EnrichLabels(release.Labels, release.Id),
			},
			Template: corev1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: types.EnrichLabels(release.Labels, release.Id),
				},
				Spec: corev1.PodSpec{
					Affinity: &corev1.Affinity{
						PodAntiAffinity: &corev1.PodAntiAffinity{
							RequiredDuringSchedulingIgnoredDuringExecution: []corev1.PodAffinityTerm{
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
					Containers: []corev1.Container{
						{
							Name:  release.BlockName,
							Image: release.Image,
							Env: []corev1.EnvVar{
								{
									Name:  "dummyKey0",
									Value: "dummyVal0",
								},
							},
							Resources: corev1.ResourceRequirements{
								Limits: corev1.ResourceList{
									corev1.ResourceMemory: resource.MustParse(release.Memory),
									corev1.ResourceCPU:    resource.MustParse(release.Cpu),
								},
								Requests: corev1.ResourceList{
									corev1.ResourceMemory: resource.MustParse(release.Memory),
									corev1.ResourceCPU:    resource.MustParse(release.Cpu),
								},
							},
							Ports: []corev1.ContainerPort{
								{
									ContainerPort: release.Port,
								},
							},
							LivenessProbe: &corev1.Probe{
								Handler: corev1.Handler{
									TCPSocket: &corev1.TCPSocketAction{
										Port: intstr.IntOrString{
											IntVal: release.Port,
										},
									},
								},
								TimeoutSeconds:   1,
								PeriodSeconds:    int32(release.TimeoutInSec) / probeFailureThreshold,
								SuccessThreshold: 1,
								FailureThreshold: probeFailureThreshold,
							},
							ReadinessProbe: &corev1.Probe{
								Handler: corev1.Handler{
									TCPSocket: &corev1.TCPSocketAction{
										Port: intstr.IntOrString{
											IntVal: release.Port,
										},
									},
								},
								TimeoutSeconds:   1,
								PeriodSeconds:    int32(release.TimeoutInSec) / probeFailureThreshold,
								SuccessThreshold: 1,
								FailureThreshold: probeFailureThreshold,
							},
						},
					},
				},
			},
		},
	}

	// create a deployment
	got, err := createDeployment(kubeClient, release)

	assert.NoError(t, err)
	assert.Equal(t, want, got)

	// delete old deployments
	errs := cleanOldDeployments(kubeClient, release)
	if errs != nil && len(errs) > 0 {
		t.Errorf("errs should be nil - %v", errs)
	}

	// make sure the current deployment still exist
	_, err = kubeClient.AppsV1().Deployments(release.EnvId).Get(context.TODO(), want.Name, metav1.GetOptions{})
	assert.NoError(t, err)

	// delete the current deployment
	err = rollbackDeployment(kubeClient, release)
	assert.NoError(t, err)

	// make sure the deployment does not exist anymore
	_, err = kubeClient.AppsV1().Deployments(release.EnvId).Get(context.TODO(), want.Name, metav1.GetOptions{})
	assert.Error(t, err)
}

func Test_deleteDeployment(t *testing.T) {
	kubeClient := fake.NewSimpleClientset()
	release := genDummyRelease()

	// create a deployment
	deploy, err := createDeployment(kubeClient, release)
	assert.NoError(t, err)

	// make sure the deployment exists
	_, err = kubeClient.AppsV1().Deployments(release.EnvId).Get(context.TODO(), deploy.Name, metav1.GetOptions{})
	assert.NoError(t, err)

	errs := deleteDeployments(kubeClient, release.EnvId, release.Labels)
	if errs != nil {
		for _, err := range errs {
			assert.NoError(t, err)
		}
	}

	// make sure the deployment does not exist anymore
	_, err = kubeClient.AppsV1().Deployments(release.EnvId).Get(context.TODO(), deploy.Name, metav1.GetOptions{})
	assert.Error(t, err)
}
