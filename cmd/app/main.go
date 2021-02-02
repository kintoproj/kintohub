package main

import (
	"github.com/kintohub/kinto-core/internal/build"
	"github.com/kintohub/kinto-core/internal/build/api"
	"github.com/kintohub/kinto-core/internal/config"
	"github.com/kintohub/kinto-core/internal/controller"
	"github.com/kintohub/kinto-core/internal/server"
	"github.com/kintohub/kinto-core/internal/store"
	"github.com/kintohub/kinto-core/internal/store/kube"
	pkgTypes "github.com/kintohub/kinto-core/pkg/types"
	"github.com/kintohub/utils-go/klog"
	utilsGrpc "github.com/kintohub/utils-go/server/grpc"
)

// container method for all singletons in the project
type container struct {
	store       store.StoreInterface
	buildClient build.BuildInterface
	controller  controller.ControllerInterface

	kintoKubeCoreService *server.KintoKubeCoreService
}

func main() {

	klog.InitLogger()
	config.InitConfig()

	container := initContainer()

	utilsGrpc.RunServer(config.GrpcPort, config.GrpcWebPort, config.CORSAllowedHost,
		container.kintoKubeCoreService.RegisterToServer,
	)
}

// Do not change the order of initialization due to dependencies needing to be instantiated!
func initContainer() *container {
	container := &container{}

	container.store = kube.NewKubeStore(config.KubeConfigPath)

	container.buildClient =
		api.NewBuildAPI(pkgTypes.NewWorkflowAPIServiceClient(
			utilsGrpc.CreateConnectionOrDie(config.BuildApiHost, false)))

	container.controller = controller.NewController(container.store, container.buildClient)
	container.kintoKubeCoreService = server.NewKintoKubeCoreService(container.controller)

	return container
}
