package server

import (
	"fmt"
	"log"
	"net"

	"github.com/kintoproj/kintohub/builder/internal/build"
	"github.com/kintoproj/kintohub/builder/internal/config"
	"github.com/kintoproj/kintohub/core/pkg/types"
	"google.golang.org/grpc"
	"k8s.io/klog"
)

func Run(buildClient build.BuildClientInterface) {
	service := NewKintoBuildService(buildClient)
	server := grpc.NewServer()
	types.RegisterWorkflowAPIServiceServer(server, service)

	lis, err := net.Listen("tcp", fmt.Sprintf(":"+config.ServerPort))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	klog.Infof("listening to :%s for grpc connection requests", config.ServerPort)

	_ = server.Serve(lis)
}
