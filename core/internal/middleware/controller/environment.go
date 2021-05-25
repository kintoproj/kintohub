package controller

import (
	"context"

	"github.com/kintoproj/go-utils/klog"
	utilsGoServer "github.com/kintoproj/go-utils/server"
	"github.com/kintoproj/kintohub/core/internal/store"

	"github.com/kintoproj/kintohub/core/pkg/types"
)

func (c *ControllerMiddleware) GetEnvironment(ctx context.Context, id string) (*types.Environment, *utilsGoServer.Error) {
	env, err := c.store.GetEnvironment(id)

	if err != nil {
		if err.StatusCode != utilsGoServer.StatusCode_NotFound {
			return nil, err
		}

		klog.Debugf("creating new environment %s since it doesn't exist yet", id)
		env, err = newEnvironment(c.store, id, id)
	}

	return env, err
}

func (c *ControllerMiddleware) GetEnvironments(ctx context.Context) (*types.Environments, *utilsGoServer.Error) {
	return c.store.GetEnvironments()
}

func (c *ControllerMiddleware) CreateEnvironment(ctx context.Context, name string) (*types.Environment, *utilsGoServer.Error) {
	newId := types.GenerateID()
	return newEnvironment(c.store, newId, name)
}

func (c *ControllerMiddleware) UpdateEnvironment(ctx context.Context, id, name string) (*types.Environment, *utilsGoServer.Error) {
	env := &types.Environment{
		Id:   id,
		Name: name,
	}
	err := c.store.UpdateEnvironment(env)
	if err != nil {
		return nil, err
	}
	return env, nil
}

func (c *ControllerMiddleware) DeleteEnvironment(ctx context.Context, id string) *utilsGoServer.Error {
	return c.store.DeleteEnvironment(id)
}

func newEnvironment(store store.StoreInterface, id string, name string) (*types.Environment, *utilsGoServer.Error) {

	env := &types.Environment{
		Id:   id,
		Name: name,
	}

	err := store.CreateEnvironment(env)

	if err != nil {
		return nil, err
	}

	return env, nil
}
