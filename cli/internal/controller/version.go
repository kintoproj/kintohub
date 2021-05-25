package controller

import (
	"fmt"

	"github.com/kintoproj/kintohub/cli/internal/config"
	"github.com/kintoproj/kintohub/cli/internal/utils"
)

func (c Controller) Version() {
	utils.NoteMessage(fmt.Sprintf("Kinto Command Line Interface (CLI) %s", config.Version))
}
