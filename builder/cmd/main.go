package main

import (
	"github.com/kintohub/utils-go/klog"
	"github.com/kintoproj/kinto-build/internal/build/argo"
	"github.com/kintoproj/kinto-build/internal/config"
	"github.com/kintoproj/kinto-build/internal/server"
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
