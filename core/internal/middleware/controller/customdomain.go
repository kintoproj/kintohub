package controller

import (
	"context"
	"fmt"

	utilsGoServer "github.com/kintoproj/go-utils/server"
	"github.com/kintoproj/kintohub/core/pkg/types"
	"github.com/rs/zerolog/log"
)

func (c *ControllerMiddleware) CreateCustomDomainName(
	ctx context.Context, blockName, envId, domainName string, protocol types.RunConfig_Protocol) *utilsGoServer.Error {

	domainNameAlreadyExists, err := c.store.DoesCustomDomainExistInStore(domainName)

	if err != nil {
		return err
	}

	if domainNameAlreadyExists {
		return utilsGoServer.NewError(
			utilsGoServer.StatusCode_BadRequest,
			fmt.Sprintf("custom domain %s already exists on kintohub", domainName),
		)
	}

	block, err := c.store.GetBlock(blockName, envId)

	if err != nil {
		return err
	}

	lastSuccessfulRelease := types.GetLatestSuccessfulRelease(block.Releases)

	if lastSuccessfulRelease == nil {
		return utilsGoServer.NewError(
			utilsGoServer.StatusCode_BadRequest,
			fmt.Sprintf("block %s.%s must have a successful deployment before creating a domain name", blockName, envId),
		)
	}

	if !block.IsPublicURL {
		return utilsGoServer.NewError(
			utilsGoServer.StatusCode_BadRequest,
			fmt.Sprintf("public URL must be enable for block %s.%s", blockName, envId),
		)
	}

	if block.CustomDomains == nil {
		block.CustomDomains = []string{}
	}

	if isDomainNameAlreadyCreated(domainName, block.CustomDomains) {
		return utilsGoServer.NewInternalErrorWithErr(
			fmt.Sprintf("custom domain %s already in block %s.%s", domainName, blockName, envId),
			nil,
		)
	}

	block.CustomDomains = append(block.CustomDomains, domainName)

	err =
		c.store.UpsertCustomDomainNames(
			envId, blockName, protocol, lastSuccessfulRelease.RunConfig.Host, block.CustomDomains...)

	if err != nil {
		return err
	}

	return c.store.UpsertBlock(block)
}

func isDomainNameAlreadyCreated(domainName string, domainNames []string) bool {
	for _, domain := range domainNames {
		if domain == domainName {
			return true
		}
	}
	return false
}

func (c *ControllerMiddleware) DeleteCustomDomainName(
	ctx context.Context, blockName, envId, domainName string, protocol types.RunConfig_Protocol) *utilsGoServer.Error {

	block, err := c.store.GetBlock(blockName, envId)

	if err != nil {
		return err
	}

	block.CustomDomains = removeDomainFromArray(domainName, block.CustomDomains)

	// TODO we should move the  kinto `Host` in the block cuz it does not make sense to have it under `RunConfig`
	lastSuccessfulRelease := types.GetLatestSuccessfulRelease(block.Releases)
	// we don't test if it is `nil` cuz we can't create domain name if there is no successful release

	if len(block.CustomDomains) > 0 {
		err = c.store.UpsertCustomDomainNames(
			envId, blockName, protocol, lastSuccessfulRelease.RunConfig.Host, block.CustomDomains...)

		if err != nil {
			return err
		}
	} else {
		err = c.store.DeleteCustomDomainNames(envId, blockName, lastSuccessfulRelease.RunConfig.Host)

		if err != nil {
			return err
		}
	}

	return c.store.UpsertBlock(block)
}

func removeDomainFromArray(domainName string, domainNames []string) []string {
	if domainNames == nil || len(domainNames) == 0 {
		return []string{}
	}

	index := -1
	for i, domain := range domainNames {
		if domain == domainName {
			index = i
			break
		}
	}

	if index == -1 {
		return domainNames
	}

	// https://stackoverflow.com/a/39853929/5683655
	domainNames[index] = domainNames[len(domainNames)-1]
	return domainNames[:len(domainNames)-1]
}

func (c *ControllerMiddleware) CheckCertificateReadiness(ctx context.Context, blockName, envId string) bool {
	isCertReady, uErr := c.store.CheckCertificateReadiness(blockName, envId)

	if uErr != nil {
		log.Error().Err(uErr.Error).Msgf("Error checking certificate")
	}

	return isCertReady
}
