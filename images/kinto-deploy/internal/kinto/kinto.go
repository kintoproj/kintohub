package kinto

import (
	"errors"
	"fmt"
	kintoCoretypes "github.com/kintohub/kinto-kube-core/pkg/types"
	"github.com/rs/zerolog/log"
	"kinto.io/kinto-kube-deploy/internal/config"
	"kinto.io/kinto-kube-deploy/internal/store"
	"kinto.io/kinto-kube-deploy/internal/types"
)

type Controller struct {
	store store.Interface
}

type ControllerInterface interface {
	Run()
}

func NewKintoController(store store.Interface) *Controller {
	return &Controller{
		store: store,
	}
}

func (c *Controller) Run() {
	var err error
	if config.ReleaseType == kintoCoretypes.Release_UNDEPLOY {
		err = undeployBlock(c.store)
	} else if config.ReleaseType == kintoCoretypes.Release_DEPLOY || config.ReleaseType == kintoCoretypes.Release_ROLLBACK {
		err = deployBlock(c.store)
	} else if config.ReleaseType == kintoCoretypes.Release_SUSPEND {
		err = suspendBlock(c.store)
	}

	if err != nil {
		fmt.Println()
		log.Fatal().Msgf("%v", err)
	}
}

func deployBlock(store store.Interface) error {
	block, err := store.GetConfigMap(config.BlockName, config.Namespace)

	if err != nil {
		log.Panic().Err(err).Msgf("Error retrieving block %s", config.BlockName)
	}

	release, err := getRelease(config.ReleaseId, block)

	if err != nil {
		log.Panic().Err(err).Msgf("Error retrieving release %s from block %v", config.ReleaseId, block)
	}

	deployRelease, err := types.ConvertKintoCoreReleaseToKDRelease(block.Name, block.Id, config.Namespace, block.CustomDomains, release)

	if err != nil {
		log.Panic().Err(err).Msgf("Error converting Kinto Core release %v into Kinto Deploy release", release)
	}

	log.Debug().Msgf("Deploying release %v", deployRelease)

	switch release.RunConfig.Type {
	case kintoCoretypes.Block_JOB:
		err = store.UpsertJob(deployRelease)
	case kintoCoretypes.Block_CRON_JOB:
		err = store.UpsertCronJob(deployRelease)
	case kintoCoretypes.Block_WORKER:
		err = deployDeployment(store, deployRelease)

		if err == nil {
			cleanPreviousDeployments(store, deployRelease)
		}
	case kintoCoretypes.Block_BACKEND_API, kintoCoretypes.Block_WEB_APP, kintoCoretypes.Block_JAMSTACK:
		err = deployWebserver(store, deployRelease)

		if err == nil {
			cleanPreviousDeployments(store, deployRelease)
		}
	case kintoCoretypes.Block_CATALOG:
		err = store.UpsertHelmChart(deployRelease)
	default:
		log.Panic().Msgf("block type %s not supported", release.RunConfig.Type.String())
	}

	return err
}

// delete everything that could be related to the kintohub block
func undeployBlock(store store.Interface) error {
	log.Debug().Msgf("Undeploying service %s", config.BlockName)

	errorHappened := false

	jobErr := store.DeleteJob(config.BlockName, config.Namespace)

	if jobErr != nil {
		errorHappened = true
		log.Error().Err(jobErr).Msg("Error during job deletion")
	}

	cronJobErr := store.DeleteCronJob(config.BlockName, config.Namespace)

	if cronJobErr != nil {
		errorHappened = true
		log.Error().Err(cronJobErr).Msg("Error during cronjob deletion")
	}

	deployErrs := store.DeleteDeployments(config.Namespace, map[string]string{"app": config.BlockName})

	if deployErrs != nil && len(deployErrs) > 0 {
		errorHappened = true
		for _, err := range deployErrs {
			log.Error().Err(err).Msg("Error during deployments deletion")
		}
	}

	hpaErr := store.DeleteHPA(config.BlockName, config.Namespace)

	if hpaErr != nil {
		errorHappened = true
		log.Error().Err(hpaErr).Msg("Error during hpa deletion")
	}

	svcErrs := store.DeleteService(config.BlockName, config.Namespace)

	if svcErrs != nil && len(svcErrs) > 0 {
		errorHappened = true
		for _, err := range svcErrs {
			log.Error().Err(err).Msg("Error during service deletion")
		}
	}

	helmErr := store.DeleteHelmChart(config.BlockName, config.Namespace)

	if helmErr != nil {
		errorHappened = true
		log.Error().Err(helmErr).Msg("Error during helm chart deletion")
	}

	pvcErrs := store.DeletePVCs(config.BlockName, config.Namespace)

	if pvcErrs != nil && len(pvcErrs) > 0 {
		errorHappened = true
		for _, err := range pvcErrs {
			log.Error().Err(err).Msg("Error during pvcs deletion")
		}
	}

	if errorHappened {
		return errors.New("at least one error happened during undeployment - check the logs")
	}

	return nil
}

