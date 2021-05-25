package main

import (
	"github.com/kintoproj/kintohub/cli/internal/api"
	"github.com/kintoproj/kintohub/cli/internal/cli"
	"github.com/kintoproj/kintohub/cli/internal/controller"
)

func main() {
	cli := cli.NewCliOrDie()
	api := api.NewApiOrDie(cli.GetHostFlag(), cli.GetSecretFlag())
	controller := controller.NewControllerOrDie(api)
	cli.Execute(controller)
}
