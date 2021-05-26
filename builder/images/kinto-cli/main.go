package main

import (
	"github.com/kintoproj/kintohub/cli/cmd"
)

func main() {
	err := cmd.Execute()

	if err != nil {
		panic(err)
	}
}
