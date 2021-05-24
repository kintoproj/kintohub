package api

import (
	"github.com/kintoproj/go-utils/github"
	"github.com/kintoproj/kintohub/core/internal/build"
	"github.com/kintoproj/kintohub/core/pkg/types"
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
