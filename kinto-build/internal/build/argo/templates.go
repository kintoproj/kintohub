package argo

import (
	"fmt"
	"github.com/argoproj/argo/pkg/apis/workflow/v1alpha1"
	"github.com/kintoproj/kinto-build/internal/build/utils"
	"github.com/kintoproj/kinto-build/internal/config"
	"github.com/kintoproj/kinto-core/pkg/types"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	"k8s.io/utils/pointer"
	"strconv"
	"strings"
)

func genStepsTemplate(updateStatusStepEnabled bool) v1alpha1.Template {
	return v1alpha1.Template{
		Name: workflowEntrypoint,
		Steps: []v1alpha1.ParallelSteps{
			{
				Steps: []v1alpha1.WorkflowStep{
					{
						Name:     utils.WorkflowMainWorkflowTemplateName,
						Template: utils.WorkflowMainWorkflowTemplateName,
					},
					{
						Name:     utils.WorkflowUpdateReleaseStatusTemplateName,
						Template: utils.WorkflowUpdateReleaseStatusTemplateName,
						When:     strconv.FormatBool(updateStatusStepEnabled),
						Arguments: v1alpha1.Arguments{
							Parameters: []v1alpha1.Parameter{
								{
									Name:  stepUpdateReleaseStatusParameter,
									Value: pointer.StringPtr(types.BuildStatus_WORKING.String()),
								},
							},
						},
					},
				},
			},
		},
	}
}

func genOnExitHandlerStepsTemplate() v1alpha1.Template {
	return v1alpha1.Template{
		Name: workflowOnExit,
		Steps: []v1alpha1.ParallelSteps{
			{
				Steps: []v1alpha1.WorkflowStep{
					{
						Name:     fmt.Sprintf("%s-%s", utils.WorkflowUpdateReleaseStatusTemplateName, "success"),
						Template: utils.WorkflowUpdateReleaseStatusTemplateName,
						When:     "{{workflow.status}} == Succeeded",
						Arguments: v1alpha1.Arguments{
							Parameters: []v1alpha1.Parameter{
								{
									Name:  stepUpdateReleaseStatusParameter,
									Value: pointer.StringPtr(types.BuildStatus_SUCCESS.String()),
								},
							},
						},
					},
					{
						Name:     fmt.Sprintf("%s-%s", utils.WorkflowUpdateReleaseStatusTemplateName, "failure"),
						Template: utils.WorkflowUpdateReleaseStatusTemplateName,
						When:     "{{workflow.status}} != Succeeded",
						Arguments: v1alpha1.Arguments{
							Parameters: []v1alpha1.Parameter{
								{
									Name:  stepUpdateReleaseStatusParameter,
									Value: pointer.StringPtr(types.BuildStatus_FAILURE.String()),
								},
							},
						},
					},
				},
			},
		},
	}
}

func genWorkflowUpdateStatusTemplate(envId, blockName, releaseId, kintoCoreHost string, kintoCoreOverTls bool) v1alpha1.Template {
	return v1alpha1.Template{
		Name: utils.WorkflowUpdateReleaseStatusTemplateName,
		Inputs: v1alpha1.Inputs{
			Parameters: []v1alpha1.Parameter{
				{
					Name: stepUpdateReleaseStatusParameter,
				},
			},
		},
		Container: &corev1.Container{
			Name:            "main",
			Image:           config.ArgoWorkflowCliImage,
			ImagePullPolicy: getImagePullPolicy(config.ArgoWorkflowImagePullPolicy),
			Args: []string{
				"release",
				"status",
				fmt.Sprintf("--kintoCoreHost=%s", kintoCoreHost),
				fmt.Sprintf("--kintoCoreOverTls=%t", kintoCoreOverTls),
				fmt.Sprintf("--envId=%s", envId),
				fmt.Sprintf("--blockName=%s", blockName),
				fmt.Sprintf("--releaseId=%s", releaseId),
				fmt.Sprintf("--status={{inputs.parameters.%s}}", stepUpdateReleaseStatusParameter),
			},
		},
	}
}

func genMainWorkflowTemplate() v1alpha1.Template {
	return v1alpha1.Template{
		Name: utils.WorkflowMainWorkflowTemplateName,
		Container: &corev1.Container{
			Name:            "main",
			Image:           config.ArgoWorkflowMainImage,
			ImagePullPolicy: getImagePullPolicy(config.ArgoWorkflowImagePullPolicy),
			WorkingDir:      workflowWorkingDir,
			VolumeMounts: []corev1.VolumeMount{
				{
					Name:      workflowVolumeName,
					MountPath: workflowWorkingDir,
				},
				// https://github.com/GoogleContainerTools/kaniko/blob/master/examples/pod.yaml
				{
					Name:      config.ArgoWorkflowDockerSecret,
					MountPath: "/kaniko/.docker",
				},
			},
			Resources: genWorkflowResource(),
		},
	}
}

