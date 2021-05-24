package controller

import (
	"testing"

	"github.com/kintoproj/kintohub/core/pkg/types"
	"github.com/stretchr/testify/assert"
)

func Test_getExistingBuildIdIfPossible(t *testing.T) {
	buildConfig := &types.BuildConfig{
		Language:        4,
		LanguageVersion: "14",
		BuildCommand:    "npm install",
		RunCommand:      "npm start",
		PathToCode:      ".",
		BuildArgs: map[string]string{
			"KEY0": "VAL0",
		},
		Repository: &types.Repository{
			Url:    "https://github.com/kintohub/test.git",
			Branch: "master",
		},
	}

	testCases := []struct {
		name     string
		releases map[string]*types.Release
		wantNil  bool
	}{
		{
			name: "status successful and build match - return build",
			releases: map[string]*types.Release{
				"": {
					RunConfig: &types.RunConfig{
						Port: "80",
					},
					BuildConfig: &types.BuildConfig{
						Id:              "match",
						Image:           "kintohub/test:latest",
						Language:        4,
						LanguageVersion: "14",
						BuildCommand:    "npm install",
						RunCommand:      "npm start",
						PathToCode:      ".",
						BuildArgs: map[string]string{
							"KEY0": "VAL0",
						},
						Repository: &types.Repository{
							Url:    "https://github.com/kintohub/test.git",
							Branch: "master",
						},
					},
					Status: &types.Status{
						State: types.Status_SUCCESS,
					},
				},
			},
			wantNil: false,
		},
		{
			name: "build match but status is failed - return nil",
			releases: map[string]*types.Release{
				"": {
					BuildConfig: &types.BuildConfig{
						Id:              "match",
						Image:           "kintohub/test:latest",
						Language:        4,
						LanguageVersion: "14",
						BuildCommand:    "npm install",
						RunCommand:      "npm start",
						PathToCode:      ".",
						BuildArgs: map[string]string{
							"KEY0": "VAL0",
						},
						Repository: &types.Repository{
							Url:    "https://github.com/kintohub/test.git",
							Branch: "master",
						},
					},
					Status: &types.Status{
						State: types.Status_FAIL,
					},
				},
			},
			wantNil: true,
		},
		{
			name: "status successfull but build does not match - return nil",
			releases: map[string]*types.Release{
				"": {
					BuildConfig: &types.BuildConfig{
						Id:              "don't match",
						Image:           "kintohub/test:latest",
						Language:        4,
						LanguageVersion: "14",
						BuildCommand:    "npm install",
						RunCommand:      "npm start",
						PathToCode:      ".",
						BuildArgs: map[string]string{
							"KEY0": "VAL0",
						},
						Repository: &types.Repository{
							Url:    "https://github.com/kintohub/test.git",
							Branch: "dev", // branch different
						},
					},
					Status: &types.Status{
						State: types.Status_SUCCESS,
					},
				},
			},
			wantNil: true,
		},
	}

	for _, tc := range testCases {
		got, _ := getExistingBuildIdIfPossible(buildConfig, tc.releases)

		assert.Equal(t, tc.wantNil, got == nil, tc.name)
		assert.Equal(t, "", buildConfig.Id, tc.name)    // we make sure the buildconfig id is not getting updated in the func
		assert.Equal(t, "", buildConfig.Image, tc.name) // we make sure the buildconfig image is not getting updated in the func
	}
}
