package controller

import (
	"github.com/kintoproj/kinto-cli/internal/config"
)

//Set kintoCoreHost for CLI or reset it to default production host.
func (c *Controller) Init(kintoCoreHost string) {

	if kintoCoreHost == "Default" || kintoCoreHost == "default" {
		config.SetKintoCoreHost(config.DefaultkintoCoreHost)
		config.Save()
	} else {
		config.SetKintoCoreHost(kintoCoreHost)
		config.Save()
	}
}
