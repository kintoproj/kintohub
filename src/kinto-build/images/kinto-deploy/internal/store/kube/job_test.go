package kube

import (
	"context"
	"github.com/r3labs/diff"
	"github.com/stretchr/testify/assert"
	batchv1 "k8s.io/api/batch/v1"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes/fake"
	"k8s.io/utils/pointer"
	"kintoproj/kinto-deploy/internal/types"
	"testing"
)

// TODO change this test to be similar to deployment
func Test_upsertJob(t *testing.T) {
	kubeClient := fake.NewSimpleClientset()

	release := genDummyRelease()

	// create

	want := &batchv1.Job{
		ObjectMeta: metav1.ObjectMeta{
			Name:      release.BlockName,
			Labels:    release.Labels,
			Namespace: release.EnvId,
		},
		Spec: batchv1.JobSpec{
			ActiveDeadlineSeconds: pointer.Int64Ptr(int64(release.JobSpec.TimeoutInSec)),
			BackoffLimit:          pointer.Int32Ptr(0),
			Template: corev1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: types.EnrichLabels(release.Labels, release.Id),
				},
				Spec: corev1.PodSpec{
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
						},
					},
					RestartPolicy:                "Never",
					AutomountServiceAccountToken: pointer.BoolPtr(false),
				},
			},
		},
	}

	got, _ := upsertJob(kubeClient, release)

	if diff.Changed(want, got) {
		changelog, _ := diff.Diff(want, got)
		t.Errorf("upsertJob_Create(fakeClient, %v); got and want different - %v", release, changelog)
	}

	// update
	// should delete and create a new job

	release.EnvVars["dummyKey1"] = "dummyVal1"

	want = genJobObject(release)
	want.Namespace = release.EnvId

	got, _ = upsertJob(kubeClient, release)

	if diff.Changed(want, got) {
		changelog, _ := diff.Diff(want, got)
		t.Errorf("upsertJob_Update(fakeClient, %v); got and want different - %v", release, changelog)
	}
}

func Test_deleteJob(t *testing.T) {
	kubeClient := fake.NewSimpleClientset()
	release := genDummyRelease()

	// create job
	job, err := upsertJob(kubeClient, release)
	assert.NoError(t, err)

	// make sure the job exists
	_, err = kubeClient.BatchV1().Jobs(release.EnvId).Get(context.TODO(), job.Name, metav1.GetOptions{})
	assert.NoError(t, err)

	// delete the job
	err = deleteJob(kubeClient, release.BlockName, release.EnvId)
	assert.NoError(t, err)

	// make sure the job has been deleted
	_, err = kubeClient.BatchV1().Jobs(release.EnvId).Get(context.TODO(), job.Name, metav1.GetOptions{})
	assert.Error(t, err)
}
