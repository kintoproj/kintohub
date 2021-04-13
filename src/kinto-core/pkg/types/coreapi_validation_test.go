package types

import (
	"errors"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestCreateBlockRequest_Validate(t *testing.T) {
	tests := []struct {
		testName string
		block    *CreateBlockRequest
		error    error
	}{
		{
			testName: "Valid Create Request without dash",
			block: &CreateBlockRequest{
				EnvId: uuid.New().String(),
				Name:  "webapp",
				RunConfig: &RunConfig{
					Type:         Block_BACKEND_API,
					Port:         "8080",
					TimeoutInSec: 60,
					AutoScaling: &AutoScaling{
						Min:        1,
						Max:        10,
						CpuPercent: 50,
					},
					EnvVars: map[string]string{
						"SERVER_PORT": "8080",
					},
					Resources: &Resources{
						CpuInCore:  0.5,
						MemoryInMB: 512,
					},
				},
				BuildConfig: &BuildConfig{
					Language:           BuildConfig_DOCKERFILE,
					DockerfileFileName: "Dockerfile",
					PathToCode:         "./",
					Repository: &Repository{
						Url:         "https://github.com/kintohub/backend-api.git",
						AccessToken: "abcd1234",
						Branch:      "master",
					},
				},
			},
		},
		{
			testName: "Valid Create Request with dash",
			block: &CreateBlockRequest{
				EnvId: uuid.New().String(),
				Name:  "web-app",
				RunConfig: &RunConfig{
					Type:         Block_BACKEND_API,
					Port:         "8080",
					TimeoutInSec: 60,
					AutoScaling: &AutoScaling{
						Min:        1,
						Max:        10,
						CpuPercent: 50,
					},
					EnvVars: map[string]string{
						"SERVER_PORT": "8080",
					},
					Resources: &Resources{
						CpuInCore:  0.5,
						MemoryInMB: 512,
					},
				},
				BuildConfig: &BuildConfig{
					Language:           BuildConfig_DOCKERFILE,
					DockerfileFileName: "Dockerfile",
					PathToCode:         "./",
					Repository: &Repository{
						Url:         "https://github.com/kintohub/backend-api.git",
						AccessToken: "abcd1234",
						Branch:      "master",
					},
				},
			},
		},
		{
			testName: "Invalid Name with start dash",
			error:    errors.New("name: must be in a valid format."),
			block: &CreateBlockRequest{
				EnvId: uuid.New().String(),
				Name:  "-web-app",
				RunConfig: &RunConfig{
					Type:         Block_BACKEND_API,
					Port:         "8080",
					TimeoutInSec: 60,
					AutoScaling: &AutoScaling{
						Min:        1,
						Max:        10,
						CpuPercent: 50,
					},
					EnvVars: map[string]string{
						"SERVER_PORT": "8080",
					},
					Resources: &Resources{
						CpuInCore:  0.5,
						MemoryInMB: 512,
					},
				},
				BuildConfig: &BuildConfig{
					Language:           BuildConfig_DOCKERFILE,
					DockerfileFileName: "Dockerfile",
					PathToCode:         "./",
					Repository: &Repository{
						Url:         "https://github.com/kintohub/backend-api.git",
						AccessToken: "abcd1234",
						Branch:      "master",
					},
				},
			},
		},
		{
			testName: "Invalid Name with end dash",
			error:    errors.New("name: must be in a valid format."),
			block: &CreateBlockRequest{
				EnvId: uuid.New().String(),
				Name:  "web-app-",
				RunConfig: &RunConfig{
					Type:         Block_BACKEND_API,
					Port:         "8080",
					TimeoutInSec: 60,
					AutoScaling: &AutoScaling{
						Min:        1,
						Max:        10,
						CpuPercent: 50,
					},
					EnvVars: map[string]string{
						"SERVER_PORT": "8080",
					},
					Resources: &Resources{
						CpuInCore:  0.5,
						MemoryInMB: 512,
					},
				},
				BuildConfig: &BuildConfig{
					Language:           BuildConfig_DOCKERFILE,
					DockerfileFileName: "Dockerfile",
					PathToCode:         "./",
					Repository: &Repository{
						Url:         "https://github.com/kintohub/backend-api.git",
						AccessToken: "abcd1234",
						Branch:      "master",
					},
				},
			},
		},
		{
			testName: "Invalid Name with special characters",
			error:    errors.New("name: must be in a valid format."),
			block: &CreateBlockRequest{
				EnvId: uuid.New().String(),
				Name:  "web$$$app",
				RunConfig: &RunConfig{
					Type:         Block_BACKEND_API,
					Port:         "8080",
					TimeoutInSec: 60,
					AutoScaling: &AutoScaling{
						Min:        1,
						Max:        10,
						CpuPercent: 50,
					},
					EnvVars: map[string]string{
						"SERVER_PORT": "8080",
					},
					Resources: &Resources{
						CpuInCore:  0.5,
						MemoryInMB: 512,
					},
				},
				BuildConfig: &BuildConfig{
					Language:           BuildConfig_DOCKERFILE,
					DockerfileFileName: "Dockerfile",
					PathToCode:         "./",
					Repository: &Repository{
						Url:         "https://github.com/kintohub/backend-api.git",
						AccessToken: "abcd1234",
						Branch:      "master",
					},
				},
			},
		},
	}

	for _, test := range tests {
		t.Run(test.testName, func(t *testing.T) {
			err := test.block.Validate()

			if test.error == nil {
				assert.NoError(t, err)
			} else {
				assert.EqualError(t, err, test.error.Error())
			}
		})
	}
}

func TestDeleteEnvironmentRequest_Validate(t *testing.T) {
	tests := []struct {
		testName  string
		namespace *DeleteEnvironmentRequest
		error     error
	}{
		{
			testName: "Valid Request",
			namespace: &DeleteEnvironmentRequest{
				Id: uuid.New().String(),
			},
		},
		{
			testName: "Required Env ID",
			namespace: &DeleteEnvironmentRequest{
				Id: "",
			},
			error: errors.New("id: cannot be blank."),
		},
	}

	for _, test := range tests {
		t.Run(test.testName, func(t *testing.T) {
			err := test.namespace.Validate()

			if test.error == nil {
				assert.NoError(t, err)
			} else {
				assert.EqualError(t, err, test.error.Error())
			}
		})
	}
}
