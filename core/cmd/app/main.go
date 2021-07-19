package main

import (
	"github.com/kintoproj/go-utils/klog"
	utilsGrpc "github.com/kintoproj/go-utils/server/grpc"
	"github.com/kintoproj/kintohub/core/internal/build/api"
	"github.com/kintoproj/kintohub/core/internal/config"
	"github.com/kintoproj/kintohub/core/internal/middleware"
	"github.com/kintoproj/kintohub/core/internal/middleware/auth"
	"github.com/kintoproj/kintohub/core/internal/middleware/controller"
	"github.com/kintoproj/kintohub/core/internal/server"
	"github.com/kintoproj/kintohub/core/internal/store/kube"
	pkgTypes "github.com/kintoproj/kintohub/core/pkg/types"
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
