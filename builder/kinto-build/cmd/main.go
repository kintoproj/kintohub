package main

import (
	"github.com/kintoproj/go-utils/klog"
	"github.com/kintoproj/kintohub/builder/internal/build/argo"
	"github.com/kintoproj/kintohub/builder/internal/config"
	"github.com/kintoproj/kintohub/builder/internal/server"
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
