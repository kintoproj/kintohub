package kube

import (
	"context"
	"kintoproj/kinto-deploy/internal/types"

	autoscalingv1 "k8s.io/api/autoscaling/v1"
	k8serrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/utils/pointer"
)

func upsertHPA(kubeClient kubernetes.Interface, release *types.Release) (*autoscalingv1.HorizontalPodAutoscaler, error) {
	existingHPA, err :=
		kubeClient.AutoscalingV1().HorizontalPodAutoscalers(release.EnvId).Get(
			context.TODO(), release.BlockName, metav1.GetOptions{})

	if k8serrors.IsNotFound(err) {
		hpa := genHPAObject(release)
		return kubeClient.AutoscalingV1().HorizontalPodAutoscalers(release.EnvId).Create(
			context.TODO(), hpa, metav1.CreateOptions{})
	}

	updateHPAObject(release, existingHPA)
	return kubeClient.AutoscalingV1().HorizontalPodAutoscalers(release.EnvId).Update(
		context.TODO(), existingHPA, metav1.UpdateOptions{})
}

func deleteHPAIfExists(kubeClient kubernetes.Interface, name, namespace string) error {
	hpa, err := kubeClient.AutoscalingV1().HorizontalPodAutoscalers(namespace).Get(
		context.TODO(), name, metav1.GetOptions{})

	// HPA does not exist so no need to delete it
	// we are gonna enter this condition everytime the service autoscaling is disabled since we never check the previous release
	if k8serrors.IsNotFound(err) {
		return nil
	} else if err != nil {
		return err
	}

	return kubeClient.AutoscalingV1().HorizontalPodAutoscalers(hpa.Namespace).Delete(
		context.TODO(), hpa.Name, metav1.DeleteOptions{})
}

func genHPAObject(release *types.Release) *autoscalingv1.HorizontalPodAutoscaler {
	hpa := &autoscalingv1.HorizontalPodAutoscaler{
		ObjectMeta: metav1.ObjectMeta{
			Name:   release.BlockName,
			Labels: release.Labels,
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
	return hpa
}

func updateHPAObject(release *types.Release, hpa *autoscalingv1.HorizontalPodAutoscaler) {
	hpa.Spec.MinReplicas = pointer.Int32Ptr(release.HPA.Min)
	hpa.Spec.MaxReplicas = release.HPA.Max
	hpa.Spec.TargetCPUUtilizationPercentage = pointer.Int32Ptr(release.HPA.CpuPercent)
}
