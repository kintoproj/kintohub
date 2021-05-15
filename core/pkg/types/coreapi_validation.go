package types

import (
	validation "github.com/go-ozzo/ozzo-validation/v4"
	"regexp"
)

var (
	// Starts with lowercase alphabetical character, otherwise
	// Few tests written here https://regexr.com/5b6k5
	kintoSafeNameRegex = regexp.MustCompile(`^[a-zA-Z][a-zA-Z0-9-]+[a-zA-Z0-9]$`)
)

func (e EnvironmentQueryRequest) Validate() error {
	return validation.ValidateStruct(&e,
		validation.Field(&e.Id, validation.Required),
	)
}

func (d CreateEnvironmentRequest) Validate() error {
	return validation.ValidateStruct(&d,
		validation.Field(&d.Name, validation.Required),
	)
}

func (d UpdateEnvironmentRequest) Validate() error {
	return validation.ValidateStruct(&d,
		validation.Field(&d.Id, validation.Required),
		validation.Field(&d.Name, validation.Required),
	)
}

func (d DeleteEnvironmentRequest) Validate() error {
	return validation.ValidateStruct(&d,
		validation.Field(&d.Id, validation.Required),
	)
}

func (c TriggerDeployRequest) Validate() error {
	return validation.ValidateStruct(&c,
		validation.Field(&c.EnvId, validation.Required),
		validation.Field(&c.Name, validation.Required, validation.Length(1, 54), validation.Match(kintoSafeNameRegex)),
	)
}

func (c CreateBlockRequest) Validate() error {
	return validation.ValidateStruct(&c,
		validation.Field(&c.EnvId, validation.Required),
		validation.Field(&c.Name, validation.Required, validation.Length(1, 54), validation.Match(kintoSafeNameRegex)),
		validation.Field(&c.RunConfig, validation.Required),
		validation.Field(&c.BuildConfig, validation.Required),
	)
}

func (d DeployBlockRequest) Validate() error {
	return validation.ValidateStruct(&d,
		validation.Field(&d.EnvId, validation.Required),
		validation.Field(&d.Name, validation.Required),
		validation.Field(&d.RunConfig, validation.Required),
		validation.Field(&d.BuildConfig, validation.Required),
	)
}

func (s BlockQueryRequest) Validate() error {
	return validation.ValidateStruct(&s,
		validation.Field(&s.EnvId),
		validation.Field(&s.Name),
	)
}

func (d DeleteBlockRequest) Validate() error {
	return validation.ValidateStruct(&d,
		validation.Field(&d.EnvId, validation.Required),
		validation.Field(&d.Name, validation.Required),
	)
}

func (req UpdateBuildStatusRequest) Validate() error {
	return validation.ValidateStruct(&req,
		validation.Field(&req.ReleaseId, validation.Required),
		validation.Field(&req.EnvId, validation.Required),
		validation.Field(&req.BlockName, validation.Required),
		validation.Field(&req.Status, validation.Required),
	)
}

func (req UpdateBuildCommitShaRequest) Validate() error {
	return validation.ValidateStruct(&req,
		validation.Field(&req.ReleaseId, validation.Required),
		validation.Field(&req.EnvId, validation.Required),
		validation.Field(&req.BlockName, validation.Required),
		validation.Field(&req.CommitSha, validation.Required),
	)
}

func (req KillBlockInstanceRequest) Validate() error {
	return validation.ValidateStruct(&req,
		validation.Field(&req.Id, validation.Required),
		validation.Field(&req.EnvId, validation.Required))
}

func (req RollbackBlockRequest) Validate() error {
	return validation.ValidateStruct(&req,
		validation.Field(&req.ReleaseId, validation.Required),
		validation.Field(&req.EnvId, validation.Required),
		validation.Field(&req.Name, validation.Required))
}

func (req SuspendBlockRequest) Validate() error {
	return validation.ValidateStruct(&req,
		validation.Field(&req.Name, validation.Required),
		validation.Field(&req.EnvId, validation.Required),
	)
}

func (req CustomDomainNameRequest) Validate() error {
	return validation.ValidateStruct(&req,
		validation.Field(&req.BlockName, validation.Required),
		validation.Field(&req.EnvId, validation.Required),
		validation.Field(&req.CustomDomainName, validation.Required),
		validation.Field(&req.CNAME, validation.Required),
	)
}

func (req EnablePublicURLRequest) Validate() error {
	return validation.ValidateStruct(&req,
		validation.Field(&req.BlockName, validation.Required),
		validation.Field(&req.EnvId, validation.Required),
		validation.Field(&req.ReleaseId, validation.Required),
	)
}

func (req DisablePublicURLRequest) Validate() error {
	return validation.ValidateStruct(&req,
		validation.Field(&req.BlockName, validation.Required),
		validation.Field(&req.EnvId, validation.Required),
	)
}

func (req AbortBlockReleaseRequest) Validate() error {
	return validation.ValidateStruct(&req,
		validation.Field(&req.BlockName, validation.Required),
		validation.Field(&req.ReleaseId, validation.Required),
		validation.Field(&req.EnvId, validation.Required),
	)
}

func (req TeleportRequest) Validate() error {
	return validation.ValidateStruct(&req,
		validation.Field(&req.EnvId, validation.Required),
	)
}

func (req TagReleaseRequest) Validate() error {
	return validation.ValidateStruct(&req,
		validation.Field(&req.BlockName, validation.Required),
		validation.Field(&req.ReleaseId, validation.Required),
		validation.Field(&req.EnvId, validation.Required),
		validation.Field(&req.Tag, validation.Required),
	)
}

func (req PromoteReleaseRequest) Validate() error {
	return validation.ValidateStruct(&req,
		validation.Field(&req.EnvId, validation.Required),
		validation.Field(&req.BlockName, validation.Required),
		validation.Field(&req.Tag, validation.Required),
		validation.Field(&req.TargetEnvId, validation.Required),
	)
}

func (req GenReleaseConfigFromKintoFileRepoRequest) Validate() error {
	return validation.ValidateStruct(&req,
		validation.Field(&req.BlockType, validation.Required),
		validation.Field(&req.Org, validation.Required),
		validation.Field(&req.Repo, validation.Required),
		validation.Field(&req.Branch, validation.Required),
		validation.Field(&req.EnvId, validation.Required),
		validation.Field(&req.GithubUserToken, validation.Required),
	)
}
