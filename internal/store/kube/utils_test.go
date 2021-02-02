package kube

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func Test_genAliasEmail(t *testing.T) {
	testCases := []struct {
		email, alias, want string
	}{
		{
			email: "devaccounts@kintohub.com",
			alias: "12345",
			want:  "devaccounts+12345@kintohub.com",
		},
		{
			email: "ben@mongodb.com",
			alias: "9999",
			want:  "ben+9999@mongodb.com",
		},
		{
			email: "ben@cheese.fr",
			alias: "<3",
			want:  "ben+<3@cheese.fr",
		},
	}

	for _, tc := range testCases {
		assert.Equal(t, tc.want, genAliasEmail(tc.email, tc.alias))
	}
}
