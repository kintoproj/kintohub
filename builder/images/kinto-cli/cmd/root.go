package cmd

import (
	"fmt"
	"os"
	"strings"

	cmd_dockerfile "github.com/kintoproj/kintohub/cli/cmd-dockerfile"
	cmd_git "github.com/kintoproj/kintohub/cli/cmd-git"
	cmd_release "github.com/kintoproj/kintohub/cli/cmd-release"
	"github.com/spf13/cobra"
	"github.com/ttacon/chalk"
)

var (
	rootCmd = &cobra.Command{
		Use:   "kinto",
		Short: "Kinto CLI",
	}
)

func Execute() error {
	return rootCmd.Execute()
}

func init() {
	rootCmd.AddCommand(
		NewDockerfileCommand(),
		NewGitCommand(),
		NewReleaseCommand())
}

func NewDockerfileCommand() *cobra.Command {
	var language, languageVersion, buildCommand, runCommand, outputPath, outputPathToStaticBuild string
	var isStaticBuild bool
	var buildArgs []string

	c := &cobra.Command{
		Use:   "dockerfile",
		Short: "GenerateDynamic a Dockerfile for KintoHub build",
		Run: func(cmd *cobra.Command, args []string) {
			if language == "" || languageVersion == "" || buildCommand == "" || runCommand == "" {
				fmt.Print(chalk.Red.Color("language, languageVersion, buildCommand and runCommand are required"))
				os.Exit(1)
			}

			err := cmd_dockerfile.Generate(
				strings.ToUpper(language),
				languageVersion,
				buildCommand,
				runCommand,
				outputPath,
				outputPathToStaticBuild,
				buildArgs,
				isStaticBuild)

			if err != nil {
				fmt.Printf(chalk.Red.Color("%v"), err)
				os.Exit(1)
			}

			fmt.Println("DEBUG Dockerfile generated")
		},
	}

	c.PersistentFlags().StringVar(&language, "language", "",
		"your application language - golang | java | nodejs | python | ruby | php | rust | elixir")
	c.PersistentFlags().StringVar(
		&languageVersion, "language-version", "",
		"your language version - default to latest")
	c.PersistentFlags().StringVar(
		&buildCommand, "build-command", "",
		"build command run in the root directory to build your app - ex: npm install && npm run build")
	c.PersistentFlags().StringVar(
		&runCommand, "run-command", "",
		"run command run in the root directory to run your app - ex: npm start")
	c.PersistentFlags().StringSliceVar(&buildArgs, "build-args", []string{},
		"build arguments used during the build - only the keys - ex: NODE_ENV")
	c.PersistentFlags().BoolVar(&isStaticBuild, "is-static-build", false,
		"is the build a static build")

	currentDir, _ := os.Getwd()
	c.PersistentFlags().StringVar(
		&outputPath, "output-path", currentDir,
		"output path - it will generate a 'Dockerfile' at this path - default to current repository")
	c.PersistentFlags().StringVar(
		&outputPathToStaticBuild, "output-path-to-static-build", currentDir,
		"output path to static build files - it will get the public static files from this folder - default to current repository")

	return c
}

func NewGitCommand() *cobra.Command {
	var gitRepoURL, gitBranch, workdir string

	c := &cobra.Command{
		Use:   "git",
		Short: "Clone a git repository",
		Run: func(cmd *cobra.Command, args []string) {
			if gitRepoURL == "" || gitBranch == "" || workdir == "" {
				fmt.Print(chalk.Red.Color("gitRepoURL, gitBranch and workdir are required"))
				os.Exit(1)
			}

			err := cmd_git.GitCloneAndCheckout(gitRepoURL, gitBranch, workdir)

			if err != nil {
				fmt.Printf(chalk.Red.Color("%v"), err)
				os.Exit(1)
			}

			fmt.Println("DEBUG Repository cloned")
		},
	}

	c.PersistentFlags().StringVar(
		&gitRepoURL, "gitRepoURL", "",
		"Git Repository URL")
	c.PersistentFlags().StringVar(
		&gitBranch, "gitBranch", "master",
		"Git Branch - Default to master")
	c.PersistentFlags().StringVar(
		&workdir, "workdir", "/workspace",
		"Where do we clone the repo")

	return c
}

