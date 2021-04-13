package types

import (
	"errors"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestAbortReleaseRequest_Validate(t *testing.T) {
	tests := []struct {
		testName string
		abortReq *AbortReleaseRequest
		error    error
	}{
		{
			testName: "Valid Request",
			abortReq: &AbortReleaseRequest{
				BuildId: uuid.New().String(),
				EnvId:   uuid.New().String(),
			},
		},
		{
			testName: "Required buildId ID",
			abortReq: &AbortReleaseRequest{
				BuildId: "",
				EnvId:   uuid.New().String(),
			},
			error: errors.New("buildId: cannot be blank."),
		},
		{
			testName: "Required envId ID",
			abortReq: &AbortReleaseRequest{
				BuildId: uuid.New().String(),
				EnvId:   "",
			},
			error: errors.New("envId: cannot be blank."),
		},
	}

	for _, test := range tests {
		t.Run(test.testName, func(t *testing.T) {
			err := test.abortReq.Validate()

			if test.error == nil {
				assert.NoError(t, err)
			} else {
				assert.EqualError(t, err, test.error.Error())
			}
		})
	}
}

func TestBuildAndDeployRequest_Validate(t *testing.T) {
	type fields struct {
		BuildConfig   *BuildConfig
		BlockName     string
		ReleaseId     string
		Namespace     string
		IsStaticBuild bool
	}
	tests := []struct {
		name    string
		fields  fields
		wantErr bool
	}{
		{
			name: "test with all valid input",
			fields: fields{
				BuildConfig: &BuildConfig{
					Id:                 uuid.New().String(),
					Image:              uuid.New().String(),
					Language:           1,
					LanguageVersion:    "",
					BuildCommand:       "",
					RunCommand:         "",
					PathToCode:         ".",
					PathToStaticOutput: "",
					DockerfileFileName: "Dockerfile",
					BuildArgs:          nil,
					Repository: &Repository{
						Url:             "https://github.com/nandiheath/test",
						AccessToken:     "",
						Branch:          "master",
						GithubUserToken: "",
					},
				},
				BlockName:     "test",
				ReleaseId:     uuid.New().String(),
				Namespace:     "551236643f234",
				IsStaticBuild: false, // make sure boolean is not validated
			},
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := BuildAndDeployRequest{
				BuildConfig:   tt.fields.BuildConfig,
				BlockName:     tt.fields.BlockName,
				ReleaseId:     tt.fields.ReleaseId,
				Namespace:     tt.fields.Namespace,
				IsStaticBuild: tt.fields.IsStaticBuild,
			}
			if err := req.Validate(); (err != nil) != tt.wantErr {
				t.Errorf("Validate() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
