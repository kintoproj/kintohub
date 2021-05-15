package controller

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func Test_removeDomainFromArray(t *testing.T) {
	testCases := []struct {
		domain      string
		domainNames []string
		want        []string
	}{
		{
			domain:      "example.io",
			domainNames: []string{"example.io", "example2.io"},
			want:        []string{"example2.io"},
		},
		{
			domain:      "example.io",
			domainNames: []string{"example2.io"},
			want:        []string{"example2.io"},
		},
		{
			domain:      "example.io",
			domainNames: []string{"example.io"},
			want:        []string{},
		},
		{
			domain:      "example.io",
			domainNames: []string{},
			want:        []string{},
		},
		{
			domain:      "example.io",
			domainNames: nil,
			want:        []string{},
		},
	}

	for _, tc := range testCases {
		got := removeDomainFromArray(tc.domain, tc.domainNames)
		assert.Equal(t, tc.want, got)
	}
}
