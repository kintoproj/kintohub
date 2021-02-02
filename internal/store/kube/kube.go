package kube

import (
	"context"
	"flag"
	"fmt"
	"time"

	cert "github.com/jetstack/cert-manager/pkg/client/clientset/versioned"
	"github.com/kintohub/kinto-core/internal/config"
	"github.com/kintohub/kinto-core/internal/store"
	pkgTypes "github.com/kintohub/kinto-core/pkg/types"
	"github.com/kintohub/utils-go/klog"
	utilsGoServer "github.com/kintohub/utils-go/server"
	"k8s.io/client-go/kubernetes"
	_ "k8s.io/client-go/plugin/pkg/client/auth/gcp"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	metrics "k8s.io/metrics/pkg/client/clientset/versioned"
)

type KubeStore struct {
	kubeClient        kubernetes.Interface
	kubeMetricsClient metrics.Interface
	kubeCertClient    cert.Interface
	configMapKey      string
	kubeConfig        *rest.Config
}

func NewKubeStore(configMapKey string) store.StoreInterface {
	kubeConfig := loadKubeConfig(config.KubeConfigPath)

	return &KubeStore{
		kubeConfig:        kubeConfig,
		kubeClient:        kubernetes.NewForConfigOrDie(kubeConfig),
		kubeMetricsClient: metrics.NewForConfigOrDie(kubeConfig),
		kubeCertClient:    cert.NewForConfigOrDie(kubeConfig),
		configMapKey:      configMapKey,
	}
}

func loadKubeConfig(kubeConfigPath string) *rest.Config {
	kubeConfigString := flag.String("kubeconfig", kubeConfigPath, "(optional) absolute path to the kubeconfig file")

	// use the current context in kubeconfig
	kubeConfig, err := clientcmd.BuildConfigFromFlags("", *kubeConfigString)
	if err != nil {
		panic(fmt.Sprintf("Could not find kubeconfig file at %s", kubeConfigPath))
	}

	return kubeConfig
}

func (k *KubeStore) EnablePublicURL(
	envId, blockName string, protocol pkgTypes.RunConfig_Protocol, hosts ...string) *utilsGoServer.Error {

	defer klog.LogDuration(time.Now(), "EnablePublicURL")

	// we don't need to provide the "tlsSecret" since it will use the default one from the ingress
	_, err := upsertIngress(k.kubeClient, envId, blockName, blockName, "", protocol, hosts...)

	if err != nil {
		return utilsGoServer.NewInternalErrorWithErr(
			fmt.Sprintf("error upserting ingress %s.%s", blockName, envId),
			err)
	}

	return nil
}

func (k *KubeStore) DisablePublicURL(envId, blockName string) *utilsGoServer.Error {
	defer klog.LogDuration(time.Now(), "DisablePublicURL")
	err := deleteIngress(k.kubeClient, envId, blockName)

	if err != nil {
		return utilsGoServer.NewInternalErrorWithErr(
			fmt.Sprintf("error deleting ingress %s.%s", blockName, envId),
			err)
	}

	return nil
}

func (k *KubeStore) UpsertCustomDomainNames(
	envId, blockName string,
	protocol pkgTypes.RunConfig_Protocol,
	kintoHost string, domainNames ...string) *utilsGoServer.Error {

	defer klog.LogDuration(time.Now(), "UpsertCustomDomainNames")

	genName := genCustomDomainResourceName(blockName)

	_, err := upsertIssuer(k.kubeCertClient, genName, envId)

	if err != nil {
		return utilsGoServer.NewInternalErrorWithErr(
			fmt.Sprintf("error upserting issuer %s.%s", genName, envId),
			err)
	}

	_, err = upsertCertificate(k.kubeCertClient, genName, envId, domainNames)

	if err != nil {
		return utilsGoServer.NewInternalErrorWithErr(
			fmt.Sprintf("error upserting certificate %s.%s", genName, envId),
			err)
	}

	_, err = upsertIngress(k.kubeClient, envId, genName, blockName, genName, protocol, domainNames...)

	if err != nil {
		return utilsGoServer.NewInternalErrorWithErr(
			fmt.Sprintf("error upserting ingress %s.%s", genName, envId),
			err)
	}

	// we always upsert the `proxless/domains` annotations because it has no effect if sleep mode is disabled
	err = upsertProxlessServiceDomainNameAnnotation(k.kubeClient, blockName, envId, append(domainNames, kintoHost)...)

	if err != nil {
		return utilsGoServer.NewInternalErrorWithErr(
			fmt.Sprintf("error upserting proxless service domain name annotation %s.%s", blockName, envId),
			err)
	}

	return nil
}

