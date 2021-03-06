package controller

import (
	"fmt"
	"strings"

	"github.com/kintoproj/kintohub/cli/internal/config"
	"github.com/kintoproj/kintohub/cli/internal/utils"
)

//Set kintoCoreHost for CLI or reset it to default production host.
func (c *Controller) Init(kintoCoreHost, kintoCoreSecret string) {
	if strings.EqualFold(config.CoreHostResetKey, kintoCoreHost) {
		config.SetKintoCoreHost("")
		config.SetKintoCoreSecret("")
		config.Save()
		utils.SuccessMessage("CoreHost and CoreSecret unset")
	} else {
		config.SetKintoCoreHost(kintoCoreHost)
		config.SetKintoCoreSecret(kintoCoreSecret)
		config.Save()
		successMessage := fmt.Sprintf("New CoreHost set as => %s", kintoCoreHost)
		if kintoCoreSecret != "" {
			successMessage = fmt.Sprintf("%s and new CoreSecret set.", successMessage)
		}
		utils.SuccessMessage(successMessage)
	}
}
