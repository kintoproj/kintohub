package controller

import (
	"github.com/kintohub/kinto-core/internal/store"
	"github.com/kintohub/kinto-core/pkg/types"
	utilsGoServer "github.com/kintohub/utils-go/server"
)

func upsertExternalURL(store store.StoreInterface, blockName, envId string, release *types.Release) *utilsGoServer.Error {
	return store.EnablePublicURL(envId, blockName, release.RunConfig.Protocol, release.RunConfig.Host)
}

func (c *Controller) EnableExternalURL(name, envId, releaseId string) *utilsGoServer.Error {
	block, uErr := c.store.GetBlock(name, envId)

	if uErr != nil {
		return uErr
	}

	uErr = upsertExternalURL(c.store, name, envId, block.Releases[releaseId])

	if uErr != nil {
		return uErr
	}

	block.IsPublicURL = true

	return c.store.UpsertBlock(block)
}

func (c *Controller) DisableExternalURL(name, envId string) *utilsGoServer.Error {
	block, uErr := c.store.GetBlock(name, envId)

	if uErr != nil {
		return uErr
	}

	uErr = c.store.DisablePublicURL(envId, name)

	if uErr != nil {
		return uErr
	}

	block.IsPublicURL = false

	return c.store.UpsertBlock(block)
}
