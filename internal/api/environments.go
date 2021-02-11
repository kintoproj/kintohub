package api

import (
	"context"
	"github.com/golang/protobuf/ptypes/empty"
	"github.com/kintoproj/kinto-core/pkg/types"
)

func (a *Api) GetEnvironments() ([]*types.Environment, error) {
	envs, err := a.client.GetEnvironments(context.Background(), &empty.Empty{})
	if err != nil {
		return nil, err
	}
	return envs.Items, err
}