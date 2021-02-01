package main

import (
	"github.com/kintohub/kinto-build/internal/build/argo"
	"github.com/kintohub/kinto-build/internal/config"
	"github.com/kintohub/kinto-build/internal/server"
	"github.com/kintohub/utils-go/klog"
)

func main() {
	klog.InitLogger()

	config.LoadConfig()

	buildClient := argo.NewBuildClient(
		argo.NewArgoClientOrDie(config.ArgoKubeConfigPath),
		argo.NewKubeClientOrDie(config.ArgoKubeConfigPath),
		argo.NewMinioClientOrDie())

	server.Run(buildClient)
}
