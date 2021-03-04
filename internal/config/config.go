package config

import (
	_ "github.com/joho/godotenv/autoload"
	utilsGoConfig "github.com/kintohub/utils-go/config"
)

var (
	KubeConfigPath  string
	GrpcPort        string
	GrpcWebPort     string
	CORSAllowedHost string

	KintoDomain  string
	BuildApiHost string

	ConsoleLogsHistorySeconds  int64
	ConsoleLogsMaxLinesOnStart int64

	MetricsUpdateTickSeconds int
	HealthUpdateTickSeconds  int

	SSLEnabled              bool
	CertManagerIssuerEmail  string
	CertManagerIssuerServer string

	KintoDevProxyEnabled bool
	ProxlessFQDN         string

	KintoCoreNamespace       string
	KintoBuilderDockerSecret string
)

func InitConfig() {
	KubeConfigPath = utilsGoConfig.GetString("KUBE_CONFIG_PATH", "")
	GrpcPort = utilsGoConfig.GetString("GRPC_PORT", "8080")
	GrpcWebPort = utilsGoConfig.GetString("GRPC_WEB_PORT", "8090")
	CORSAllowedHost = utilsGoConfig.GetString("CORS_ALLOWED_HOST", "*")

	ConsoleLogsHistorySeconds = int64(utilsGoConfig.GetInt("CONSOLE_LOGS_HISTORY_SECONDS", 24*60*60))
	ConsoleLogsMaxLinesOnStart = int64(utilsGoConfig.GetInt("CONSOLE_LOGS_MAX_LINES_ON_START", 1000))

	MetricsUpdateTickSeconds = utilsGoConfig.GetInt("METRICS_UPDATE_TICK_SECONDS", 5)
	HealthUpdateTickSeconds = utilsGoConfig.GetInt("HEALTH_UPDATE_TICK_SECONDS", 1)

	KintoDomain = utilsGoConfig.GetStringOrDie("KINTO_DOMAIN")
	BuildApiHost = utilsGoConfig.GetString("BUILD_API_HOST", "kinto-builder:8080")

	SSLEnabled = utilsGoConfig.GetBool("SSL_ENABLED", false)
	if SSLEnabled {
		CertManagerIssuerEmail = utilsGoConfig.GetStringOrDie("CERT_MANAGER_ISSUER_EMAIL")
		CertManagerIssuerServer = utilsGoConfig.GetString("CERT_MANAGER_ISSUER_SERVER", "https://acme-staging-v02.api.letsencrypt.org/directory")
	}

	KintoDevProxyEnabled = utilsGoConfig.GetBool("KINTO_DEV_PROXY_ENABLED", true)
	ProxlessFQDN = utilsGoConfig.GetString("PROXLESS_FQDN", "kinto-proxless.kintohub.svc.cluster.local")

	KintoCoreNamespace = utilsGoConfig.GetString("KINTO_CORE_NAMESPACE", "kintohub")
	KintoBuilderDockerSecret = utilsGoConfig.GetString("KINTO_BUILDER_DOCKER_SECRET", "kinto-builder-workflow-docker")
}
