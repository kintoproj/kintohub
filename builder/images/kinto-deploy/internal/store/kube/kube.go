package kube

import (
	"kintoproj/kinto-deploy/internal/store"
	"kintoproj/kinto-deploy/internal/types"
	"os"

	kintoCoretypes "github.com/kintoproj/kintohub/core/pkg/types"
	"github.com/rs/zerolog/log"
	"helm.sh/helm/v3/pkg/action"
	"helm.sh/helm/v3/pkg/kube"
	"k8s.io/client-go/kubernetes"
	_ "k8s.io/client-go/plugin/pkg/client/auth/gcp"
	"k8s.io/client-go/tools/clientcmd"
)

type Store struct {
	kubeClient kubernetes.Interface
	helmConfig *action.Configuration
}

func NewStoreClient(kubeClient kubernetes.Interface, helmConfig *action.Configuration) store.Interface {
	return &Store{
		kubeClient: kubeClient,
		helmConfig: helmConfig,
	}
}

func NewKubeClientOrDie(kubeConfigPath string) kubernetes.Interface {
	kubeConf, err := clientcmd.BuildConfigFromFlags("", kubeConfigPath)
	if err != nil {
		log.Panic().Err(err).Msgf("Could not find kubeconfig file at %s", kubeConfigPath)
	}

	return kubernetes.NewForConfigOrDie(kubeConf)
}

// https://github.com/helm/helm/blob/release-3.2/cmd/helm/helm.go#L72-L78
func NewHelmConfigurationOrDie(kubeConfigPath, namespace string) *action.Configuration {
	actionConfig := new(action.Configuration)

	err := actionConfig.Init(
		kube.GetConfig(kubeConfigPath, "", namespace),
		namespace,
		os.Getenv("HELM_DRIVER"), // can be empty
		func(format string, v ...interface{}) {
			log.Debug().Msgf(format, v...)
		})

	if err != nil {
		log.Panic().Err(err).Msgf("Something bad happened during helm initialization")
	}

	return actionConfig
}

func (s *Store) CreateDeployment(release *types.Release) error {
	_, err := createDeployment(s.kubeClient, release)

	return err
}

func (s *Store) DeleteDeployments(envId string, labels map[string]string) []error {
	return deleteDeployments(s.kubeClient, envId, labels)
}

func (s *Store) SuspendDeployment(blockName, envId string) []error {
	return suspendDeployment(s.kubeClient, blockName, envId)
}

func (s *Store) RollbackDeployment(release *types.Release) error {
	return rollbackDeployment(s.kubeClient, release)
}

func (s *Store) CleanPreviousDeployment(release *types.Release) []error {
	return cleanOldDeployments(s.kubeClient, release)
}

func (s *Store) UpsertService(release *types.Release) error {
	var err error

	if release.ProxlessConfig == nil { // sleep mode is disabled
		_, err = upsertService(s.kubeClient, release)

		if err != nil {
			return err
		}

		// we delete the proxless service if it exists cuz we are not using it anymore
		// covers the case where a user switch on and off the sleep mode
		err = deleteService(s.kubeClient, genProxlessServiceName(release.BlockName), release.EnvId)

		if err != nil {
			return err
		}
	} else {
		err = upsertServicesForProxless(s.kubeClient, release)

		if err != nil {
			return err
		}
	}

	return nil
}

// This function does a safe delete - it does not crash if service does not exist
func (s *Store) DeleteService(blockName, envId string) []error {
	var errs []error

	// delete app service
	err := deleteService(s.kubeClient, blockName, envId)

	if err != nil {
		errs = append(errs, err)
	}

	// delete proxless service
	err = deleteService(s.kubeClient, genProxlessServiceName(blockName), envId)

	if err != nil {
		errs = append(errs, err)
	}

	return errs
}

func (s *Store) UpsertJob(release *types.Release) error {
	_, err := upsertJob(s.kubeClient, release)

	return err
}

func (s *Store) DeleteJob(blockName, envId string) error {
	return deleteJob(s.kubeClient, blockName, envId)
}

func (s *Store) UpsertCronJob(release *types.Release) error {
	_, err := upsertCronJob(s.kubeClient, release)

	return err
}

func (s *Store) DeleteCronJob(blockName, envId string) error {
	return deleteCronJob(s.kubeClient, blockName, envId)
}

func (s *Store) SuspendCronJob(blockName, envId string) []error {
	return suspendCronJob(s.kubeClient, blockName, envId)
}

func (s *Store) GetConfigMap(name, namespace string) (*kintoCoretypes.Block, error) {
	cm, err := getConfigMap(s.kubeClient, name, namespace)

	if err != nil {
		return nil, err
	}

	return kintoCoretypes.ConfigMapToBlock(cm)
}

func (s *Store) WatchDeploymentStatus(release *types.Release) error {
	return watchPodsLogsAndStatus(s.kubeClient, release)
}

func (s *Store) UpsertHPA(release *types.Release) error {
	_, err := upsertHPA(s.kubeClient, release)

	return err
}

func (s *Store) DeleteHPA(blockName, envId string) error {
	return deleteHPAIfExists(s.kubeClient, blockName, envId)
}

func (s *Store) UpsertHelmChart(release *types.Release) error {
	return upsertHelmChart(s.helmConfig, release)
}

func (s *Store) DeleteHelmChart(name, namespace string) error {
	return deleteHelmChart(s.helmConfig, name)
}

// helm does not have a suspend/scale down option so we will use kube client to scale down the resources
func (s *Store) SuspendHelmChart(name, namespace string) []error {
	var errs []error

	errorsDeployment := suspendHelmDeployments(s.kubeClient, name, namespace)

	if errorsDeployment != nil && len(errorsDeployment) > 0 {
		errs = append(errs, errorsDeployment...)
	}

	errorsSts := suspendHelmStatefulsets(s.kubeClient, name, namespace)

	if errorsSts != nil && len(errorsSts) > 0 {
		errs = append(errs, errorsSts...)
	}

	return errs
}

func (s *Store) DeletePVCs(appLabelValue, namespace string) []error {
	return deletePVCs(s.kubeClient, appLabelValue, namespace)
}
