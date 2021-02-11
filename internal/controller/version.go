package controller

import (
	"fmt"
	"github.com/kintoproj/kinto-cli/internal/config"
	"github.com/kintoproj/kinto-cli/internal/utils"
)

func (c Controller) Version() {
	utils.NoteMessage(fmt.Sprintf("Kinto Command Line Interface (CLI) %s", config.Version))
}
