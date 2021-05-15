package cmd_release

import (
	"context"
	"crypto/x509"
	"fmt"
	"github.com/kintoproj/kinto-core/pkg/types"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/metadata"
)

type kintoCoreReleaseClient struct {
	client             types.KintoCoreServiceClient
	kintoCoreSecretKey string
}

type kintoCoreReleaseClientInterface interface {
	updateBuildStatus(buildStatusRequest *types.UpdateBuildStatusRequest) (string, error)
	updateBuildCommitSha(req *types.UpdateBuildCommitShaRequest) error
}

func newKintoCoreReleaseClient(kintoCoreHost string, isOverTLS bool, kintoCoreSecretKey string) (kintoCoreReleaseClientInterface, error) {
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
		client:             buildClient,
		kintoCoreSecretKey: kintoCoreSecretKey,
	}, nil
}

func (k *kintoCoreReleaseClient) updateBuildStatus(buildStatusRequest *types.UpdateBuildStatusRequest) (string, error) {
	ctx := k.setAuthorization(context.Background())
	resp, err := k.client.UpdateBuildStatus(ctx, buildStatusRequest)
	if err != nil {
		return "", err
	}
	return resp.Id, nil
}

func (k *kintoCoreReleaseClient) updateBuildCommitSha(req *types.UpdateBuildCommitShaRequest) error {
	ctx := k.setAuthorization(context.Background())
	_, err := k.client.UpdateBuildCommitSha(ctx, req)
	if err != nil {
		return err
	}
	return nil
}

func (k *kintoCoreReleaseClient) setAuthorization(ctx context.Context) context.Context {
	if k.kintoCoreSecretKey != "" {
		return metadata.AppendToOutgoingContext(ctx, "authorization", k.kintoCoreSecretKey)
	} else {
		return ctx
	}
}
