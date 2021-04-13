package main

import (
	"github.com/kintoproj/kinto-cli/cmd"
)

func main() {
	err := cmd.Execute()

	if err != nil {
		panic(err)
	}
}
