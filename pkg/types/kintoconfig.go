package types

import (
	"errors"
	"fmt"
)

var (
	// TODO be able to build "the perfect" Dockerfile
	// using debian images and not alpine to avoid unnecessary issues
	// ---
	// cannot use a map here cuz protobuf does not allow a map of maps -.-
	LanguagesOptions = []*Language{
		{
			// https://hub.docker.com/_/golang
			Language: BuildConfig_GOLANG,
			Image:    "golang",
			VersionsTags: map[string]string{
				"1.14": "1.14-buster",
				"1.13": "1.13-buster",
				"1.12": "1.12-buster",
			},
		},
		{
			// https://hub.docker.com/_/node
			Language: BuildConfig_NODEJS,
			Image:    "node",
			VersionsTags: map[string]string{
				"14": "14-buster",
				"13": "13-buster",
				"12": "12-buster",
				"10": "10-buster",
			},
		},
		{
			// https://hub.docker.com/_/python
			Language: BuildConfig_PYTHON,
			Image:    "python",
			VersionsTags: map[string]string{
				"3.9": "3.9-rc-buster", // TODO this one is a release candidate
				"3.8": "3.8-buster",
				"3.7": "3.7-buster",
				"3.6": "3.6-buster",
			},
		},
		{
			// https://hub.docker.com/_/openjdk
			Language: BuildConfig_JAVA,
			Image:    "openjdk",
			VersionsTags: map[string]string{
				"15": "15-buster",
				"14": "14-buster",
				"11": "11-buster",
				"8":  "8-buster",
			},
		},
		{
			// https://hub.docker.com/_/ruby
			Language: BuildConfig_RUBY,
			Image:    "ruby",
			VersionsTags: map[string]string{
				"2.7": "2.7-buster",
				"2.6": "2.6-buster",
				"2.5": "2.5-buster",
			},
		},
		{
			// https://hub.docker.com/_/php
			Language: BuildConfig_PHP,
			Image:    "php",
			VersionsTags: map[string]string{
				"7.4": "7.4-cli-buster",
				"7.3": "7.3-cli-buster",
				"7.2": "7.2-cli-buster",
			},
		},
		{
			// https://hub.docker.com/_/rust
			Language: BuildConfig_RUST,
			Image:    "rust",
			VersionsTags: map[string]string{
				"1": "1-buster",
			},
		},
		{
			// https://hub.docker.com/_/elixir
			Language: BuildConfig_ELIXIR,
			Image:    "elixir",
			VersionsTags: map[string]string{
				"1.10": "1.10",
				"1.9":  "1.9",
				"1.8":  "1.8",
				"1.7":  "1.7",
			},
		},
	}
	MemoryOpts = &MemoryOptions{
		DefaultValue: 256,
		Values:       []int32{32, 64, 128, 194, 256, 384, 512, 768, 1024, 1536, 2048, 4096},
	}
	CPUOpts = &CPUOptions{
		DefaultValue: -1,
		Values: []float32{
			0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1,
			1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2},
	}
	AutoScalingOpts = &AutoScalingOptions{
		DefaultMinValue: 1,
		DefaultMaxValue: 2,
		Values:          []int32{1, 2, 3, 4, 5, 6, 7, 8, 9, 10},
	}
	TimeoutOpts = &TimeoutOptions{
		DefaultValue: 60,
		Values: []int32{
			30, 60, 90, 120, 150, 180, 210, 240, 270, 300,
			330, 360, 390, 420, 450, 480, 510, 540, 570, 600,
			660, 720, 780, 840, 900, 960, 1020, 1080, 1140, 1200},
	}
	JobTimeoutOpts = &TimeoutOptions{
		DefaultValue: 300,
		Values: []int32{
			300, 600, 900, 1800, 3600, 7200, 10800, 14400, 18000},
	}
)

func GetImageAndTag(language BuildConfig_Language, languageVersion string) (string, string, error) {
	for _, l := range LanguagesOptions {
		if l.Language == language {
			if tag, ok := l.VersionsTags[languageVersion]; ok {
				return l.Image, tag, nil
			}

			return "", "", errors.New(fmt.Sprintf("Language version %s not supported", languageVersion))
		}
	}

	return "", "", errors.New(fmt.Sprintf("Language %s not supported", language.String()))
}
