package kube

import (
	"testing"

	"github.com/r3labs/diff"
	v1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
)

func Test_genResourceRequirements(t *testing.T) {
	testCases := []struct {
		testId      int
		cpu, memory string
		want        *v1.ResourceRequirements
	}{
		{
			testId: 0,
			cpu:    "100m",
			memory: "100Mi",
			want: &v1.ResourceRequirements{
				Limits: v1.ResourceList{
					v1.ResourceCPU:    resource.MustParse("100m"),
					v1.ResourceMemory: resource.MustParse("100Mi"),
				},
				Requests: v1.ResourceList{
					v1.ResourceCPU:    resource.MustParse("100m"),
					v1.ResourceMemory: resource.MustParse("100Mi"),
				},
			},
		},
		{
			testId: 1,
			cpu:    "",
			memory: "",
			want:   &v1.ResourceRequirements{},
		},
	}

	for _, tc := range testCases {
		got := genResourceRequirements(tc.cpu, tc.memory)

		if diff.Changed(got, tc.want) {
			t.Errorf("genResourceRequirements(%s, %s) = %v; want = %v", tc.cpu, tc.memory, got, tc.want)
		}
	}
}

func Test_genEnvVars(t *testing.T) {
	testCases := []struct {
		envVars map[string]string
		want    []v1.EnvVar
	}{
		{
			envVars: map[string]string{"dummyKey0": "dummyValue0"},
			want: []v1.EnvVar{
				{Name: "dummyKey0", Value: "dummyValue0"},
			},
		},
		{
			envVars: nil,
			want:    []v1.EnvVar{},
		},
	}

	for _, tc := range testCases {
		got := genEnvVars(tc.envVars)

		if diff.Changed(got, tc.want) {
			t.Errorf("genEnvVars(%s) = %v; want = %v", tc.envVars, got, tc.want)
		}
	}
}
