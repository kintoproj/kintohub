package main

import (
	"github.com/kintohub/kinto-cli/cmd"
)

func main() {
	err := cmd.Execute()

	if err != nil {
		panic(err)
	}
}
