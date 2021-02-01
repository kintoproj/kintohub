package kube

import (
	"context"
	batchv1 "k8s.io/api/batch/v1"
	v1 "k8s.io/api/core/v1"
	k8serrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/wait"
	"k8s.io/client-go/kubernetes"
	"k8s.io/utils/pointer"
	"kinto.io/kinto-kube-deploy/internal/types"
	"time"
)

// job cannot be updated so we delete it if there is one existing
func upsertJob(kubeClient kubernetes.Interface, release *types.Release) (*batchv1.Job, error) {
	_, err :=
		kubeClient.BatchV1().Jobs(release.EnvId).Get(context.TODO(), release.BlockName, metav1.GetOptions{})

	if err == nil { // jobs cannot be updated so we delete the existing job
		err = kubeClient.BatchV1().Jobs(release.EnvId).Delete(context.TODO(), release.BlockName, metav1.DeleteOptions{})

		if err != nil {
			return nil, err
		}

		err =
			wait.PollImmediate(
				time.Second, 30*time.Second, waitForJobDeletion(kubeClient, release.EnvId, release.BlockName))

		if err != nil {
			return nil, err
		}
	}

	job := genJobObject(release)
	return kubeClient.BatchV1().Jobs(release.EnvId).Create(context.TODO(), job, metav1.CreateOptions{})
}

func waitForJobDeletion(kubeClient kubernetes.Interface, envId, blockName string) wait.ConditionFunc {
	return func() (bool, error) {
		_, err :=
			kubeClient.BatchV1().Jobs(envId).Get(context.TODO(), blockName, metav1.GetOptions{})

		if err != nil && k8serrors.IsNotFound(err) {
			return true, nil
		} else if err != nil {
			return false, err
		}

		return false, nil
	}
}

func deleteJob(kubeClient kubernetes.Interface, name, namespace string) error {
	_, err := kubeClient.BatchV1().Jobs(namespace).Get(
		context.TODO(), name, metav1.GetOptions{})

	if k8serrors.IsNotFound(err) {
		return nil
	} else if err != nil {
		return err
	}

	return kubeClient.BatchV1().Jobs(namespace).Delete(
		context.TODO(), name, metav1.DeleteOptions{})
}

func genJobObject(release *types.Release) *batchv1.Job {
	job := &batchv1.Job{
		ObjectMeta: metav1.ObjectMeta{
			Name:   release.BlockName,
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
	}
	return job
}
