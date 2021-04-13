package kube

import (
	"github.com/stretchr/testify/assert"
	"k8s.io/client-go/kubernetes/fake"
	"kintoproj/kinto-deploy/internal/types"
	"testing"
)

var kubeStore = NewStoreClient(fake.NewSimpleClientset(), nil)

func TestStore_CreateJob(t *testing.T) {
	release := genDummyRelease()

	// create
	err := kubeStore.UpsertJob(release)
	assert.NoError(t, err)

	// update
	err = kubeStore.UpsertJob(release)
	assert.NoError(t, err)
}

func TestStore_CreateCronJob(t *testing.T) {
	release := genDummyRelease()

	// create
	err := kubeStore.UpsertCronJob(release)
	assert.NoError(t, err)

	// update
	err = kubeStore.UpsertCronJob(release)
	assert.NoError(t, err)

}

func TestStore_CreateDeployment(t *testing.T) {
	release := genDummyRelease()

	// create
	err := kubeStore.CreateDeployment(release)
	assert.NoError(t, err)
}

func TestStore_UpsertHPA(t *testing.T) {
	release := genDummyRelease()

	// create
	err := kubeStore.UpsertHPA(release)
	assert.NoError(t, err)

	// update
	release.HPA.Max = 10
	err = kubeStore.UpsertHPA(release)
	assert.NoError(t, err)

	// delete
	err = kubeStore.DeleteHPA(release.BlockName, release.EnvId)
	assert.NoError(t, err)
}

func TestStore_UpsertHelmChart(t *testing.T) {
	t.Skip() // skip because cannot run without a kubernetes cluster
	release := &types.Release{
		BlockName:           "mongo-test",
		EnvId:               "test-chart",
		TimeoutInSec:        300,
		ChartPath:           "/Users/benjaminapprederisse/Workspace/charts-bitnami/bitnami/mongodb/",
		ChartValuesFileName: "values.yaml",
		EnvVars: map[string]string{
			"replicaSet.enabled": "true",
		},
	}

	err := kubeStore.UpsertHelmChart(release)
	assert.NoError(t, err)

	err = kubeStore.DeleteHelmChart(release.BlockName, release.EnvId)
	assert.NoError(t, err)
}
