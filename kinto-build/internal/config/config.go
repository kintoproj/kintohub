package config

import (
	_ "github.com/joho/godotenv/autoload"
	"github.com/kintohub/utils-go/config"
	"os"
)

var (
	LogLevel   string
	ServerPort string

	ImageRegistryHost string

	UserFriendlyBuildLogsEnabled bool

	KintoCoreHostname string
	KintoCoreOverTls  bool

	ProxlessFQDN string

	WorkflowTimeout int

	ArgoKubeConfigPath             string
	ArgoWorkflowTTL                int
	ArgoWorkflowDockerSecret       string
	ArgoWorkflowServiceAccount     string
	ArgoWorkflowNamespace          string
	ArgoWorkflowMinioHost          string
	ArgoWorkflowMinioAccessKey     string
	ArgoWorkflowMinioSecretKey     string
	ArgoWorkflowMinioBucket        string
	ArgoWorkflowNodePoolLabelValue string
	ArgoWorkflowImagePullPolicy    string
	ArgoWorkflowMainImage          string
	ArgoWorkflowCliImage           string
	ArgoWorkflowVolumeSize         string
	ArgoWorkflowMemoryLimit        string
	ArgoWorkflowCPULimit           string
	ArgoWorkflowMemoryRequest      string
	ArgoWorkflowCPURequest         string
)

func LoadConfig() {
	LogLevel = config.GetString("LOG_LEVEL", "info")
	ServerPort = config.GetString("SERVER_PORT", "8080")

	ImageRegistryHost = config.GetStringOrDie("IMAGE_REGISTRY_HOST")

	UserFriendlyBuildLogsEnabled = config.GetBool("USER_FRIENDLY_BUILD_LOGS_ENABLED", true)

	KintoCoreHostname = config.GetStringOrDie("KINTO_CORE_HOST_NAME")
	KintoCoreOverTls = config.GetBool("KINTO_CORE_OVER_TLS", false)

	ProxlessFQDN = config.GetStringOrDie("PROXLESS_FQDN")

	WorkflowTimeout = config.GetInt("WORKFLOW_TIMEOUT", 600)

	ArgoKubeConfigPath = os.Getenv("ARGO_KUBE_CONFIG_PATH")
	ArgoWorkflowTTL = config.GetInt("ARGO_WORKFLOW_TTL_SECONDS", 600)
	ArgoWorkflowDockerSecret = config.GetStringOrDie("ARGO_WORKFLOW_DOCKER_SECRET")
	ArgoWorkflowServiceAccount = config.GetStringOrDie("ARGO_WORKFLOW_SERVICE_ACCOUNT")
	ArgoWorkflowNamespace = config.GetString("ARGO_WORKFLOW_NAMESPACE", "argo")
	ArgoWorkflowMinioHost = config.GetStringOrDie("ARGO_WORKFLOW_MINIO_HOST")
	ArgoWorkflowMinioAccessKey = config.GetStringOrDie("ARGO_WORKFLOW_MINIO_ACCESS_KEY")
	ArgoWorkflowMinioSecretKey = config.GetStringOrDie("ARGO_WORKFLOW_MINIO_SECRET_KEY")
	ArgoWorkflowMinioBucket = config.GetStringOrDie("ARGO_WORKFLOW_MINIO_BUCKET")
	ArgoWorkflowNodePoolLabelValue = os.Getenv("ARGO_WORKFLOW_NODE_POOL_LABEL_VALUE")
	ArgoWorkflowImagePullPolicy = config.GetString("ARGO_WORKFLOW_IMAGE_PULL_POLICY", "IfNotPresent")
	ArgoWorkflowMainImage = config.GetStringOrDie("ARGO_WORKFLOW_MAIN_IMAGE")
	ArgoWorkflowCliImage = config.GetStringOrDie("ARGO_WORKFLOW_CLI_IMAGE")
	ArgoWorkflowVolumeSize = config.GetString("ARGO_WORKFLOW_VOLUME_SIZE", "")
	ArgoWorkflowMemoryLimit = config.GetString("ARGO_WORKFLOW_MEMORY_LIMIT", "")
	ArgoWorkflowCPULimit = config.GetString("ARGO_WORKFLOW_CPU_LIMIT", "")
	ArgoWorkflowMemoryRequest = config.GetString("ARGO_WORKFLOW_MEMORY_REQUEST", "")
	ArgoWorkflowCPURequest = config.GetString("ARGO_WORKFLOW_CPU_REQUEST", "")
}
