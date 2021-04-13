package kube

import (
	"fmt"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	"k8s.io/apimachinery/pkg/util/intstr"
	"strings"
)

const (
	probeFailureThreshold = int32(3)
)

func labelsToLabelSelector(labels map[string]string) string {
	labelSelector := ""

	for k, v := range labels {
		labelSelector += fmt.Sprintf("%s=%s,", k, v)
	}

	if labelSelector != "" {
		// remove the last `,`
		labelSelector = strings.TrimSuffix(labelSelector, ",")
	}

	return labelSelector
}

func genResourceRequirements(cpu, memory string) corev1.ResourceRequirements {
	if memory == "" && cpu == "" {
		return corev1.ResourceRequirements{}
	}

	resources := corev1.ResourceList{}
	if memory != "" {
		resources[corev1.ResourceMemory] = resource.MustParse(memory)
	}
	if cpu != "" {
		resources[corev1.ResourceCPU] = resource.MustParse(cpu)
	}

	return corev1.ResourceRequirements{
		Limits:   resources,
		Requests: resources,
	}
}

func genContainerPortList(port int32) []corev1.ContainerPort {
	return []corev1.ContainerPort{
		{
			ContainerPort: port,
		},
	}
}

func genProbe(port, timeoutInSec int32) *corev1.Probe {
	periodInSeconds := timeoutInSec / probeFailureThreshold

	return &corev1.Probe{
		Handler: corev1.Handler{
			TCPSocket: &corev1.TCPSocketAction{
				Port: intstr.IntOrString{
					IntVal: port,
				},
			},
		},
		TimeoutSeconds:   1,
		PeriodSeconds:    periodInSeconds,
		SuccessThreshold: 1,
		FailureThreshold: probeFailureThreshold,
	}
}

func genEnvVars(envMap map[string]string) []corev1.EnvVar {
	var envVars []corev1.EnvVar
	for k, v := range envMap {
		envVars = append(envVars, corev1.EnvVar{
			Name:  k,
			Value: v,
		})
	}
	return envVars
}

func genImagePullSecrets(imagePullSecret string) []corev1.LocalObjectReference {
	if imagePullSecret != "" {
		return []corev1.LocalObjectReference{
			{
				Name: imagePullSecret,
			},
		}
	}
	return []corev1.LocalObjectReference{}
}
