package types

import (
	"github.com/asaskevich/govalidator"
	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/go-ozzo/ozzo-validation/v4/is"
	"regexp"
)

var (
	regexpRepoUrlWithoutToken = regexp.MustCompile(
		`^https://(github\.com|gitlab\.com|bitbucket\.org)/[a-zA-Z0-9-_.]*/[a-zA-Z0-9-_.]*(\.git)?$`)
)

func (r RunConfig) Validate() error {
	const sharedCpuValue = -1
	return validation.ValidateStruct(&r,
		validation.Field(&r.Port, validation.When(
			r.Type == Block_BACKEND_API || r.Type == Block_WEB_APP,
			validation.Required,
		), is.Port),
		validation.Field(
			&r.TimeoutInSec,
			validation.Required,
			validation.In(convertInt32ArrayToInterfaceArray(TimeoutOpts.Values)...),
		),
		// Resolves: https://app.clubhouse.io/kintohub/story/91/switching-from-dedicated-to-shared-cpu-does-not-remove-autoscale-settings
		// AutoScale can only be enabled when using dedicated cpu && when Resources actually exists
		validation.Field(&r.AutoScaling,
			validation.When(r.Resources != nil && r.Resources.CpuInCore == sharedCpuValue, validation.Nil),
			validation.When(r.Resources != nil && r.Resources.CpuInCore != sharedCpuValue, validation.NilOrNotEmpty)),
		validation.Field(&r.Type, validation.Required, validation.NotIn(Block_NOT_SET)),
		validation.Field(&r.Resources,
			validation.When(r.Type != Block_HELM && r.Type != Block_CATALOG, validation.Required)),
		validation.Field(&r.JobSpec,
			validation.When(r.Type == Block_JOB || r.Type == Block_CRON_JOB)),
	)
}

func (j JobSpec) Validate() error {
	return validation.ValidateStruct(&j,
		validation.Field(&j.TimeoutInSec,
			validation.Required, validation.In(convertInt32ArrayToInterfaceArray(JobTimeoutOpts.Values)...)),
		validation.Field(&j.CronPattern))
}

func isRepoUrlWithoutToken(s string) bool {
	if !govalidator.IsURL(s) {
		return false
	}

	return regexpRepoUrlWithoutToken.MatchString(s)
}

func (r Repository) Validate() error {
	return validation.ValidateStruct(&r,
		validation.Field(
			&r.Url,
			validation.Required,
			validation.NewStringRuleWithError(
				isRepoUrlWithoutToken,
				validation.NewError(
					"validation_is_repo_url_without_token",
					"must be a valid repo URL with no token",
				),
			),
		),
		validation.Field(&r.AccessToken, validation.Length(1, 64)),
		// https://stackoverflow.com/questions/24014361/max-length-of-git-branch-name
		validation.Field(&r.Branch, validation.Required, validation.Length(0, 370)),
	)
}

func (r Resources) Validate() error {
	return validation.ValidateStruct(&r,
		validation.Field(
			&r.CpuInCore,
			validation.When(r.CpuInCore != -1, validation.In(convertFloat32ArrayToInterfaceArray(CPUOpts.Values)...)),
		),
		validation.Field(
			&r.MemoryInMB,
			validation.Required,
			validation.In(convertInt32ArrayToInterfaceArray(MemoryOpts.Values)...),
		),
	)
}

func (a AutoScaling) Validate() error {
	return validation.ValidateStruct(&a,
		validation.Field(&a.CpuPercent, validation.Required, validation.Min(30), validation.Max(100)),
		validation.Field(
			&a.Min,
			validation.Required,
			validation.In(convertInt32ArrayToInterfaceArray(AutoScalingOpts.Values)...),
		),
		validation.Field(
			&a.Max,
			validation.Required,
			validation.In(convertInt32ArrayToInterfaceArray(AutoScalingOpts.Values)...),
			validation.Min(a.Min+1),
		),
	)
}

func (b BuildStatus) Validate() error {
	return validation.ValidateStruct(&b,
		validation.Field(&b.State, validation.Required),
	)
}

func (b BuildConfig) Validate() error {
	return validation.ValidateStruct(&b,
		validation.Field(&b.PathToCode, validation.Required),
		validation.Field(&b.Repository, validation.Required),
		validation.Field(
			&b.DockerfileFileName, validation.When(b.Language == BuildConfig_DOCKERFILE, validation.Required)),
		validation.Field(
			&b.LanguageVersion, validation.When(
				b.Language != BuildConfig_DOCKERFILE && b.Language != BuildConfig_NOT_SET, validation.Required)),
		validation.Field(
			&b.BuildCommand, validation.When(
				b.Language != BuildConfig_DOCKERFILE && b.Language != BuildConfig_NOT_SET, validation.Required)),
	)
}
