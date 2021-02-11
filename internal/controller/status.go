package controller

import (
	"github.com/kintoproj/kinto-cli/internal/utils"
	"github.com/olekukonko/tablewriter"
	"os"
)

//Get the list of all environments on which the current local repo is deployed on.
func (c *Controller) Status() {
	utils.StartSpinner()
	utils.CheckLocalGitOrDie()

	var count = 0
	envs, err := c.api.GetEnvironments()

	if err != nil {
		utils.TerminateWithError(err)
		return
	}

	table := tablewriter.NewWriter(os.Stdout)
	table.SetRowLine(true)
	table.SetHeader([]string{
		"Env Name",
		"Service Name",
	})
	table.SetHeaderColor(tablewriter.Colors{tablewriter.Bold, tablewriter.FgWhiteColor},
		tablewriter.Colors{tablewriter.Bold, tablewriter.FgWhiteColor})

	for _, env := range envs {
		blocks, err := c.api.GetBlocks(env.Id)
		if err != nil {
			utils.TerminateWithError(err)
			return
		}
		for _, block := range blocks {
			latestRelease := utils.GetLatestSuccessfulRelease(block.Releases)

			if latestRelease != nil {
				if utils.CompareGitUrl(latestRelease.BuildConfig.Repository.Url) {
					count++ //to avoid rendering the table multiple times
					table.Append([]string{
						env.Name,
						block.Name,
					})
				}
			}
		}
	}

	if count > 0 {
		utils.SuccessMessage("Repo is deployed to these environments:")
		table.Render()
	} else {
		utils.WarningMessage("Current Repo is not deployed on KintoHub!")
	}

}
