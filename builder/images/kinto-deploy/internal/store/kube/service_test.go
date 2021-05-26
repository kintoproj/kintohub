package kube

import (
	"context"
	"kintoproj/kinto-deploy/internal/types"
	"testing"

	"github.com/stretchr/testify/assert"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/intstr"
	"k8s.io/client-go/kubernetes/fake"
)

func Test_upsertService(t *testing.T) {
	kubeClient := fake.NewSimpleClientset()

	release := genDummyRelease()

	// create
	want := &corev1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name:      release.BlockName,
			Labels:    release.Labels,
			Namespace: release.EnvId,
		},
		Spec: corev1.ServiceSpec{
			Ports: []corev1.ServicePort{
				{
					Name: "http-8080",
					Port: release.Port,
				},
				{
					Name: "http-80",
					Port: 80,
					TargetPort: intstr.IntOrString{
						IntVal: release.Port,
					},
				},
			},
			Selector: types.EnrichLabels(release.Labels, release.Id),
			Type:     "ClusterIP",
		},
	}

	got, err := upsertService(kubeClient, release)

	assert.NoError(t, err)
	assert.Equal(t, want, got)

	// update
	release.Port = 9999

	want.Spec.Ports = []corev1.ServicePort{
		{
			Name: "http-9999",
			Port: release.Port,
		},
		{
			Name: "http-80",
			Port: 80,
			TargetPort: intstr.IntOrString{
				IntVal: release.Port,
			},
		},
	}

	got, err = upsertService(kubeClient, release)

	assert.NoError(t, err)
	assert.Equal(t, want, got)
}

func Test_deleteService(t *testing.T) {
	kubeClient := fake.NewSimpleClientset()
	release := genDummyRelease()

	// create service
	service, err := upsertService(kubeClient, release)
	assert.NoError(t, err)

	// make sure the service exists
	_, err = kubeClient.CoreV1().Services(release.EnvId).Get(context.TODO(), service.Name, metav1.GetOptions{})
	assert.NoError(t, err)

	// delete the service
	err = deleteService(kubeClient, release.BlockName, release.EnvId)
	assert.NoError(t, err)

	// make sure the service has been deleted
	_, err = kubeClient.CoreV1().Services(release.EnvId).Get(context.TODO(), service.Name, metav1.GetOptions{})
	assert.Error(t, err)
}
