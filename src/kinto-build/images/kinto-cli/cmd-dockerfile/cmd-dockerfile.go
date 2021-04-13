package cmd_dockerfile

import (
	"errors"
	"fmt"
	"github.com/kintoproj/kinto-core/pkg/types"
	"os"
	"text/template"
)

type dockerfile struct {
	Image        string
	Tag          string
	BuildCommand string
	RunCommand   string
	BuildArgs    []string
	BuildPath    string
}

func Generate(
	language, languageVersion, buildCommand, runCommand, outputPath, outputPathToStaticBuild string,
	buildArgs []string,
	isStaticBuild bool) error {

	tpl := getTemplate(language, isStaticBuild)

	if tpl == "" {
		return errors.New(fmt.Sprintf("No template associated with language %s", language))
	}

	t, err := template.New("dockerfile").Parse(tpl)

	if err != nil {
		return err
	}

	object, err := genDockerfileObject(
		language, languageVersion, buildCommand, runCommand, outputPathToStaticBuild, buildArgs)

	if err != nil {
		return err
	}

	f, err := os.Create(fmt.Sprintf("%s/Dockerfile", outputPath))

	if err != nil {
		return err
	}

	defer f.Close()

	return t.Execute(f, object)
}

func getTemplate(language string, isStaticBuild bool) string {
	l := types.BuildConfig_Language(types.BuildConfig_Language_value[language])

	switch l {
	case types.BuildConfig_GOLANG:
		if isStaticBuild {
			return golangStaticTemplate
		} else {
			return golangDynamicTemplate
		}
	case types.BuildConfig_NODEJS:
		if isStaticBuild {
			return nodeStaticTemplate
		} else {
			return nodeDynamicTemplate
		}
	case types.BuildConfig_PYTHON:
		return pythonDynamicTemplate
	case types.BuildConfig_JAVA:
		return javaDynamicTemplate
	case types.BuildConfig_RUBY:
		if isStaticBuild {
			return rubyStaticTemplate
		} else {
			return rubyDynamicTemplate
		}
	case types.BuildConfig_PHP:
		return phpDynamicTemplate
	case types.BuildConfig_RUST:
		return rustDynamicTemplate
	case types.BuildConfig_ELIXIR:
		return elixirDynamicTemplate
	default:
		return ""
	}
}

func genDockerfileObject(
	language, languageVersion, buildCommand, runCommand, outputPathToStaticBuild string,
	buildArgs []string) (*dockerfile, error) {

	image, tag, err :=
		types.GetImageAndTag(types.BuildConfig_Language(types.BuildConfig_Language_value[language]), languageVersion)

	if err != nil {
		return nil, err
	}

	return &dockerfile{
		Image:        image,
		Tag:          tag,
		BuildCommand: buildCommand,
		RunCommand:   runCommand,
		BuildArgs:    buildArgs,
		BuildPath:    outputPathToStaticBuild,
	}, nil
}
