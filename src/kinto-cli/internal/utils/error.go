package utils

import (
	"github.com/gookit/color"
	"os"
)

func TerminateWithError(err error) {
	StopSpinner() //To stop any active spinners, if any.
	color.BgRed.Printf("ERROR:")
	color.Red.Println(" ", err)
	os.Exit(1)
}

func TerminateWithCustomError(message string) {
	StopSpinner()
	color.BgRed.Printf("ERROR:")
	color.Red.Println(" ",message)
	os.Exit(1)
}
