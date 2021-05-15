package server

import (
	"fmt"
	"github.com/kintoproj/kinto-build/internal/build"
	"github.com/kintoproj/kinto-build/internal/config"
	"github.com/kintoproj/kinto-core/pkg/types"
	"google.golang.org/grpc"
	"k8s.io/klog"
	"log"
	"net"
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
