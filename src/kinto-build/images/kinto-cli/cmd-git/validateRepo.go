package cmd_git

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

// A map of the file extension to block and the line patterns (regex) that will fail the build if matched
var reposToBlock = map[string][]string{
	".json": {
		// matches:
		// "protocol": "freedom|v2mess|blackhole"
		`"protocol"\s*:\s*"(freedom|v2mess|blackhole)"`,
		"rsonva",
		"trojan",
		"shadowsocks",
		"v2ray",
		"vmess",
		"vless",
	},
	".sh": {
		// matches:
		// "protocol": "freedom|v2mess|blackhole"
		`"protocol"\s*:\s*"(freedom|v2mess|blackhole)"`,
		"rsonva",
		"trojan",
		"shadowsocks",
		"v2ray",
		"vmess",
		"vless",
	},
	"Dockerfile": {
		"https://github.com/ginuerzh/gost.git",
		"brook",
		"rsonva",
		"trojan",
		"shadowsocks",
		"v2ray",
		"vmess",
		"vless",
	},
}

// Validates if the code doesn't contains config files that are VPN related
func IsRepoCodeValid(dirPath string) bool {
	err := filepath.Walk(dirPath,
		func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			// search for only blocked extensions defined in  'reposToBlock'
			foundExtension := getSupportedFileExtension(info.Name())
			if !info.IsDir() && foundExtension != "" {
				if isFileValid(path, foundExtension) {
					return nil
				} else {
					return fmt.Errorf("Detected issue with: '%v'", path)
				}
			}
			return nil
		})
	if err != nil {
		debugErrf("Invalid Repo: %v\n", err)
		return false
	}
	return true
}

func getSupportedFileExtension(fileName string) string {
	for key := range reposToBlock {
		if strings.HasSuffix(fileName, key) {
			return key
		}
	}
	return ""
}

func isFileValid(filePath, fileExtension string) bool {
	f, err := os.Open(filePath)
	if err != nil {
	}
	defer f.Close()

	// Splits on newlines by default.
	scanner := bufio.NewScanner(f)

	// https://golang.org/pkg/bufio/#Scanner.Scan
	for scanner.Scan() {
		line := scanner.Text()
		for _, pattern := range reposToBlock[fileExtension] {
			matched, errf := regexp.MatchString(pattern, line)
			if errf == nil && matched {
				return false
			}
		}
	}

	if err := scanner.Err(); err != nil {
		debugErrf("Couldn't scan file: %v", err)
		// Handle the error
	}
	return true
}

// debug messages are hidden, we don't want to show these to users
func debugErrf(format string, a ...interface{}) {
	fmt.Printf("DEBUG ERR "+format, a...)
}
