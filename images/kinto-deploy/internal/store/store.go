package store

import (
	kintoCoretypes "github.com/kintohub/kinto-kube-core/pkg/types"
	"kinto.io/kinto-kube-deploy/internal/types"
)

type Interface interface {
	CreateDeployment(release *types.Release) error
	DeleteDeployments(envId string, labels map[string]string) []error
	RollbackDeployment(release *types.Release) error
	CleanPreviousDeployment(release *types.Release) []error
	SuspendDeployment(blockName, envId string) []error
	WatchDeploymentStatus(release *types.Release) error

	UpsertService(release *types.Release) error
	DeleteService(blockName, envId string) []error

	UpsertJob(release *types.Release) error
	DeleteJob(blockName, envId string) error
	UpsertCronJob(release *types.Release) error
	DeleteCronJob(blockName, envId string) error
	SuspendCronJob(blockName, envId string) []error

	GetConfigMap(name string, namespace string) (*kintoCoretypes.Block, error)

	UpsertHPA(release *types.Release) error
	DeleteHPA(blockName, envId string) error

	UpsertHelmChart(release *types.Release) error
	DeleteHelmChart(name, namespace string) error
	SuspendHelmChart(name, namespace string) []error

	DeletePVCs(appLabelValue, namespace string) []error
}
