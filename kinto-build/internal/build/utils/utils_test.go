package utils

import (
	"fmt"
	"testing"
)

func Test_genSourceURLWithToken(t *testing.T) {
	testCases := []struct {
		repoUrl, token, want string
	}{
		{"github.com/kintoproj/kinto-core", "", "github.com/kintoproj/kinto-core"},
		{"github.com/kintoproj/kinto-core.git", "t0k3n", "t0k3n@github.com/kintoproj/kinto-core.git"},
		{"https://github.com/kintoproj/kinto-core", "t0k3n", "https://t0k3n@github.com/kintoproj/kinto-core"},
		{"https://github.com/kintoproj/kinto-core.git", "t0k3n", "https://t0k3n@github.com/kintoproj/kinto-core.git"},
		{"https://gitlab.com/kintoproj/kinto-core.git", "t0k3n", "https://t0k3n@gitlab.com/kintoproj/kinto-core.git"},
		{"https://bitbucket.org/kintoproj/kinto-core.git", "t0k3n", "https://t0k3n@bitbucket.org/kintoproj/kinto-core.git"},
	}

	for _, tc := range testCases {
		got := GenSourceURLWithToken(tc.repoUrl, tc.token)
		if tc.want != got {
			t.Errorf(fmt.Sprintf("GenSourceURLWithToken(%s, %s) = %s; want %s", tc.repoUrl, tc.token, got, tc.want))
		}
	}
}
