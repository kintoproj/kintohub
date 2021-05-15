package types

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestGetImageAndTag(t *testing.T) {
	testCases := []struct {
		language        BuildConfig_Language
		languageVersion string
		imageWant       string
		tagWant         string
		isErrorExpected bool
	}{
		{
			language:        BuildConfig_NOT_SET,
			languageVersion: "",
			imageWant:       "",
			tagWant:         "",
			isErrorExpected: true,
		},
		{
			language:        BuildConfig_DOCKERFILE,
			languageVersion: "",
			imageWant:       "",
			tagWant:         "",
			isErrorExpected: true,
		},
		{
			language:        BuildConfig_GOLANG,
			languageVersion: "",
			imageWant:       "golang",
			tagWant:         "1.14-buster",
			isErrorExpected: true,
		},
		{
			language:        BuildConfig_NODEJS,
			languageVersion: "12",
			imageWant:       "node",
			tagWant:         "12-buster",
			isErrorExpected: false,
		},
	}

	for _, tc := range testCases {
		imageGot, tagGot, err := GetImageAndTag(tc.language, tc.languageVersion)

		if tc.isErrorExpected {
			assert.Error(t, err)
			continue
		}

		assert.NoError(t, err)
		assert.Equal(t, tc.imageWant, imageGot)
		assert.Equal(t, tc.tagWant, tagGot)
	}
}
