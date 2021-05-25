package controller

import (
	"github.com/AlecAivazis/survey/v2"
	"github.com/kintoproj/kintohub/cli/internal/api"
	"github.com/kintoproj/kintohub/cli/internal/utils"
)

// Contains different types of prompts for the UX.

// Selection prompt, to be used in screens requiring selection of single entry from multiple options.
func SelectionPrompt(envDetails []api.EnvDetails) string {
	var envNames []string
	var selectedEnv int

	for _, i := range envDetails {
		envNames = append(envNames, i.EnvName)
	}

	prompt := &survey.Select{
		Message: "Select environment:",
		Options: envNames,
	}
	err := survey.AskOne(prompt, &selectedEnv)

	if err != nil {
		utils.TerminateWithCustomError("Aborted!")
		return ""
	}

	return envDetails[selectedEnv].EnvId
}