func genWorkflowResource() corev1.ResourceRequirements {
	resources := corev1.ResourceRequirements{
		Requests: corev1.ResourceList{},
		Limits:   corev1.ResourceList{},
	}

	if config.ArgoWorkflowVolumeSize != "" {
		resources.Requests[corev1.ResourceEphemeralStorage] = resource.MustParse(config.ArgoWorkflowVolumeSize)
		resources.Limits[corev1.ResourceEphemeralStorage] = resource.MustParse(config.ArgoWorkflowVolumeSize)
	}

	if config.ArgoWorkflowMemoryRequest != "" {
		resources.Requests[corev1.ResourceMemory] = resource.MustParse(config.ArgoWorkflowMemoryRequest)
	}

	if config.ArgoWorkflowCPURequest != "" {
		resources.Requests[corev1.ResourceCPU] = resource.MustParse(config.ArgoWorkflowCPURequest)
	}

	if config.ArgoWorkflowMemoryLimit != "" {
		resources.Limits[corev1.ResourceMemory] = resource.MustParse(config.ArgoWorkflowMemoryLimit)
	}

	if config.ArgoWorkflowCPULimit != "" {
		resources.Limits[corev1.ResourceCPU] = resource.MustParse(config.ArgoWorkflowCPULimit)
	}

	return resources
}

func genBuildAndDeployWorkflow(
	envId, blockName, releaseId, kintoCoreHost string,
	buildConfig *types.BuildConfig,
	kintoCoreOverTls, isStaticBuild bool) v1alpha1.Template {

	var envVars []corev1.EnvVar

	envVars = append(envVars, corev1.EnvVar{Name: envVarGitInitEnabled, Value: "true"})
	envVars = append(envVars,
		genEnvVarsGitInit(buildConfig.Repository, envId, blockName, releaseId, kintoCoreHost, kintoCoreOverTls)...)

	if buildConfig.Language != types.BuildConfig_DOCKERFILE {
		envVars = append(envVars, corev1.EnvVar{Name: envVarKintoCliDockerEnabled, Value: "true"})
		envVars = append(envVars, genEnvVarsKintoCliDockerfile(buildConfig, isStaticBuild)...)
	}

	envVars = append(envVars, corev1.EnvVar{Name: envVarBuildSvcEnabled, Value: "true"})
	envVars = append(envVars, genEnvVarsKintoBuildSvc(buildConfig)...)

	envVars = append(envVars, genEnvVarsKintoDeploy(envId, blockName, releaseId, types.Release_DEPLOY)...)

	template := genMainWorkflowTemplate()
	template.Container.Env = envVars

	return template
}

func genDeployOnlyWorkflow(envId, blockName, releaseId string, releaseType types.Release_Type) v1alpha1.Template {
	var envVars []corev1.EnvVar

	envVars = append(envVars, genEnvVarsKintoDeploy(envId, blockName, releaseId, releaseType)...)

	template := genMainWorkflowTemplate()
	template.Container.Env = envVars

	return template
}

func genDeployCatalogWorkflow(
	envId, blockName, releaseId, kintoCoreHost string, repo *types.Repository, kintoCoreOverTls bool) v1alpha1.Template {

	var envVars []corev1.EnvVar

	envVars = append(envVars, corev1.EnvVar{Name: envVarGitInitEnabled, Value: "true"})
	envVars = append(envVars, genEnvVarsGitInit(repo, envId, blockName, releaseId, kintoCoreHost, kintoCoreOverTls)...)

	envVars = append(envVars, genEnvVarsKintoDeploy(envId, blockName, releaseId, types.Release_DEPLOY)...)

	template := genMainWorkflowTemplate()
	template.Container.Env = envVars

	return template
}

