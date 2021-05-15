package utils

import (
	"github.com/briandowns/spinner"
	"github.com/gookit/color"
	"time"
)

//contains loading spinners and utility messages

var s *spinner.Spinner

func init() {
	style := spinner.CharSets[14]
	interval := 100 * time.Millisecond
	s = spinner.New(style, interval)
	s.HideCursor = true
}

func StartSpinner(message ...string) {
	if len(message) > 0 {
		s.Prefix = message[0]
	} else {
		s.Prefix = "Retrieving data... "
	}
	s.Start()
}

func StopSpinner() {
	s.Stop()
}

func NoteMessage(message string) {
	StopSpinner() //To stop any active spinners, if any.
	color.Bold.Println(message)
}

func InfoMessage(message string) {
	StopSpinner()
	color.Gray.Println("INFO:    ", message)
}

func SuccessMessage(message string) {
	StopSpinner()
	color.Green.Println("SUCCESS: ", message)
}

func WarningMessage(message string) {
	StopSpinner()
	color.Yellow.Println("WARNING: ", message)
}