// Delete the resources created for custom domain name - Ingress and Certificate
// - Don't delete the issuer since it can be used later
// - Update the proxless annotation on the kubernetes service to only contains the `kintoHost`
// - `kintoHost` must be empty if the kintohub service is deleted
func (k *KubeStore) DeleteCustomDomainNames(envId, blockName, kintoHost string) *utilsGoServer.Error {
	defer klog.LogDuration(time.Now(), "DeleteCustomDomainNames")
	genName := genCustomDomainResourceName(blockName)

	err := deleteIngress(k.kubeClient, envId, genName)

	if err != nil {
		return utilsGoServer.NewInternalErrorWithErr(
			fmt.Sprintf("error deleting ingress %s.%s", genName, envId),
			err)
	}

	err = deleteCertificate(k.kubeCertClient, genName, envId)

	if err != nil {
		return utilsGoServer.NewInternalErrorWithErr(
			fmt.Sprintf("error deleting certificate %s.%s", genName, envId),
			err)
	}

	if kintoHost != "" {
		err = upsertProxlessServiceDomainNameAnnotation(k.kubeClient, blockName, envId, kintoHost)

		if err != nil {
			return utilsGoServer.NewInternalErrorWithErr(
				fmt.Sprintf("error upserting proxless service domain name annotation %s.%s", blockName, envId),
				err)
		}
	}

	return nil
}

func (k *KubeStore) DoesCustomDomainExistInStore(host string) (bool, *utilsGoServer.Error) {
	defer klog.LogDuration(time.Now(), "DoesCustomDomainExistInStore")
	exist, err := doesHostExistInIngresses(k.kubeClient, host)

	if err != nil {
		return false, utilsGoServer.NewInternalErrorWithErr(
			fmt.Sprintf("error checking if host %s exists in ingresses", host),
			err)
	}

	return exist, nil
}

func (k *KubeStore) CheckCertificateReadiness(blockName, envId string) (bool, *utilsGoServer.Error) {
	defer klog.LogDuration(time.Now(), "CheckCertificateReadiness")
	genName := genCustomDomainResourceName(blockName)

	isReady, err := checkCertificateReadiness(k.kubeCertClient, genName, envId)

	if err != nil {
		return false, utilsGoServer.NewInternalErrorWithErr(
			fmt.Sprintf("error checking certificate %s.%s readiness", genName, envId),
			err)
	}

	return isReady, nil
}

func (k *KubeStore) WatchJobsStatus(
	blockName, envId string,
	ctx context.Context,
	sendClientLogs func(jobStatus *pkgTypes.JobStatus) error) *utilsGoServer.Error {
	defer klog.LogDuration(time.Now(), "WatchJobsStatus")
	err := watchJobsStatus(k.kubeClient, blockName, envId, ctx, sendClientLogs)

	if err != nil {
		return utilsGoServer.NewInternalErrorWithErr(
			fmt.Sprintf("error watching jobs status for block %s.%s", blockName, envId),
			err)
	}

	return nil
}

func (k *KubeStore) GetBlockHeathState(
	blockName, envId string, latestSuccessfulRelease *pkgTypes.Release) (pkgTypes.BlockStatus_State, error) {

	defer klog.LogDuration(time.Now(), "GetBlockHeathState")

	return getBlockHealthState(k.kubeClient, blockName, envId, latestSuccessfulRelease)
}
