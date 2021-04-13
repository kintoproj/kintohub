package main

import (
	"fmt"
	"kintoproj/kinto-deploy/internal/config"
	"kintoproj/kinto-deploy/internal/kinto"
	"kintoproj/kinto-deploy/internal/store/kube"
)

func main() {
	fmt.Println("Deploying service...")

	config.InitLogger()
	config.LoadConfig()

	store := kube.NewStoreClient(
		kube.NewKubeClientOrDie(config.KubeConfigPath),
		kube.NewHelmConfigurationOrDie(config.KubeConfigPath, config.Namespace))

	controller := kinto.NewKintoController(store)
	controller.Run()
}