func genEnvVarsGitInit(
	repo *types.Repository, envId, blockName, releaseId, kintoCoreHost string, kintoCoreOverTls bool) []corev1.EnvVar {

	return []corev1.EnvVar{
		{
			Name:  "KINTO_CLI_GIT_INIT_REPO_URL",
			Value: utils.GenSourceURLWithToken(repo.Url, repo.AccessToken),
		},
		{
			Name:  "KINTO_CLI_GIT_INIT_BRANCH",
			Value: repo.Branch,
		},
		{
			Name:  "KINTO_CLI_RELEASE_COMMIT_KINTO_CORE_HOST",
			Value: kintoCoreHost,
		},
		{
			Name:  "KINTO_CLI_RELEASE_COMMIT_KINTO_CORE_OVER_TLS",
			Value: strconv.FormatBool(kintoCoreOverTls),
		},
		{
			Name:  "KINTO_CLI_RELEASE_COMMIT_ENV_ID",
			Value: envId,
		},
		{
			Name:  "KINTO_CLI_RELEASE_COMMIT_BLOCK_NAME",
			Value: blockName,
		},
		{
			Name:  "KINTO_CLI_RELEASE_COMMIT_RELEASE_ID",
			Value: releaseId,
		},
	}
}

func genEnvVarsKintoCliDockerfile(buildConfig *types.BuildConfig, isStaticBuild bool) []corev1.EnvVar {
	return []corev1.EnvVar{
		{
			Name:  "KINTO_CLI_DOCKERFILE_LANGUAGE",
			Value: buildConfig.Language.String(),
		},
		{
			Name:  "KINTO_CLI_DOCKERFILE_LANGUAGE_VERSION",
			Value: buildConfig.LanguageVersion,
		},
		{
			Name:  "KINTO_CLI_DOCKERFILE_BUILD_COMMAND",
			Value: buildConfig.BuildCommand,
		},
		{
			Name:  "KINTO_CLI_DOCKERFILE_RUN_COMMAND",
			Value: buildConfig.RunCommand,
		},
		{
			Name:  "KINTO_CLI_DOCKERFILE_PATH_IN_REPO",
			Value: buildConfig.PathToCode,
		},
		{
			Name:  "KINTO_CLI_DOCKERFILE_PATH_TO_STATIC_OUTPUT_IN_REPO",
			Value: buildConfig.PathToStaticOutput,
		},
		{
			Name:  "KINTO_CLI_DOCKERFILE_IS_STATIC_BUILD",
			Value: strconv.FormatBool(isStaticBuild),
		},
		{
			Name:  "KINTO_CLI_DOCKERFILE_EXTRA_ARGS",
			Value: genKintoCliDockerfileExtraArgsWithBuildArgs(buildConfig.BuildArgs),
		},
	}
}

func genEnvVarsKintoBuildSvc(buildConfig *types.BuildConfig) []corev1.EnvVar {
	return []corev1.EnvVar{
		{
			Name:  "BUILD_SVC_IMAGE",
			Value: fmt.Sprintf("%s/%s", config.ImageRegistryHost, buildConfig.Image),
		},
		{
			Name:  "BUILD_SVC_PATH_IN_REPO",
			Value: buildConfig.PathToCode,
		},
		{
			Name:  "BUILD_SVC_DOCKERFILE_NAME",
			Value: buildConfig.DockerfileFileName,
		},
		{
			Name:  "BUILD_SVC_EXTRA_ARGS",
			Value: genBuildStepExtraArgsWithBuildArgs(buildConfig.BuildArgs),
		},
	}
}

func genEnvVarsKintoDeploy(envId, blockName, releaseId string, releaseType types.Release_Type) []corev1.EnvVar {
	return []corev1.EnvVar{
		{
			Name:  "LOG_LEVEL",
			Value: config.LogLevel,
		},
		{
			Name:  "NAMESPACE",
			Value: envId,
		},
		{
			Name:  "BLOCK_NAME",
			Value: blockName,
		},
		{
			Name:  "RELEASE_ID",
			Value: releaseId,
		},
		{
			Name:  "RELEASE_TYPE",
			Value: releaseType.String(),
		},
		{
			Name:  "IMAGE_REGISTRY_HOST",
			Value: config.ImageRegistryHost,
		},
		{
			Name:  "PROXLESS_FQDN",
			Value: config.ProxlessFQDN,
		},
	}
}

func genKintoCliDockerfileExtraArgsWithBuildArgs(buildArgs map[string]string) string {
	args := "--build-args="
	for k := range buildArgs {
		args += fmt.Sprintf("%s,", strings.ReplaceAll(k, " ", ""))
	}
	args = strings.TrimSuffix(args, ",")
	return args
}

func genBuildStepExtraArgsWithBuildArgs(buildArgs map[string]string) string {
	args := ""
	for k, v := range buildArgs {
		args += fmt.Sprintf("--build-arg=%s=%s ", k, strings.ReplaceAll(v, " ", ""))
	}
	return args
}
