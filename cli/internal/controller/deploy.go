package controller

import (
	"fmt"

	"github.com/kintoproj/kintohub/cli/internal/utils"
)

//Triggers a deploy action for a given service
func (c *Controller) Deploy(envId string, blockName string) {

	utils.StartSpinner()

	resp, err := c.api.TriggerDeploy(envId, blockName)
	if err != nil {
		utils.TerminateWithError(err)
		return
	}

	utils.SuccessMessage("A new release is being deployed\n")
	utils.InfoMessage(fmt.Sprintf("\nService Name : %s \nRelease Id   : %s", resp.Name, resp.ReleaseId))

}
