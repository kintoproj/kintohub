package utils

import (
	"fmt"

	"github.com/ttacon/chalk"
)

func RedSprintLn(message string, args ...interface{}) string {
	return fmt.Sprintln(chalk.Red.Color(fmt.Sprintf(message, args...)))
}
