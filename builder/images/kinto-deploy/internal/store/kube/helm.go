package kube

import (
	"context"
	"encoding/json"
	"fmt"
	"helm.sh/helm/v3/pkg/action"
	"helm.sh/helm/v3/pkg/chart/loader"
	"helm.sh/helm/v3/pkg/cli"
	"helm.sh/helm/v3/pkg/cli/values"
	"helm.sh/helm/v3/pkg/getter"
	"helm.sh/helm/v3/pkg/storage/driver"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	k8stypes "k8s.io/apimachinery/pkg/types"
	"k8s.io/client-go/kubernetes"
	"kintoproj/kinto-deploy/internal/types"
	"time"
)

// Examples:
// https://helm.sh/docs/topics/advanced/#simple-example

func upsertHelmChart(helmConfig *action.Configuration, release *types.Release) error {
	doesHelmChartExist, err := doesHelmChartAlreadyExist(helmConfig, release.BlockName)

	if err != nil {
		return err
	}

	if doesHelmChartExist {
		return upgradeHelmChart(helmConfig, release)
	} else {
		return installHelmChart(helmConfig, release)
	}
}

// https://github.com/helm/helm/blob/release-3.2/cmd/helm/upgrade.go#L82-L84
func doesHelmChartAlreadyExist(helmConfig *action.Configuration, blockName string) (bool, error) {
	histClient := action.NewHistory(helmConfig)
	histClient.Max = 1
	_, err := histClient.Run(blockName)

	if err == nil {
		return true, nil
	}

	if err == driver.ErrReleaseNotFound {
		return false, nil
	}

	return false, err
}

func genHelmValues(release *types.Release) (map[string]interface{}, error) {
	var stringEnvVars []string
	for k, v := range release.EnvVars {
		stringEnvVars = append(stringEnvVars, fmt.Sprintf("%s=%s", k, v))
	}

	valOptions := values.Options{
		ValueFiles: []string{fmt.Sprintf("%s/%s", release.ChartPath, release.ChartValuesFileName)},
		Values:     stringEnvVars,
	}
	p := getter.All(cli.New())
	vals, err := valOptions.MergeValues(p)

	if err != nil {
		return nil, err
	}

	return vals, nil
}

// https://github.com/helm/helm/blob/release-3.2/cmd/helm/upgrade.go#L89
func installHelmChart(helmConfig *action.Configuration, release *types.Release) error {
	chart, err := loader.Load(release.ChartPath)

	installClient := action.NewInstall(helmConfig)
	installClient.ReleaseName = release.BlockName
	installClient.Namespace = release.EnvId
	installClient.Wait = true
	installClient.Timeout = time.Duration(release.TimeoutInSec) * time.Second

	vals, err := genHelmValues(release)

	if err != nil {
		return err
	}

	rel, err := installClient.Run(chart, vals)

	if err != nil {
		return err
	}

	fmt.Println("Successfully installed release: ", rel.Name)

	return nil
}

// https://github.com/helm/helm/blob/release-3.2/cmd/helm/upgrade.go#L65
func upgradeHelmChart(helmConfig *action.Configuration, release *types.Release) error {
	chart, err := loader.Load(release.ChartPath)

	upgradeClient := action.NewUpgrade(helmConfig)
	upgradeClient.Namespace = release.EnvId
	upgradeClient.Wait = true
	upgradeClient.Timeout = time.Duration(release.TimeoutInSec) * time.Second

	vals, err := genHelmValues(release)

	if err != nil {
		return err
	}

	rel, err := upgradeClient.Run(release.BlockName, chart, vals)
	if err != nil {
		return err
	}

	fmt.Println("Successfully upgraded release: ", rel.Name)

	return nil
}

func deleteHelmChart(helmConfig *action.Configuration, name string) error {
	doesHelmChartExist, err := doesHelmChartAlreadyExist(helmConfig, name)

	if err != nil {
		return err
	}

	if doesHelmChartExist {

		uninstallClient := action.NewUninstall(helmConfig)
		uninstallClient.KeepHistory = false

		rel, err := uninstallClient.Run(name)
		if err != nil {
			return err
		}

		fmt.Println("Successfully deleted release: ", rel.Release.Name)
	}

	return nil
}

func suspendHelmStatefulsets(kubeClient kubernetes.Interface, blockName, namespace string) []error {
	var errs []error

	stss, err := kubeClient.AppsV1().StatefulSets(namespace).List(
		context.TODO(),
		metav1.ListOptions{
			LabelSelector: fmt.Sprintf("app=%s", blockName),
		})

	if err != nil {
		return append(errs, err)
	}

	if len(stss.Items) == 0 {
		return nil
	}

	type patchInt32Value struct {
		Op    string `json:"op"`
		Path  string `json:"path"`
		Value int32  `json:"value"`
	}
	payload := []patchInt32Value{{
		Op:    "replace",
		Path:  "/spec/replicas",
		Value: 0,
	}}
	payloadBytes, err := json.Marshal(payload)

	if err != nil {
		return append(errs, err)
	}

	for _, sts := range stss.Items {
		_, err = kubeClient.
			AppsV1().
			StatefulSets(namespace).
			Patch(context.TODO(), sts.Name, k8stypes.JSONPatchType, payloadBytes, metav1.PatchOptions{})

		if err != nil {
			errs = append(errs, err)
		}
	}

	return errs
}

func suspendHelmDeployments(kubeClient kubernetes.Interface, blockName, namespace string) []error {
	var errs []error

	deploys, err := kubeClient.AppsV1().Deployments(namespace).List(
		context.TODO(),
		metav1.ListOptions{
			LabelSelector: fmt.Sprintf("app=%s", blockName),
		})

	if err != nil {
		return append(errs, err)
	}

	if len(deploys.Items) == 0 {
		return nil
	}

	type patchInt32Value struct {
		Op    string `json:"op"`
		Path  string `json:"path"`
		Value int32  `json:"value"`
	}
	payload := []patchInt32Value{{
		Op:    "replace",
		Path:  "/spec/replicas",
		Value: 0,
	}}
	payloadBytes, err := json.Marshal(payload)

	if err != nil {
		return append(errs, err)
	}

	for _, deploy := range deploys.Items {
		_, err = kubeClient.
			AppsV1().
			Deployments(namespace).
			Patch(context.TODO(), deploy.Name, k8stypes.JSONPatchType, payloadBytes, metav1.PatchOptions{})

		if err != nil {
			errs = append(errs, err)
		}
	}

	return errs
}
