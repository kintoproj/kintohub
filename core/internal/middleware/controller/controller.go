package controller

import (
	"context"

	"github.com/kintoproj/kintohub/core/internal/build"
	"github.com/kintoproj/kintohub/core/internal/middleware"
	"github.com/kintoproj/kintohub/core/internal/store"

	"github.com/kintoproj/kintohub/core/pkg/types"
)

type ControllerMiddleware struct {
	middleware.Middleware
	store store.StoreInterface
	build build.BuildInterface
}

func NewControllerMiddleware(
	kubeStore store.StoreInterface, buildClient build.BuildInterface) middleware.Interface {

	return &ControllerMiddleware{
		store: kubeStore,
		build: buildClient,
	}
}

func (ControllerMiddleware) GetKintoConfiguration(ctx context.Context) (*types.KintoConfiguration, error) {
	return &types.KintoConfiguration{
		Languages:          types.LanguagesOptions,
		MemoryOptions:      types.MemoryOpts,
		CpuOptions:         types.CPUOpts,
		TimeoutOptions:     types.TimeoutOpts,
		JobTimeoutOptions:  types.JobTimeoutOpts,
		AutoScalingOptions: types.AutoScalingOpts,
	}, nil
}
