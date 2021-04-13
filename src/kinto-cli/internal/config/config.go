package config

import (
	"fmt"
	"github.com/gookit/color"
	"github.com/spf13/viper"
	"os"
)

const (
	CliConfigName                = "kinto.yaml"
	KintoCoreHostKey             = "kintoCoreHost"
	KintoCoreSecretKey           = "kintoCoreSecret"
	DefaultTeleportInterfacePort = "R:0.0.0.0"
	CoreHostResetKey             = "reset"
	DefaultClientAccessPort      = 5360
	DefaultClientTeleportPort    = 8080
	RedisPort                    = 6379
	PostgresPort                 = 5432
	MongoPort                    = 27017
	MinioPort                    = 9000
	MysqlPort                    = 3306
)

var Version = "v0.0.1" //Needs to be a non-const for passing version at build time

func GetKintoCoreHost() string {
	return viper.GetString(KintoCoreHostKey)
}

func SetKintoCoreHost(kintoCoreHost string) {
	viper.Set(KintoCoreHostKey, kintoCoreHost)
}

func GetKintoCoreSecret() string {
	return viper.GetString(KintoCoreSecretKey)
}

func SetKintoCoreSecret(kintoCoreSecret string) {
	viper.Set(KintoCoreSecretKey, kintoCoreSecret)
}

func AddConfigPath(path string) {
	viper.AddConfigPath(path)
}

func SetConfigName(configName string) {
	viper.SetConfigName(configName)
}

func SetConfigType(configType string) {
	viper.SetConfigType(configType)
}

func AutomaticEnv() {
	viper.AutomaticEnv()
}

func CreateConfig(path string, configName string) {
	if err := viper.ReadInConfig(); err != nil {
		// Create new config file
		err := viper.WriteConfigAs(fmt.Sprintf("%s/%s",
			path,
			configName,
		))
		//To avoid cyclic dependency error while importing
		if err != nil {
			color.Red.Println("An error occurred: %v", err)
			os.Exit(1)
		}
	}
}

func Save() {
	err := viper.WriteConfig()
	if err != nil {
		color.Red.Println("An error occurred: %v", err)
		os.Exit(1)
	}
}
