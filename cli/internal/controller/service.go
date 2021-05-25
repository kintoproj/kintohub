package controller

import (
	"fmt"
	"os"

	"github.com/kintoproj/kintohub/cli/internal/api"
	"github.com/kintoproj/kintohub/cli/internal/utils"
	"github.com/olekukonko/tablewriter"
)

func createTable() *tablewriter.Table {
	table := tablewriter.NewWriter(os.Stdout)
	table.SetRowLine(true)
	table.SetHeader([]string{
		"Name",
		"Service ID",
	})
	table.SetHeaderColor(tablewriter.Colors{tablewriter.Bold, tablewriter.FgWhiteColor},
		tablewriter.Colors{tablewriter.Bold, tablewriter.FgWhiteColor})

	return table
}

//get list of all services inside an environment
func (c *Controller) Services(envId ...string) {

	utils.StartSpinner()
	table := createTable()

	var envDetails []api.EnvDetails

	if len(envId) != 0 {
		blocks, err := c.api.GetBlocks(envId[0])

		if err != nil {
			utils.TerminateWithError(err)
			return
		}

		if len(blocks) != 0 {
			for _, block := range blocks {
				table.Append([]string{
					block.DisplayName,
					block.Id,
				})
			}
			utils.StopSpinner()
			table.Render()
		} else {
			utils.WarningMessage("No services/s found!")
		}

	} else {

		serialNumber := 1
		envs, err := c.api.GetEnvironments()
		if err != nil {
			utils.TerminateWithError(err)
			return
		}

		for _, env := range envs {
			envDetail := api.EnvDetails{EnvName: fmt.Sprintf("%d. %s", serialNumber, env.Name), EnvId: env.Id}
			envDetails = append(envDetails, envDetail)
			serialNumber++
		}

		if len(envDetails) != 0 {
			utils.StopSpinner()
			selectedEnvId := SelectionPrompt(envDetails)
			c.showSelectedEnvServices(selectedEnvId)

		} else {
			utils.WarningMessage("No Env/s found!")
		}
	}
}

//Generates and fills the table with the data from above function.
func (c *Controller) showSelectedEnvServices(envId string) {

	utils.StartSpinner()
	blocks, err := c.api.GetBlocks(envId)
	table := createTable()
	if err != nil {
		utils.TerminateWithError(err)
		return
	}

	if len(blocks) != 0 {
		for _, block := range blocks {
			table.Append([]string{
				block.DisplayName,
				block.Id,
			})
		}
		utils.StopSpinner()
		table.Render()
	} else {
		utils.WarningMessage("No services/s found!")
	}

}
