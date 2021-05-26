package utils

import (
	"fmt"
	"regexp"
)

const (
	WorkflowUpdateReleaseStatusTemplateName = "update-release-status"
	WorkflowMainWorkflowTemplateName        = "main-workflow-template"
)

func GenSourceURLWithToken(repoUrl, token string) string {
	repoWithToken := []byte(repoUrl)
	if token != "" {
		re := regexp.MustCompile(`(github\.com|gitlab\.com|bitbucket\.org)`)
		repoWithToken = re.ReplaceAll(repoWithToken, []byte(fmt.Sprintf("%s@$1", token)))
	}
	return string(repoWithToken)
}
