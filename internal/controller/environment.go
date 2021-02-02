package controller

import (
	"github.com/kintohub/utils-go/klog"
	utilsGoServer "github.com/kintohub/utils-go/server"
	"github.com/kintoproj/kinto-core/internal/store"

	"github.com/kintoproj/kinto-core/pkg/types"
)

func (c *Controller) GetEnvironment(id string) (*types.Environment, *utilsGoServer.Error) {
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

func (c *Controller) GetEnvironments() (*types.Environments, *utilsGoServer.Error) {
	return c.store.GetEnvironments()
}

func (c *Controller) CreateEnvironment(name string) (*types.Environment, *utilsGoServer.Error) {
	newId := types.GenerateID()
	return newEnvironment(c.store, newId, name)
}

func (c *Controller) UpdateEnvironment(id, name string) (*types.Environment, *utilsGoServer.Error) {
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

func (c *Controller) DeleteEnvironment(id string) *utilsGoServer.Error {
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
