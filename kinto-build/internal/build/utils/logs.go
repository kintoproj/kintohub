package utils

import (
	"fmt"
	"regexp"
	"strings"
)

var (
	notAllowedPhrases = []string{
		// generic logs
		"DEBUG",
		"DBG",

		// kaniko logs
		"while getting AWS credentials NoCredentialProviders: no valid providers in chain. Deprecated.",
		"For verbose messaging see aws.Config.CredentialsChainVerboseErrors",
		"while reading 'google-dockercfg' metadata",
		"while reading 'google-dockercfg-url' metadata",
		"gcr.io/kinto",
		"Taking snapshot of files",
		"Taking snapshot of full filesystem",
		"No files changed in this command, skipping snapshotting",
		"Deleting filesystem",
		"Found cached layer, extracting to filesystem",

		// kinto-deploy logs
		"Neither --kubeconfig nor --master was specified.  Using the inClusterConfig.  This might not work.",
	}

	emptyStringBytes     = []byte("")
	notAllowedLinesRegex *regexp.Regexp
)

func init() {
	regexExpText := ""

	for _, notAllowedPhase := range notAllowedPhrases {
		regexExpText += fmt.Sprintf(".*%s.*\n?\r?|", notAllowedPhase)
	}

	if regexExpText != "" {
		regexExpText = strings.TrimSuffix(regexExpText, "|")
	}

	notAllowedLinesRegex = regexp.MustCompile(regexExpText)
}

func MakeUserFriendlyLogs(data []byte) []byte {
	return notAllowedLinesRegex.ReplaceAll(data, emptyStringBytes)
}
