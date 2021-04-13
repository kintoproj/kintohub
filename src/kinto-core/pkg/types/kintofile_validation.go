package types

import (
	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/go-ozzo/ozzo-validation/v4/is"
)

func (k KintoYaml) Validate() error {
	return validation.ValidateStruct(&k,
		validation.Field(&k.Version, validation.Required),
		validation.Field(&k.Kinto, validation.Required),
	)
}

func (k Kinto) Validate() error {
	return validation.ValidateStruct(&k,
		validation.Field(&k.Build, validation.Required),
		validation.Field(&k.Deploy, validation.Required),
	)
}

func (b Build) Validate() error {
	return validation.ValidateStruct(&b,
		validation.Field(&b.Language, validation.Required),
		validation.Field(&b.SubfolderPath, validation.Required),
		validation.Field(&b.DockerfileName, validation.Required),
	)
}

func (d Deploy) Validate() error {
	return validation.ValidateStruct(&d,
		validation.Field(&d.CostOptimization, validation.Required),
		validation.Field(&d.SleepMode, validation.Required),
		validation.Field(&d.Port, is.Port),
		validation.Field(
			&d.DeployTimeoutSeconds,
			validation.Required,
			validation.In(convertInt32ArrayToInterfaceArray(TimeoutOpts.Values)...),
		),
		validation.Field(
			&d.CPUCores,
			validation.When(d.CPUCores != 0, validation.In(convertFloat32ArrayToInterfaceArray(CPUOpts.Values)...)),
		),
		validation.Field(
			&d.MemoryMB,
			validation.Required,
			validation.In(convertInt32ArrayToInterfaceArray(MemoryOpts.Values)...),
		),
	)
}
