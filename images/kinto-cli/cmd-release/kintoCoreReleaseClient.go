package cmd_release

import (
	"context"
	"crypto/x509"
	"fmt"
	"github.com/kintoproj/kinto-core/pkg/types"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
)

type kintoCoreReleaseClient struct {
	client types.KintoCoreServiceClient
}

type kintoCoreReleaseClientInterface interface {
	updateBuildStatus(buildStatusRequest *types.UpdateBuildStatusRequest) (string, error)
	updateBuildCommitSha(req *types.UpdateBuildCommitShaRequest) error
}

func newKintoCoreReleaseClient(kintoCoreHost string, isOverTLS bool) (kintoCoreReleaseClientInterface, error) {
	dialOption := grpc.WithInsecure()

	if isOverTLS {
		// https://grpc.io/docs/guides/auth/#authenticate-with-google
		pool, _ := x509.SystemCertPool()
		creds := credentials.NewClientTLSFromCert(pool, "")
		dialOption = grpc.WithTransportCredentials(creds)
	}

	fmt.Printf("DEBUG Calling kinto core %s\n", kintoCoreHost)

	conn, err := grpc.Dial(kintoCoreHost, dialOption)

	if err != nil {
		return nil, err
	}

	buildClient := types.NewKintoCoreServiceClient(conn)
	return &kintoCoreReleaseClient{
		client: buildClient,
	}, nil
}

func (r *kintoCoreReleaseClient) updateBuildStatus(buildStatusRequest *types.UpdateBuildStatusRequest) (string, error) {
	resp, err := r.client.UpdateBuildStatus(context.Background(), buildStatusRequest)
	if err != nil {
		return "", err
	}
	return resp.Id, nil
}

func (r *kintoCoreReleaseClient) updateBuildCommitSha(req *types.UpdateBuildCommitShaRequest) error {
	_, err := r.client.UpdateBuildCommitSha(context.Background(), req)
	if err != nil {
		return err
	}
	return nil
}
