package kube

import (
	"context"
	"encoding/json"
	"fmt"
	batchv1 "k8s.io/api/batch/v1"
	"k8s.io/api/batch/v1beta1"
	v1 "k8s.io/api/core/v1"
	k8serrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	k8stypes "k8s.io/apimachinery/pkg/types"
	"k8s.io/client-go/kubernetes"
	"k8s.io/utils/pointer"
	"kintoproj/kinto-deploy/internal/types"
)

func upsertCronJob(kubeClient kubernetes.Interface, release *types.Release) (*v1beta1.CronJob, error) {
	existingCronJob, err :=
		kubeClient.BatchV1beta1().CronJobs(release.EnvId).Get(context.TODO(), release.BlockName, metav1.GetOptions{})

	if k8serrors.IsNotFound(err) {
		cronjob := genCronJobObject(release)
		return kubeClient.BatchV1beta1().CronJobs(release.EnvId).Create(context.TODO(), cronjob, metav1.CreateOptions{})
	}

	updateCronJobObject(release, existingCronJob)
	return kubeClient.BatchV1beta1().CronJobs(release.EnvId).Update(
		context.TODO(), existingCronJob, metav1.UpdateOptions{})
}

func deleteCronJob(kubeClient kubernetes.Interface, name, namespace string) error {
	_, err := kubeClient.BatchV1beta1().CronJobs(namespace).Get(
		context.TODO(), name, metav1.GetOptions{})

	if k8serrors.IsNotFound(err) {
		return nil
	} else if err != nil {
		return err
	}

	return kubeClient.BatchV1beta1().CronJobs(namespace).Delete(
		context.TODO(), name, metav1.DeleteOptions{})
}

func suspendCronJob(kubeClient kubernetes.Interface, blockName, namespace string) []error {
	var errs []error

	cjs, err := kubeClient.BatchV1beta1().CronJobs(namespace).List(
		context.TODO(),
		metav1.ListOptions{
			LabelSelector: fmt.Sprintf("app=%s", blockName),
		})

	if err != nil {
		return append(errs, err)
	}

	if len(cjs.Items) == 0 {
		return nil
	}

	type patchBoolValue struct {
		Op    string `json:"op"`
		Path  string `json:"path"`
		Value bool   `json:"value"`
	}
	payload := []patchBoolValue{{
		Op:    "replace",
		Path:  "/spec/suspend",
		Value: true,
	}}

	payloadBytes, err := json.Marshal(payload)

	if err != nil {
		return append(errs, err)
	}

	for _, cj := range cjs.Items {
		_, err = kubeClient.
			BatchV1beta1().
			CronJobs(namespace).
			Patch(context.TODO(), cj.Name, k8stypes.JSONPatchType, payloadBytes, metav1.PatchOptions{})

		if err != nil {
			errs = append(errs, err)
		}
	}

	return errs
}

func genCronJobObject(release *types.Release) *v1beta1.CronJob {
	cronJob := &v1beta1.CronJob{
		ObjectMeta: metav1.ObjectMeta{
			Name:   release.BlockName,
			Labels: release.Labels,
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
					Template: v1.PodTemplateSpec{
						ObjectMeta: metav1.ObjectMeta{
							Labels: types.EnrichLabels(release.Labels, release.Id),
						},
						Spec: v1.PodSpec{
							ImagePullSecrets: genImagePullSecrets(release.ImagePullSecret),
							Containers: []v1.Container{
								{
									Name:      release.BlockName,
									Image:     release.Image,
									Env:       genEnvVars(release.EnvVars),
									Resources: genResourceRequirements(release.Cpu, release.Memory),
								},
							},
							RestartPolicy:                "Never",
							AutomountServiceAccountToken: pointer.BoolPtr(false),
						},
					},
				},
			},
			SuccessfulJobsHistoryLimit: pointer.Int32Ptr(5), // TODO make this configurable?
			FailedJobsHistoryLimit:     pointer.Int32Ptr(5), // TODO make this configurable?
		},
	}
	return cronJob
}

func updateCronJobObject(release *types.Release, cronJob *v1beta1.CronJob) {
	cronJob.Spec.Schedule = release.JobSpec.CronPattern
	cronJob.Spec.Suspend = pointer.BoolPtr(false)
	cronJob.Spec.JobTemplate.Spec.ActiveDeadlineSeconds = pointer.Int64Ptr(int64(release.JobSpec.TimeoutInSec))
	cronJob.Spec.JobTemplate.Spec.Template.ObjectMeta.Labels = types.EnrichLabels(release.Labels, release.Id)
	for i := range cronJob.Spec.JobTemplate.Spec.Template.Spec.Containers {
		container := &cronJob.Spec.JobTemplate.Spec.Template.Spec.Containers[i]
		if container.Name == release.BlockName {
			container.Image = release.Image
			container.Env = genEnvVars(release.EnvVars)
			container.Resources = genResourceRequirements(release.Cpu, release.Memory)
			break
		}
	}
}
