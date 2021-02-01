package config

import (
	_ "github.com/joho/godotenv/autoload"
	"github.com/kintohub/kinto-kube-core/pkg/types"
	"github.com/kintohub/utils-go/config"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"os"
	"strings"
)

var (
	KubeConfigPath string

	ImageRegistryHost string

	Namespace   string
	ReleaseId   string
	ReleaseType types.Release_Type

	BlockName string

	ProxlessFQDN string
)

func LoadConfig() {
	KubeConfigPath = os.Getenv("KUBE_CONFIG_PATH")

	ImageRegistryHost = config.GetStringOrDie("IMAGE_REGISTRY_HOST")

	Namespace = config.GetStringOrDie("NAMESPACE")
	ReleaseId = os.Getenv("RELEASE_ID")
	ReleaseType = types.Release_Type(types.Release_Type_value[config.GetStringOrDie("RELEASE_TYPE")])

	BlockName = config.GetStringOrDie("BLOCK_NAME")

	ProxlessFQDN = config.GetStringOrDie("PROXLESS_FQDN")
}

func InitLogger() zerolog.Level {
	// pretty logs and no timestamp
	log.Logger = log.Output(zerolog.ConsoleWriter{
		Out: os.Stderr,
		FormatTimestamp: func(_ interface{}) string {
			return ""
		},
	})

	switch strings.ToUpper(os.Getenv("LOG_LEVEL")) {
	case "DEBUG":
		zerolog.SetGlobalLevel(zerolog.DebugLevel)
	case "INFO":
		zerolog.SetGlobalLevel(zerolog.InfoLevel)
	case "WARN":
		zerolog.SetGlobalLevel(zerolog.WarnLevel)
	case "ERROR":
		zerolog.SetGlobalLevel(zerolog.ErrorLevel)
	case "FATAL":
		zerolog.SetGlobalLevel(zerolog.FatalLevel)
	case "PANIC":
		zerolog.SetGlobalLevel(zerolog.PanicLevel)
	default:
		zerolog.SetGlobalLevel(zerolog.InfoLevel)
	}
	return zerolog.GlobalLevel()
}
