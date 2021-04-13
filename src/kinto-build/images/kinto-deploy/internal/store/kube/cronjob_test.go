package kube

import (
	"context"
	"github.com/r3labs/diff"
	"github.com/stretchr/testify/assert"
	batchv1 "k8s.io/api/batch/v1"
	"k8s.io/api/batch/v1beta1"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes/fake"
	"k8s.io/utils/pointer"
	"kintoproj/kinto-deploy/internal/types"
	"testing"
)

// TODO change this test to be similar to deployment
func Test_upsertCronJob(t *testing.T) {
	kubeClient := fake.NewSimpleClientset()

	release := genDummyRelease()

	// create

	want := &v1beta1.CronJob{
		ObjectMeta: metav1.ObjectMeta{
			Name:      release.BlockName,
			Labels:    release.Labels,
			Namespace: release.EnvId,
		},
		Spec: v1beta1.CronJobSpec{
			Schedule:          release.JobSpec.CronPattern,
			Suspend:           pointer.BoolPtr(false),
			ConcurrencyPolicy: "Forbid",
			JobTemplate: v1beta1.JobTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: release.Labels,
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
			},
			SuccessfulJobsHistoryLimit: pointer.Int32Ptr(5),
			FailedJobsHistoryLimit:     pointer.Int32Ptr(5),
		},
	}

	got, _ := upsertCronJob(kubeClient, release)

	if diff.Changed(want, got) {
		changelog, _ := diff.Diff(want, got)
		t.Errorf("upsertCronJob_Create(fakeClient, %v); got and want different - %v", release, changelog)
	}

	// update

	release.EnvVars["dummyKey1"] = "dummyVal1"

	updateCronJobObject(release, want)

	got, _ = upsertCronJob(kubeClient, release)

	if diff.Changed(want, got) {
		changelog, _ := diff.Diff(want, got)
		t.Errorf("upsertCronJob_Update(fakeClient, %v); got and want different - %v", release, changelog)
	}
}

func Test_deleteCronJob(t *testing.T) {
	kubeClient := fake.NewSimpleClientset()
	release := genDummyRelease()

	// create cronjob
	cronjob, err := upsertCronJob(kubeClient, release)
	assert.NoError(t, err)

	// make sure the cronjob exists
	_, err = kubeClient.BatchV1beta1().CronJobs(release.EnvId).Get(context.TODO(), cronjob.Name, metav1.GetOptions{})
	assert.NoError(t, err)

	// delete the cronjob
	err = deleteCronJob(kubeClient, release.BlockName, release.EnvId)
	assert.NoError(t, err)

	// make sure the cronjob has been deleted
	_, err = kubeClient.BatchV1beta1().CronJobs(release.EnvId).Get(context.TODO(), cronjob.Name, metav1.GetOptions{})
	assert.Error(t, err)
}
