package api

import (
	"github.com/kintohub/utils-go/github"
	"github.com/kintoproj/kinto-core/internal/build"
	"github.com/kintoproj/kinto-core/pkg/types"
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