func NewReleaseCommand() *cobra.Command {
	releaseCmd := &cobra.Command{
		Use:   "release",
		Short: "Update releases",
	}

	releaseCmd.AddCommand(
		NewReleaseStatusCommand(),
		NewReleaseCommitCommand())

	return releaseCmd
}

func NewReleaseStatusCommand() *cobra.Command {
	var kintoCoreHost, envId, blockName, releaseId, status, kintoCoreSecretKey string
	var kintoCoreOverTls bool

	c := &cobra.Command{
		Use:   "status",
		Short: "Update the status of a release",
		Run: func(cmd *cobra.Command, args []string) {
			if kintoCoreHost == "" || envId == "" || blockName == "" || releaseId == "" || status == "" {
				fmt.Print(chalk.Red.Color("kintoCoreHost, envId, blockName, releaseId and status are required"))
				os.Exit(1)
			}

			err := cmd_release.UpdateReleaseStatus(
				kintoCoreHost, envId, blockName, releaseId, status, kintoCoreOverTls, kintoCoreSecretKey)

			if err != nil {
				fmt.Printf(chalk.Red.Color("%v"), err)
				os.Exit(1)
			}

			fmt.Println(fmt.Sprintf("DEBUG Status %s updated", status))
		},
	}

	c.PersistentFlags().StringVar(
		&kintoCoreHost, "kintoCoreHost", "",
		"Kinto Kube Core API Host - GRPC endpoint")
	c.PersistentFlags().BoolVar(
		&kintoCoreOverTls, "kintoCoreOverTls", false,
		"Is Kinto Kube Core API over TLS")
	c.PersistentFlags().StringVar(
		&kintoCoreSecretKey, "kintoCoreSecretKey", "",
		"Kinto Core Secret Key - can be empty if disabled on kinto core")
	c.PersistentFlags().StringVar(
		&envId, "envId", "",
		"Environment Id of the block")
	c.PersistentFlags().StringVar(
		&blockName, "blockName", "",
		"Block Name of the release")
	c.PersistentFlags().StringVar(
		&releaseId, "releaseId", "",
		"Id of the release being updated")
	c.PersistentFlags().StringVar(
		&status, "status", "",
		"Status of the release - Must match a BuildStatus_State from proto")

	return c
}

func NewReleaseCommitCommand() *cobra.Command {
	var kintoCoreHost, envId, blockName, releaseId, commitSha, kintoCoreSecretKey string
	var kintoCoreOverTls bool

	c := &cobra.Command{
		Use:   "commit",
		Short: "Update the commit sha of a release",
		Run: func(cmd *cobra.Command, args []string) {
			if kintoCoreHost == "" || envId == "" || blockName == "" || releaseId == "" || commitSha == "" {
				fmt.Print(chalk.Red.Color("kintoCoreHost, envId, blockName, releaseId and commitSha are required"))
				os.Exit(1)
			}

			err := cmd_release.UpdateReleaseCommitSha(
				kintoCoreHost, envId, blockName, releaseId, commitSha, kintoCoreOverTls, kintoCoreSecretKey)

			if err != nil {
				fmt.Printf(chalk.Red.Color("%v"), err)
				os.Exit(1)
			}

			fmt.Println(fmt.Sprintf("DEBUG Commit %s set for release %s", commitSha, releaseId))
		},
	}

	c.PersistentFlags().StringVar(
		&kintoCoreHost, "kintoCoreHost", "",
		"Kinto Core API Host - GRPC endpoint")
	c.PersistentFlags().BoolVar(
		&kintoCoreOverTls, "kintoCoreOverTls", false,
		"Is Kinto Core API over TLS")
	c.PersistentFlags().StringVar(
		&kintoCoreSecretKey, "kintoCoreSecretKey", "",
		"Kinto Core Secret Key - can be empty if disabled on kinto core")
	c.PersistentFlags().StringVar(
		&envId, "envId", "",
		"Environment Id of the block")
	c.PersistentFlags().StringVar(
		&blockName, "blockName", "",
		"Block Name of the release")
	c.PersistentFlags().StringVar(
		&releaseId, "releaseId", "",
		"Id of the release being updated")
	c.PersistentFlags().StringVar(
		&commitSha, "commitSha", "",
		"Git Commit SHA")

	return c
}
