package kube

import (
	"context"
	"github.com/stretchr/testify/assert"
	autoscalingv1 "k8s.io/api/autoscaling/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes/fake"
	"k8s.io/utils/pointer"
	"testing"
)

func Test_upsertHpa(t *testing.T) {
	kubeClient := fake.NewSimpleClientset()

	release := genDummyRelease()

	// create
	want := &autoscalingv1.HorizontalPodAutoscaler{
		ObjectMeta: metav1.ObjectMeta{
			Name:      release.BlockName,
			Labels:    release.Labels,
			Namespace: release.EnvId,
		},
		Spec: autoscalingv1.HorizontalPodAutoscalerSpec{
			ScaleTargetRef: autoscalingv1.CrossVersionObjectReference{
				Kind:       "Deployment",
				Name:       release.BlockName,
				APIVersion: "extensions/v1beta1",
			},
			MinReplicas:                    pointer.Int32Ptr(release.HPA.Min),
			MaxReplicas:                    release.HPA.Max,
			TargetCPUUtilizationPercentage: pointer.Int32Ptr(release.HPA.CpuPercent),
		},
	}

	got, err := upsertHPA(kubeClient, release)

	assert.NoError(t, err)
	assert.Equal(t, want, got)

	// update - no port
	release.HPA.CpuPercent = 50
	release.HPA.Min = 3
	release.HPA.Max = 7

	want.Spec.TargetCPUUtilizationPercentage = pointer.Int32Ptr(50)
	want.Spec.MinReplicas = pointer.Int32Ptr(3)
	want.Spec.MaxReplicas = 7

	got, err = upsertHPA(kubeClient, release)

	assert.NoError(t, err)
	assert.Equal(t, want, got)
}

func Test_deleteHpa(t *testing.T) {
	kubeClient := fake.NewSimpleClientset()
	release := genDummyRelease()

	// create HPA
	hpa, err := upsertHPA(kubeClient, release)
	assert.NoError(t, err)

	// make sure the hpa exists
	_, err = kubeClient.AutoscalingV1().HorizontalPodAutoscalers(release.EnvId).Get(
		context.TODO(), hpa.Name, metav1.GetOptions{})
	assert.NoError(t, err)

	// delete the hpa
	err = deleteHPAIfExists(kubeClient, release.BlockName, release.EnvId)
	assert.NoError(t, err)

	// make sure the hpa has been deleted
	_, err = kubeClient.AutoscalingV1().HorizontalPodAutoscalers(release.EnvId).Get(
		context.TODO(), hpa.Name, metav1.GetOptions{})
	assert.Error(t, err)
}
