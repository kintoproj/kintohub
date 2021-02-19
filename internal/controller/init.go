package controller

import (
	"fmt"
	"github.com/kintoproj/kinto-cli/internal/config"
	"github.com/kintoproj/kinto-cli/internal/utils"
	"strings"
)

//Set kintoCoreHost for CLI or reset it to default production host.
func (c *Controller) Init(kintoCoreHost string) {

	if strings.EqualFold(config.CoreHostResetKey, kintoCoreHost) {
		config.SetKintoCoreHost(config.DefaultkintoCoreHost)
		config.Save()
		utils.SuccessMessage("CoreHost unset")
	} else {
		config.SetKintoCoreHost(kintoCoreHost)
		config.Save()
		utils.SuccessMessage(fmt.Sprintf("New CoreHost set as => %s", kintoCoreHost))
	}
}
