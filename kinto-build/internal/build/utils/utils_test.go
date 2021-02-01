package utils

import (
	"fmt"
	"testing"
)

func Test_genSourceURLWithToken(t *testing.T) {
	testCases := []struct {
		repoUrl, token, want string
	}{
		{"github.com/kintohub/kinto-kube-core", "", "github.com/kintohub/kinto-kube-core"},
		{"github.com/kintohub/kinto-kube-core.git", "t0k3n", "t0k3n@github.com/kintohub/kinto-kube-core.git"},
		{"https://github.com/kintohub/kinto-kube-core", "t0k3n", "https://t0k3n@github.com/kintohub/kinto-kube-core"},
		{"https://github.com/kintohub/kinto-kube-core.git", "t0k3n", "https://t0k3n@github.com/kintohub/kinto-kube-core.git"},
		{"https://gitlab.com/kintohub/kinto-kube-core.git", "t0k3n", "https://t0k3n@gitlab.com/kintohub/kinto-kube-core.git"},
		{"https://bitbucket.org/kintohub/kinto-kube-core.git", "t0k3n", "https://t0k3n@bitbucket.org/kintohub/kinto-kube-core.git"},
	}

	for _, tc := range testCases {
		got := GenSourceURLWithToken(tc.repoUrl, tc.token)
		if tc.want != got {
			t.Errorf(fmt.Sprintf("GenSourceURLWithToken(%s, %s) = %s; want %s", tc.repoUrl, tc.token, got, tc.want))
		}
	}
}
