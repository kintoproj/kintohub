package main

import (
	"fmt"
	"kinto.io/kinto-kube-deploy/internal/config"
	"kinto.io/kinto-kube-deploy/internal/kinto"
	"kinto.io/kinto-kube-deploy/internal/store/kube"
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
