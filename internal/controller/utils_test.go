package controller

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func Test_stripeReleaseId(t *testing.T) {
	testCases := []struct {
		releaseId, want string
	}{
		{
			releaseId: "12345678",
			want:      "1234567",
		},
		{
			releaseId: "1234",
			want:      "1234",
		},
	}

	for _, tc := range testCases {
		assert.Equal(t, tc.want, stripeReleaseId(tc.releaseId))
	}
}
