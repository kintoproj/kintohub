package main

import (
	"github.com/kintoproj/kinto-cli/internal/api"
	"github.com/kintoproj/kinto-cli/internal/cli"
	"github.com/kintoproj/kinto-cli/internal/controller"
)

func main() {
	cli := cli.NewCliOrDie()
	api := api.NewApiOrDie(cli.GetHostFlag())
	controller := controller.NewControllerOrDie(api)
	cli.Execute(controller)
}
