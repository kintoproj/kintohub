package controller

import (
	"fmt"
	"net/url"
	"strings"

	"github.com/kintohub/utils-go/klog"
)

func isValidRepoUrl(repoUrl string) bool {
	// 1. Make sure the url doesn't contain these keywords anywhere (case insensitive)
	invalidRepoKeywords := []string{"v2fly", "v2ray"}

	for _, invalidWord := range invalidRepoKeywords {
		if strings.Contains(strings.ToLower(repoUrl), invalidWord) {
			return false
		}
	}

	// 2. Make sure the repo name is not named with the following (case insensitive)
	repoName, err := getRepoName(repoUrl)
	if err != nil {
		klog.ErrorfWithErr(err, "Couldn't parse repo name, skipping repo name validation for url: %s", repoUrl)
		return true
	}

	invalidRepoNames := []string{"kinto"}
	for _, invalidRepoName := range invalidRepoNames {
		if repoName == invalidRepoName {
			return false
		}
	}
	return true
}

func getRepoName(repoUrl string) (string, error) {
	u, err := url.Parse(repoUrl)

	if err != nil {
		return "", err
	}

	segments := strings.Split(u.Path, "/") // count starts from 1
	if len(segments) < 3 {
		return "", fmt.Errorf("URL: %s doesn't contain a second segment", repoUrl)
	}
	return strings.ToLower(segments[2]), nil
}
