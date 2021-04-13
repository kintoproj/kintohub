package types

import (
	"errors"
	"fmt"
	"github.com/ghodss/yaml"
)

var (
	versionsSupported = map[string]bool{
		"0.0.1": true,
	}
)

type Build struct {
	Language         string `yaml:"language"`
	LanguageVersion  string `yaml:"languageVersion"`
	BuildCommand     string `yaml:"buildCommand"`
	RunCommand       string `yaml:"startCommand"`
	SubfolderPath    string `yaml:"subfolderPath"`
	PublicOutputPath string `yaml:"publicOutputPath"`
	DockerfileName   string `yaml:"dockerfileName"`
}

type Deploy struct {
	CostOptimization     string            `yaml:"costOptimization"` // can't use bool cuz of an ozzo validation issue when `false`
	SleepMode            string            `yaml:"sleepMode"`        // can't use bool cuz of an ozzo validation issue when `false`
	SleepTTLSeconds      int32             `yaml:"sleepTTLSeconds"`  // TODO not supported yet
	Protocol             string            `yaml:"protocol"`         // TODO not supported yet
	Port                 string            `yaml:"port"`
	MemoryMB             int32             `yaml:"memoryMB"`
	CPUCores             float32           `yaml:"cpuCores"`
	Environment          map[string]string `yaml:"environment"`
	DeployTimeoutSeconds int32             `yaml:"deployTimeoutSeconds"`
	Autoscaling          *struct {
		Min int32 `yaml:"min"`
		Max int32 `yaml:"max"`
	}
	Job *struct {
		TimeoutSeconds int32  `yaml:"timeoutSeconds"`
		CronPattern    string `yaml:"cronPattern"`
	}
}

type Kinto struct {
	BlockType string `yaml:"type"` // TODO not supported yet
	Build     Build  `yaml:"build"`
	Deploy    Deploy `yaml:"deploy"`
}

type KintoYaml struct {
	Version string `yaml:"version"`
	Kinto   Kinto  `yaml:"kinto"`
}

func ConvertYamlToReleaseConfig(content string, blockType Block_Type) (*ReleaseConfig, error) {
	if blockType == Block_NOT_SET || blockType == Block_CATALOG || blockType == Block_HELM {
		return nil, errors.New(fmt.Sprintf("This type of block is not supported for kinto file - `%s`", blockType))
	}

	releaseYaml := KintoYaml{}

	if err := yaml.Unmarshal([]byte(content), &releaseYaml); err != nil {
		return nil, err
	}

	if _, ok := versionsSupported[releaseYaml.Version]; !ok {
		return nil, errors.New(fmt.Sprintf("This version is not supported yet in kinto file - `%s`", releaseYaml.Version))
	}

	if err := releaseYaml.Validate(); err != nil {
		return nil, err
	}

	return convertKintoYamlToReleaseConfig(releaseYaml, blockType), nil
}

func convertKintoYamlToReleaseConfig(blockYaml KintoYaml, blockType Block_Type) *ReleaseConfig {
	return &ReleaseConfig{
		BuildConfig: convertBuildYamlToBuildConfig(blockYaml.Kinto.Build, blockYaml.Kinto.Deploy.Environment, blockType),
		RunConfig:   convertDeployYamlToRunConfig(blockYaml.Kinto.Deploy, blockType),
	}
}

func convertBuildYamlToBuildConfig(
	buildYaml Build, envVars map[string]string, blockType Block_Type) *BuildConfig {

	buildConfig := &BuildConfig{
		Language:           convertStringToLanguage(buildYaml.Language),
		PathToCode:         buildYaml.SubfolderPath,
		DockerfileFileName: buildYaml.DockerfileName,
		BuildArgs:          envVars,
		Repository:         nil, // TODO might want to set that too?
	}

	if buildYaml.Language != BuildConfig_DOCKERFILE.String() {
		buildConfig.LanguageVersion = buildYaml.LanguageVersion
		buildConfig.BuildCommand = buildYaml.BuildCommand
		buildConfig.RunCommand = buildYaml.RunCommand
	}

	if blockType == Block_STATIC_SITE {
		buildConfig.PathToStaticOutput = buildYaml.PublicOutputPath
	}

	return buildConfig
}

func convertDeployYamlToRunConfig(deployYaml Deploy, blockType Block_Type) *RunConfig {
	runConfig := &RunConfig{
		Type:                    blockType,
		EnvVars:                 deployYaml.Environment,
		TimeoutInSec:            deployYaml.DeployTimeoutSeconds,
		CostOptimizationEnabled: deployYaml.CostOptimization == "true",
		Resources: &Resources{
			MemoryInMB: deployYaml.MemoryMB,
			CpuInCore:  deployYaml.CPUCores,
		},
	}

	if blockType == Block_WEB_APP || blockType == Block_BACKEND_API {
		runConfig.Port = deployYaml.Port

		runConfig.SleepModeEnabled = deployYaml.SleepMode == "true"
		if deployYaml.SleepTTLSeconds > 0 {
			runConfig.SleepModeTTLSeconds = deployYaml.SleepTTLSeconds
		} else {
			runConfig.SleepModeTTLSeconds = 300
		}
	}

	if blockType == Block_BACKEND_API {
		runConfig.Protocol = convertStringToProtocol(deployYaml.Protocol)
	}

	if deployYaml.Autoscaling != nil {
		runConfig.AutoScaling = &AutoScaling{
			Min: deployYaml.Autoscaling.Min,
			Max: deployYaml.Autoscaling.Max,
		}
	}

	if (blockType == Block_JOB || blockType == Block_CRON_JOB) && deployYaml.Job != nil {
		runConfig.JobSpec = &JobSpec{
			CronPattern:  deployYaml.Job.CronPattern,
			TimeoutInSec: deployYaml.Job.TimeoutSeconds,
		}
	}

	return runConfig
}

func convertStringToLanguage(languageString string) BuildConfig_Language {
	if language, ok := BuildConfig_Language_value[languageString]; ok {
		return BuildConfig_Language(language)
	} else {
		return BuildConfig_DOCKERFILE // return `Dockerfile` if language does not exist
	}
}

func convertStringToProtocol(protocoleString string) RunConfig_Protocol {
	if protocol, ok := RunConfig_Protocol_value[protocoleString]; ok {
		return RunConfig_Protocol(protocol)
	} else {
		return RunConfig_HTTP // return `HTTP` if language does not exist
	}
}
