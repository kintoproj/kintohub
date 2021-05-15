package argo

const (
	workflowWorkingDir = "/workspace"

	workflowVolumeName = "node-volume"

	workflowEntrypoint = "workflow-main"
	workflowOnExit     = "workflow-on-exit"

	stepUpdateReleaseStatusParameter = "status"

	envVarGitInitEnabled        = "KINTO_CLI_GIT_INIT_ENABLED"
	envVarKintoCliDockerEnabled = "KINTO_CLI_DOCKERFILE_ENABLED"
	envVarBuildSvcEnabled       = "BUILD_SVC_ENABLED"
	envVarImagePullSecret       = "IMAGE_PULL_SECRET"
)
