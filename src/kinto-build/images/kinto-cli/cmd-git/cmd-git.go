package cmd_git

import (
	"fmt"
	"strings"

	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/plumbing"
)

func GitCloneAndCheckout(gitRepoUrl, gitBranch, workdir string) error {
	splitTokenFromRepo := strings.Split(gitRepoUrl, "@")
	urlWithoutToken := splitTokenFromRepo[0]
	if len(splitTokenFromRepo) > 1 {
		urlWithoutToken = splitTokenFromRepo[1]
	}

	fmt.Printf("Cloning repository %s...\n", urlWithoutToken)
	fmt.Printf("Checking out branch %s...\n", gitBranch)

	r, err := git.PlainClone(workdir, false, &git.CloneOptions{
		URL:           gitRepoUrl,
		ReferenceName: plumbing.NewBranchReferenceName(gitBranch),
	})

	if err != nil {
		return err
	}

	ref, err := r.Head()

	if err != nil {
		return err
	}
	if !IsRepoCodeValid(workdir) {
		return fmt.Errorf("Problem happened after cloning the code")
	}

	fmt.Println(fmt.Sprintf("Using commit hash %s", ref.Hash()))

	return err
}
