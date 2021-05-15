package types

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestRepository_Validate(t *testing.T) {
	testCases := []struct {
		name      string
		repo      *Repository
		wantError bool
	}{
		{
			name: "repository ok",
			repo: &Repository{
				Url:    "https://github.com/gothinkster/react-redux-realworld-example-app.git",
				Branch: "master",
			},
			wantError: false,
		},
		{
			name: "url missing",
			repo: &Repository{
				Branch: "master",
			},
			wantError: true,
		},
		{
			name: "branch missing",
			repo: &Repository{
				Url: "https://github.com/gothinkster/react-redux-realworld-example-app.git",
			},
			wantError: true,
		},
	}

	for _, tc := range testCases {
		got := tc.repo.Validate()
		if !assert.Equal(t, tc.wantError, got != nil, tc.name) {
			t.Errorf("%v", got)
		}
	}
}

func TestRepository_isRepoUrlWithoutToken(t *testing.T) {
	testCases := []struct {
		name string
		url  string
		want bool
	}{
		{"github ok", "https://github.com/kintohub/kintohub.git", true},
		{"gitlab ok", "https://gitlab.com/kintohub/kintohub.git", true},
		{"bitbucket ok", "https://bitbucket.org/kintohub/kintohub.git", true},
		{"github funky org name ok", "https://github.com/k_1n_t-0-hub/kintohub.git", true},
		{"github funky repo name ok", "https://github.com/kintohub/k1nt0_-_hub.git", true},
		{"github repo name with dot ok", "https://github.com/kintohub/k.i.n.t.h.u.b.git", true},
		{"github repo without .git ok", "https://github.com/kintohub/kintohub", true},
		{"gitlab repo from kinto user - phoenix", "https://gitlab.com/jara_ng/phoenix", true},
		{"github repo with token not ok", "https://token@github.com/kintohub/kintohub.git", false},
	}

	for _, tc := range testCases {
		got := isRepoUrlWithoutToken(tc.url)
		if tc.want != got {
			t.Run(tc.name, func(t *testing.T) {
				t.Errorf(fmt.Sprintf("isRepoUrlWithoutToken(%s) = %t; want %t", tc.url, got, tc.want))
			})
		}
	}
}

func TestAutoScaling_Validate(t *testing.T) {
	testCases := []struct {
		name    string
		a       *AutoScaling
		wantErr bool
	}{
		{
			"autoscaling correct",
			&AutoScaling{Min: 1, Max: 2, CpuPercent: 30},
			false,
		},
		{
			"cpu percent is required",
			&AutoScaling{Min: 1, Max: 2},
			true,
		},
		{
			"max must be greater than min",
			&AutoScaling{Min: 2, Max: 1, CpuPercent: 30},
			true,
		},
		{
			"cpu percent is too low",
			&AutoScaling{Min: 1, Max: 2, CpuPercent: 10},
			true,
		},
		{
			"autoscaling correct 2",
			&AutoScaling{
				Min:        AutoScalingOpts.Values[0],
				Max:        AutoScalingOpts.Values[len(AutoScalingOpts.Values)-1],
				CpuPercent: 90,
			},
			false,
		},
	}

	for _, tc := range testCases {
		gotErr := tc.a.Validate()

		if !assert.Equal(t, tc.wantErr, gotErr != nil, tc.name) {
			t.Errorf("%v", gotErr)
		}
	}
}

func TestResources_Validate(t *testing.T) {
	testCases := []struct {
		name    string
		r       *Resources
		wantErr bool
	}{
		{
			"resources correct",
			&Resources{MemoryInMB: 32, CpuInCore: 0.1},
			false,
		},
		{
			"cpu optional",
			&Resources{MemoryInMB: 32},
			false,
		},
		{
			"cpu can be -1 - it means nil",
			&Resources{MemoryInMB: 32, CpuInCore: -1},
			false,
		},
		{
			"memory required",
			&Resources{CpuInCore: 0.1},
			true,
		},
		{
			"memory not within the allowed values",
			&Resources{MemoryInMB: 33, CpuInCore: 0.3},
			true,
		},
		{
			"cpu not within the allowed values",
			&Resources{MemoryInMB: 64, CpuInCore: 5},
			true,
		},
		{
			"resources correct 2",
			&Resources{
				MemoryInMB: MemoryOpts.Values[0],
				CpuInCore:  CPUOpts.Values[len(CPUOpts.Values)-1],
			},
			false,
		},
	}

	for _, tc := range testCases {
		gotErr := tc.r.Validate()

		if !assert.Equal(t, tc.wantErr, gotErr != nil, tc.name) {
			t.Errorf("%v", gotErr)
		}
	}
}

func TestRunConfig_Validate(t *testing.T) {
	testCases := []struct {
		name    string
		r       *RunConfig
		wantErr bool
	}{
		{
			name: "valid auto scale settings",
			r: &RunConfig{
				Type: Block_BACKEND_API,
				Port: "8080",
				AutoScaling: &AutoScaling{
					Min:        1,
					Max:        3,
					CpuPercent: 70,
				},
				Resources: &Resources{
					MemoryInMB: 512,
					CpuInCore:  .1,
				},
				TimeoutInSec: 60,
			},
			wantErr: false,
		},
		{
			name: "valid catalog settings",
			r: &RunConfig{
				Type:         Block_CATALOG,
				TimeoutInSec: 60,
			},
			wantErr: false,
		},
		{
			name: "missing resources",
			r: &RunConfig{
				Type:         Block_BACKEND_API,
				Port:         "8080",
				TimeoutInSec: 60,
				AutoScaling: &AutoScaling{
					Min:        1,
					Max:        3,
					CpuPercent: 70,
				},
			},
			wantErr: true,
		},
		{
			name: "passed autoscale with shared cpu not allowed",
			r: &RunConfig{
				Type:         Block_BACKEND_API,
				Port:         "8080",
				TimeoutInSec: 60,
				AutoScaling: &AutoScaling{
					Min:        1,
					Max:        3,
					CpuPercent: 70,
				},
				Resources: &Resources{
					MemoryInMB: 512,
					CpuInCore:  -1,
				},
			},
			wantErr: true,
		},
		{
			name: "jobs fine",
			r: &RunConfig{
				Type:         Block_JOB,
				TimeoutInSec: 60,
				Resources: &Resources{
					MemoryInMB: 512,
					CpuInCore:  -1,
				},
				JobSpec: &JobSpec{
					TimeoutInSec: 600,
				},
			},
			wantErr: false,
		},
	}

	for _, tc := range testCases {
		gotErr := tc.r.Validate()

		if !assert.Equal(t, tc.wantErr, gotErr != nil, tc.name) {
			t.Errorf("%v", gotErr)
		}
	}
}
