package utils

import (
	"fmt"
	"github.com/Terry-Mao/goconf"
	"github.com/golang/protobuf/ptypes"
	"github.com/kintoproj/kinto-cli/internal/config"
	"github.com/kintoproj/kinto-core/pkg/types"
	"github.com/rs/zerolog/log"
	"net"
	"strings"
)

//Gets the latest successful release from any service
func GetLatestSuccessfulRelease(releases map[string]*types.Release) *types.Release {
	if releases == nil || len(releases) == 0 { //nolint:gosimple
		return nil
	}

	var latestRelease *types.Release
	for _, release := range releases {
		// filter release by only successfully deployed and with valid deployment type (exclude SUSPEND and UNDEPLOY)
		// NOT_SET is included as well for backward compatibility
		if release.Status.State == types.Status_SUCCESS &&
			(release.Type == types.Release_ROLLBACK ||
				release.Type == types.Release_DEPLOY ||
				release.Type == types.Release_NOT_SET) {
			if latestRelease == nil {
				latestRelease = release
				continue
			}

			latestCreatedAt, err := ptypes.Timestamp(latestRelease.CreatedAt)

			if err != nil {
				log.Error().Err(err).Msgf(
					"cannot parse timestamp %v to time for release %v", latestRelease.CreatedAt, latestRelease)
				continue
			}

			releaseCreateAt, err := ptypes.Timestamp(release.CreatedAt)

			if err != nil {
				log.Error().Err(err).Msgf(
					"cannot parse timestamp %v to time for release %v", release.CreatedAt, release)
				continue
			}

			if releaseCreateAt.After(latestCreatedAt) {
				latestRelease = release
			}
		}
	}

	return latestRelease
}

//Check if supplied port is open. takes a bool param to either kill the cli on error or return false.
//this is so as to reuse the fn for checking teleport connection status.
func CheckIfPortOpened(port int, terminateOnError bool) bool {
	address := fmt.Sprintf(":%d", port)
	connection, err := net.Listen("tcp", address)
	if err != nil {
		if terminateOnError {
			TerminateWithCustomError(
				fmt.Sprintf("Port %d is already in use. Please free it first!", port))
		} else {
			return false
		}

	} else {
		_ = connection.Close()
	}
	return true
}


//check if Local Git Repo exists
func CheckLocalGitOrDie() {
	conf := goconf.New()
	err := conf.Parse("./.git/config")
	if err != nil {
		TerminateWithCustomError("Not a Git Repo. Please initialize the repo with Git first")
	}

}

//compare passed URL with local git repo url
func CompareGitUrl(remoteGitUrl string) bool {
	conf := goconf.New()
	_ = conf.Parse("./.git/config")
	remote := conf.Get("remote \"origin\"")
	if remote == nil {
		// In case if git ever changes their config structure.
		TerminateWithCustomError("Cannot parse Git config")
	}
	localGitUrl, err := remote.String("url")
	if err != nil {
		TerminateWithError(err)
	}
	localGitUrl = strings.Trim(localGitUrl, "= ")

	return strings.Replace(remoteGitUrl, ".git", "", -1) ==
		strings.Replace(localGitUrl, ".git", "", -1)

}

//set ports for catalog services.
//TODO : remove these once, catalog ports are available in run config
func GetBlockPort(blockName string) int {

	if strings.Contains(blockName, "redis") {
		return config.RedisPort
	} else if strings.Contains(blockName, "postgres") {
		return config.PostgresPort
	} else if strings.Contains(blockName, "mongodb") {
		return config.MongoPort
	} else if strings.Contains(blockName, "minio") {
		return config.MinioPort
	} else if strings.Contains(blockName, "mysql") {
		return config.MysqlPort
	} else {
		return 80 // every kintobub service is listening on their port + port 80
	}
}

//check if service is port-forwardable/teleportable or not.
func CanPortForwardToRelease(release *types.Release) bool {
	if release.RunConfig != nil &&
		(release.RunConfig.Type == types.Block_BACKEND_API ||
			release.RunConfig.Type == types.Block_WEB_APP ||
			release.RunConfig.Type == types.Block_CATALOG) {
		return true
	} else {
		return false
	}
}

