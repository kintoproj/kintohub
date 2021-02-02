package types

import (
	validation "github.com/go-ozzo/ozzo-validation/v4"
)

func (req BuildAndDeployRequest) Validate() error {
	return validation.ValidateStruct(&req,
		validation.Field(&req.BuildConfig, validation.Required),
		validation.Field(&req.BlockName, validation.Required),
		validation.Field(&req.ReleaseId, validation.Required),
		validation.Field(&req.Namespace, validation.Required),
	)
}

func (req DeployRequest) Validate() error {
	return validation.ValidateStruct(&req,
		validation.Field(&req.BlockName, validation.Required),
		validation.Field(&req.ReleaseId, validation.Required),
		validation.Field(&req.Namespace, validation.Required),
	)
}

func (req DeployCatalogRequest) Validate() error {
	return validation.ValidateStruct(&req,
		validation.Field(&req.BlockName, validation.Required),
		validation.Field(&req.ReleaseId, validation.Required),
		validation.Field(&req.Namespace, validation.Required),
		validation.Field(&req.Repo, validation.Required),
	)
}

func (req UndeployRequest) Validate() error {
	return validation.ValidateStruct(&req,
		validation.Field(&req.BlockName, validation.Required),
		validation.Field(&req.Namespace, validation.Required),
	)
}

func (req SuspendRequest) Validate() error {
	return validation.ValidateStruct(&req,
		validation.Field(&req.BlockName, validation.Required),
		validation.Field(&req.Namespace, validation.Required),
		validation.Field(&req.ReleaseId, validation.Required),
	)
}

func (req WorkflowLogsRequest) Validate() error {
	return validation.ValidateStruct(&req,
		validation.Field(&req.BuildId, validation.Required),
	)
}

func (req AbortReleaseRequest) Validate() error {
	return validation.ValidateStruct(&req,
		validation.Field(&req.BuildId, validation.Required),
		validation.Field(&req.EnvId, validation.Required))
}
