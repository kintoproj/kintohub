package api

import (
	"crypto/x509"
	"github.com/kintoproj/kinto-cli/internal/utils"
	"github.com/kintoproj/kinto-core/pkg/types"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/keepalive"
	"time"
)

type ApiInterface interface {
	GetEnvironments() ([]*types.Environment, error)
	GetBlocks(envId string) ([]*types.Block, error)
	TriggerDeploy(envId string, blockName string) (*types.BlockUpdateResponse, error)
	StartAccess(blocksToForward []RemoteConfig, envId string)
	StartTeleport(blocksToForward []RemoteConfig, envId string, blockName string)
}

type Api struct {
	client     types.KintoCoreServiceClient
	kintoCoreHost string
}

func NewApiOrDie(kintoCoreHost string) ApiInterface {
	return &Api{
		kintoCoreHost: kintoCoreHost,
		client:     newKintoCoreServiceClient(kintoCoreHost),
	}
}

func newKintoCoreServiceClient(kintoCoreHost string) types.KintoCoreServiceClient {
	dialOption := grpc.WithInsecure()

	// https://grpc.io/docs/guides/auth/#authenticate-with-google
	pool, _ := x509.SystemCertPool()
	creds := credentials.NewClientTLSFromCert(pool, "")
	dialOption = grpc.WithTransportCredentials(creds)

	conn, err := grpc.Dial(kintoCoreHost,
		dialOption,
		grpc.WithKeepaliveParams(keepalive.ClientParameters{
			Time:                10 * time.Second, // Send pings every 10 seconds if there is no activity
			Timeout:             time.Second * 5,  // Wait 1 second for ping ack before considering the connection dead
			PermitWithoutStream: true,             // Send pings even without active streams
		}))

	if err != nil {
		utils.TerminateWithError(err)
		return nil
	}
	return types.NewKintoCoreServiceClient(conn)
}
