package main

import (
	"github.com/kintohub/utils-go/klog"
	utilsGrpc "github.com/kintohub/utils-go/server/grpc"
	"github.com/kintoproj/kinto-core/internal/build/api"
	"github.com/kintoproj/kinto-core/internal/config"
	"github.com/kintoproj/kinto-core/internal/middleware"
	"github.com/kintoproj/kinto-core/internal/middleware/auth"
	"github.com/kintoproj/kinto-core/internal/middleware/controller"
	"github.com/kintoproj/kinto-core/internal/server"
	"github.com/kintoproj/kinto-core/internal/store/kube"
	pkgTypes "github.com/kintoproj/kinto-core/pkg/types"
)

func main() {

	klog.InitLogger()
	config.InitConfig()

	store := kube.NewKubeStore(config.KubeConfigPath)

	buildClient :=
		api.NewBuildAPI(pkgTypes.NewWorkflowAPIServiceClient(
			utilsGrpc.CreateConnectionOrDie(config.BuildApiHost, false)))

	middlewares := []middleware.Interface{
		auth.NewAuthMiddleware(config.KintoCoreSecret),
		controller.NewControllerMiddleware(store, buildClient),
	}

	coreService := server.NewKintoCoreService(middleware.NewControllerMiddlewareOrDie(middlewares...))

	utilsGrpc.RunServer(config.GrpcPort, config.GrpcWebPort, config.CORSAllowedHost, coreService.RegisterToServer)
}
