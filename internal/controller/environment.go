package controller

import (
	"github.com/kintoproj/kinto-cli/internal/utils"
	"github.com/olekukonko/tablewriter"
	"os"
)

//Get list of all available environments in an account
func (c *Controller) Environment() {

	utils.StartSpinner()

	envs, er := c.api.GetEnvironments()
	if er != nil {
		utils.TerminateWithError(er)
	}

	table := tablewriter.NewWriter(os.Stdout)
	table.SetRowLine(true)
	table.SetHeader([]string{
		"Env Id",
		"Name",
	})
	table.SetHeaderColor(tablewriter.Colors{tablewriter.Bold, tablewriter.FgWhiteColor},
		tablewriter.Colors{tablewriter.Bold, tablewriter.FgWhiteColor})

	for _, c := range envs {
		table.Append([]string{
			c.Id,
			c.Name,
		})
	}

	if len(envs) != 0 {
		utils.SuccessMessage("Available environments:")
		table.Render()
	} else {
		utils.WarningMessage("No environment/s found!")
	}

}