// suspend everything that could be related to the kintohub block
func suspendBlock(store store.Interface) error {
	log.Debug().Msgf("Suspend service %s", config.BlockName)

	block, err := store.GetConfigMap(config.BlockName, config.Namespace)

	if err != nil {
		log.Panic().Err(err).Msgf("Error retrieving block %s", config.BlockName)
	}

	latestSuccessfulRelease := kintoCoretypes.GetLatestSuccessfulRelease(block.Releases)

	if latestSuccessfulRelease == nil {
		return errors.New("the block does not have a successful release - nothing to suspend")
	}

	if latestSuccessfulRelease.RunConfig.Type == kintoCoretypes.Block_CRON_JOB {
		cronJobErrors := store.SuspendCronJob(config.BlockName, config.Namespace)

		if cronJobErrors != nil && len(cronJobErrors) > 0 {
			log.Error().Errs("cronjobsSuspension", cronJobErrors).Msg("Error during cronjobs suspension")
			return errors.New("error happened during the cronjob suspension")
		}
	} else if latestSuccessfulRelease.RunConfig.Type == kintoCoretypes.Block_HELM {
		helmChartErrors := store.SuspendHelmChart(config.BlockName, config.Namespace)

		if helmChartErrors != nil && len(helmChartErrors) > 0 {
			log.Error().Errs("helmSuspension", helmChartErrors).Msg("Error during helm suspension")
			return errors.New("error happened during the catalog service suspension")
		}
	} else {
		deploymentErrors := store.SuspendDeployment(config.BlockName, config.Namespace)

		if deploymentErrors != nil && len(deploymentErrors) > 0 {
			log.Error().Errs("deploymentsSuspension", deploymentErrors).Msg("Error during deployments suspension")
			return errors.New("error happened during the service suspension")
		}

		// we must delete the services so that proxless does not wake up the deployment if it is called
		// Note that `resume` do a full deployment anyway so we could also delete the deployment if we wanted
		// TODO see if can do differently later but this is the only quick approach I thought about.
		svcErrors := store.DeleteService(config.BlockName, config.Namespace)

		if svcErrors != nil && len(svcErrors) > 0 {
			log.Error().Errs("servicessSuspension", svcErrors).Msg("Error during services suspension")
			return errors.New("error happened during the service suspension")
		}
	}

	return nil
}

func getRelease(releaseId string, block *kintoCoretypes.Block) (*kintoCoretypes.Release, error) {
	releases := block.Releases

	if len(releases) == 0 {
		return nil, errors.New(fmt.Sprintf("Block %s has no release", block.Name))
	}

	release, ok := releases[releaseId]

	if !ok {
		return nil, errors.New(fmt.Sprintf("Release %s.%s not found", releaseId, block.Name))
	}

	if release.Status.State == kintoCoretypes.Status_SUCCESS || release.Status.State == kintoCoretypes.Status_FAIL {
		return nil, errors.New(fmt.Sprintf("Release %s.%s already deployed", releaseId, block.Name))
	}

	return release, nil
}

func processReleaseHPA(store store.Interface, release *types.Release) error {
	if release.HPA == nil {
		return store.DeleteHPA(release.BlockName, release.EnvId)
	} else {
		return store.UpsertHPA(release)
	}
}

func deployDeployment(store store.Interface, release *types.Release) error {
	err := store.CreateDeployment(release)

	if err != nil {
		return err
	}

	err = store.WatchDeploymentStatus(release)

	if err != nil {
		rollbackErr := store.RollbackDeployment(release)

		if rollbackErr != nil {
			log.Error().Err(err).Msg(
				"Could not rollback the release - not critical but the deployment will stay in kubernetes")
		}

		return err
	}

	err = processReleaseHPA(store, release)

	if err != nil {
		return err
	}

	return nil
}

func deployWebserver(store store.Interface, release *types.Release) error {
	err := deployDeployment(store, release)

	if err != nil {
		return err
	}

	err = store.UpsertService(release)

	if err != nil {
		return err
	}

	return nil
}

func cleanPreviousDeployments(store store.Interface, release *types.Release) {
	errs := store.CleanPreviousDeployment(release)

	if errs != nil && len(errs) > 0 {
		log.Error().Errs("clean-previous-releases", errs).Msg(
			"Could not clean previous release - not critical but the deployment will stay in kubernetes")
	}
}
