package api

import (
	"github.com/kintohub/kinto-core/internal/build"
	"github.com/kintohub/kinto-core/pkg/types"
	"github.com/kintohub/utils-go/github"
)

type BuildAPI struct {
	buildClient     types.WorkflowAPIServiceClient
	githubAppClient github.GithubInterface
}

func NewBuildAPI(buildClient types.WorkflowAPIServiceClient) build.BuildInterface {
	return &BuildAPI{
		buildClient: buildClient,
	}
}
