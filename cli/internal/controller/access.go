package controller

import (
	"github.com/kintoproj/kintohub/cli/internal/api"
	"github.com/kintoproj/kintohub/cli/internal/config"
	"github.com/kintoproj/kintohub/cli/internal/utils"
)

//needs to be run from a local git repo.
//it is the parent function for `kinto access` command. Allows to port-forward all services in an env
//as long as the env has atleast one service belonging to the local git repo.
func (c *Controller) Access() {
	utils.StartSpinner()

	envDetails := c.GetAvailableEnvNames(true)

	utils.StopSpinner()
	selectedEnvId := SelectionPrompt(envDetails)
	utils.StartSpinner()

	blocksToForward := c.GetBlocksToForward(selectedEnvId)

	if len(blocksToForward) > 0 {
		utils.StopSpinner()
		c.api.StartAccess(blocksToForward, selectedEnvId)
	} else {
		utils.WarningMessage("No service/s found in this environment to teleport into!")
	}

}

//sub-function of the `access` command, called when using `kinto env access`.
//allows port-forwarding whole environments.
func (c *Controller) EnvironmentAccess(envId ...string) {

	utils.StartSpinner()
	var selectedEnvId string
	var blocksToForward []api.RemoteConfig

	if len(envId) == 0 {
		envDetails := c.GetAvailableEnvNames(false)
		utils.StopSpinner()
		selectedEnvId = SelectionPrompt(envDetails)
		utils.StartSpinner()
		blocksToForward = c.GetBlocksToForward(selectedEnvId)
	} else {
		env := c.GetEnvWithId(envId[0])
		blocksToForward = c.GetBlocksToForward(env.Id)
		selectedEnvId = env.Id
	}

	if len(blocksToForward) != 0 {
		utils.StopSpinner()
		c.api.StartAccess(blocksToForward, selectedEnvId)
	} else {
		utils.WarningMessage("No Accessible service/s found!")
	}

}

//sub-function of the `access` command called when using `kinto svs access`.
//allows port-forwarding a particular service.
func (c *Controller) ServiceAccess(envId string, blockId string) {
	utils.StartSpinner()
	var blocksToForward []api.RemoteConfig

	env := c.GetEnvWithId(envId)

	blocks, err := c.api.GetBlocks(env.Id)
	if err != nil {
		utils.TerminateWithError(err)
		return
	}
	for _, block := range blocks {
		if block.Id == blockId {

			latestRelease := utils.GetLatestSuccessfulRelease(block.Releases)

			if utils.CanPortForwardToRelease(latestRelease) &&
				utils.CheckIfPortOpened(config.DefaultClientAccessPort, true) {
				remote := api.RemoteConfig{
					FromHost: "localhost",
					FromPort: config.DefaultClientAccessPort,
					ToHost:   block.Name,
					ToPort:   utils.GetBlockPort(block.Name),
				}
				blocksToForward = append(blocksToForward, remote)
			}
			break
		}
	}

	if len(blocksToForward) != 0 {
		utils.StopSpinner()
		c.api.StartAccess(blocksToForward, env.Id)

	} else {
		utils.WarningMessage("No Accessible service/s found!")
	}

}
