package argo

import (
	"fmt"
	"github.com/argoproj/argo/pkg/apis/workflow/v1alpha1"
	"github.com/argoproj/argo/pkg/client/clientset/versioned"
	"github.com/argoproj/argo/workflow/util"
	"github.com/kintohub/utils-go/klog"
	utilsGoServer "github.com/kintohub/utils-go/server"
	"github.com/kintoproj/kinto-build/internal/build"
	"github.com/kintoproj/kinto-build/internal/config"
	"github.com/kintoproj/kinto-core/pkg/types"
	"github.com/minio/minio-go/v6"
	"golang.org/x/net/context"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	_ "k8s.io/client-go/plugin/pkg/client/auth/gcp"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/utils/pointer"
)

type BuildClient struct {
	argoClient  versioned.Interface
	kubeClient  kubernetes.Interface
	minioClient *minio.Client
}

func NewBuildClient(
	argoClient versioned.Interface,
	kubeClient kubernetes.Interface,
	minioClient *minio.Client) build.BuildClientInterface {
	return &BuildClient{
		argoClient:  argoClient,
		kubeClient:  kubeClient,
		minioClient: minioClient,
	}
}

func NewArgoClientOrDie(kubeConfigPath string) versioned.Interface {
	return versioned.NewForConfigOrDie(getKubeConfigOrDie(kubeConfigPath))
}

func getKubeConfigOrDie(kubeConfigPath string) *rest.Config {
	kubeConf, err := clientcmd.BuildConfigFromFlags("", kubeConfigPath)
	if err != nil {
		klog.PanicfWithError(err, "Could not find kubeconfig file at %s", kubeConfigPath)
	}
	return kubeConf
}

func NewKubeClientOrDie(kubeConfigPath string) kubernetes.Interface {
	return kubernetes.NewForConfigOrDie(getKubeConfigOrDie(kubeConfigPath))
}

func NewMinioClientOrDie() *minio.Client {
	minioClient, err := minio.New(
		config.ArgoWorkflowMinioHost,
		config.ArgoWorkflowMinioAccessKey,
		config.ArgoWorkflowMinioSecretKey,
		false)
	if err != nil {
		klog.PanicfWithError(err, "could not connect to minio host %s with error", config.ArgoWorkflowMinioHost)
	}

	return minioClient
}

func submitWorkflow(
	argoClient versioned.Interface,
	name string,
	labels map[string]string,
	exitHandlerNeeded bool,
	templates []v1alpha1.Template) (string, *utilsGoServer.Error) {

	volumeSize := resource.MustParse(config.ArgoWorkflowVolumeSize)

	workflowObject := &v1alpha1.Workflow{
		ObjectMeta: v1.ObjectMeta{
			GenerateName: name,
			Labels:       labels,
		},
		Spec: v1alpha1.WorkflowSpec{
			Templates:  templates,
			Entrypoint: workflowEntrypoint,
			ImagePullSecrets: []corev1.LocalObjectReference{
				{
					Name: "image-pull-secret",
				},
			},
			// secret kaniko will use for authenticating to the registry
			// https://github.com/GoogleContainerTools/kaniko/blob/master/examples/pod.yaml
			Volumes: []corev1.Volume{
				{
					Name: config.ArgoWorkflowDockerSecret,
					VolumeSource: corev1.VolumeSource{
						Secret: &corev1.SecretVolumeSource{
							SecretName: config.ArgoWorkflowDockerSecret,
							Items: []corev1.KeyToPath{
								{
									Key:  ".dockerconfigjson",
									Path: "config.json",
								},
							},
						},
					},
				},
				{
					Name: workflowVolumeName,
					VolumeSource: corev1.VolumeSource{
						EmptyDir: &corev1.EmptyDirVolumeSource{
							SizeLimit: &volumeSize,
						},
					},
				},
			},
			ServiceAccountName: config.ArgoWorkflowServiceAccount,
			NodeSelector:       nil,
			Tolerations:        nil,
			TTLStrategy: &v1alpha1.TTLStrategy{
				SecondsAfterCompletion: pointer.Int32Ptr(int32(config.ArgoWorkflowTTL)),
			},
			ActiveDeadlineSeconds: pointer.Int64Ptr(int64(config.WorkflowTimeout)),
		},
	}

	if exitHandlerNeeded {
		workflowObject.Spec.OnExit = workflowOnExit
	}

	workflow, err := argoClient.ArgoprojV1alpha1().Workflows(config.ArgoWorkflowNamespace).Create(workflowObject)

	if err != nil {
		return "", utilsGoServer.NewInternalErrorWithErr("error submitting build to argo controller", err)
	}

	klog.Debugf("Workflow %s submitted to argo controller", workflow.Name)

	return workflow.Name, nil
}

func (c *BuildClient) BuildAndDeployRelease(req *types.BuildAndDeployRequest) (*types.WorkflowResponse, *utilsGoServer.Error) {
	// TODO find a more elegant way to do that
	if req.BuildConfig.Language != types.BuildConfig_DOCKERFILE {
		req.BuildConfig.DockerfileFileName = "Dockerfile"
	}

	templates := []v1alpha1.Template{
		genStepsTemplate(true),
		genBuildAndDeployWorkflow(
			req.Namespace, req.BlockName, req.ReleaseId, config.KintoCoreHostname, req.BuildConfig, config.KintoCoreOverTls, req.IsStaticBuild),
		genOnExitHandlerStepsTemplate(),
		genWorkflowUpdateStatusTemplate(
			req.Namespace, req.BlockName, req.ReleaseId, config.KintoCoreHostname, config.KintoCoreOverTls),
	}

	if config.ArgoWorkflowNodePoolLabelValue != "" {
		enrichTemplatesWithNodePoolInfo(templates, config.ArgoWorkflowNodePoolLabelValue)
	}

	buildId, err := submitWorkflow(
		c.argoClient,
		req.BlockName,
		genLabels(req.BlockName, req.ReleaseId, req.Namespace),
		true,
		templates)

	if err != nil {
		klog.ErrorfWithErr(err.Error, "Error submitting workflow for %v.%v", req.BlockName, req.Namespace)
		return nil, err
	}

	return &types.WorkflowResponse{
		Id: buildId,
	}, nil
}

func (c *BuildClient) DeployRelease(req *types.DeployRequest) (*types.WorkflowResponse, *utilsGoServer.Error) {
	templates := []v1alpha1.Template{
		genStepsTemplate(true),
		genDeployOnlyWorkflow(req.Namespace, req.BlockName, req.ReleaseId, types.Release_DEPLOY),
		genOnExitHandlerStepsTemplate(),
		genWorkflowUpdateStatusTemplate(
			req.Namespace, req.BlockName, req.ReleaseId, config.KintoCoreHostname, config.KintoCoreOverTls),
	}

	if config.ArgoWorkflowNodePoolLabelValue != "" {
		enrichTemplatesWithNodePoolInfo(templates, config.ArgoWorkflowNodePoolLabelValue)
	}

	buildId, err := submitWorkflow(
		c.argoClient,
		req.BlockName,
		genLabels(req.BlockName, req.ReleaseId, req.Namespace),
		true,
		templates)

	if err != nil {
		klog.ErrorfWithErr(err.Error, "Error submitting workflow for %v.%v", req.BlockName, req.Namespace)
		return nil, err
	}

	return &types.WorkflowResponse{
		Id: buildId,
	}, nil
}

func (c *BuildClient) DeployReleaseFromCatalog(req *types.DeployCatalogRequest) (*types.WorkflowResponse, *utilsGoServer.Error) {
	templates := []v1alpha1.Template{
		genStepsTemplate(true),
		genDeployCatalogWorkflow(
			req.Namespace, req.BlockName, req.ReleaseId, config.KintoCoreHostname, req.Repo, config.KintoCoreOverTls),
		genOnExitHandlerStepsTemplate(),
		genWorkflowUpdateStatusTemplate(
			req.Namespace, req.BlockName, req.ReleaseId, config.KintoCoreHostname, config.KintoCoreOverTls),
	}

	if config.ArgoWorkflowNodePoolLabelValue != "" {
		enrichTemplatesWithNodePoolInfo(templates, config.ArgoWorkflowNodePoolLabelValue)
	}

	buildId, err := submitWorkflow(
		c.argoClient,
		req.BlockName,
		genLabels(req.BlockName, req.ReleaseId, req.Namespace),
		true,
		templates)

	if err != nil {
		klog.ErrorfWithErr(err.Error, "Error submitting workflow for %v.%v", req.BlockName, req.Namespace)
		return nil, err
	}

	return &types.WorkflowResponse{
		Id: buildId,
	}, nil
}

func (c *BuildClient) UndeployRelease(req *types.UndeployRequest) (*types.WorkflowResponse, *utilsGoServer.Error) {
	templates := []v1alpha1.Template{
		genStepsTemplate(false),
		genDeployOnlyWorkflow(req.Namespace, req.BlockName, "", types.Release_UNDEPLOY),
		// we are forced to generated the update status template even if `false`. otherwise argo fails
		genWorkflowUpdateStatusTemplate(
			req.Namespace, req.BlockName, "", config.KintoCoreHostname, config.KintoCoreOverTls),
	}

	if config.ArgoWorkflowNodePoolLabelValue != "" {
		enrichTemplatesWithNodePoolInfo(templates, config.ArgoWorkflowNodePoolLabelValue)
	}

	buildId, err := submitWorkflow(
		c.argoClient,
		req.BlockName,
		genLabels(req.BlockName, "", req.Namespace),
		false, // the configmap has been removed so no need to update anything
		templates)

	if err != nil {
		klog.ErrorfWithErr(err.Error, "Error submitting workflow for %v.%v", req.BlockName, req.Namespace)
		return nil, err
	}

	return &types.WorkflowResponse{
		Id: buildId,
	}, nil
}

func (c *BuildClient) SuspendRelease(req *types.SuspendRequest) (*types.WorkflowResponse, *utilsGoServer.Error) {
	templates := []v1alpha1.Template{
		genStepsTemplate(true),
		genDeployOnlyWorkflow(req.Namespace, req.BlockName, req.ReleaseId, types.Release_SUSPEND),
		genOnExitHandlerStepsTemplate(),
		genWorkflowUpdateStatusTemplate(
			req.Namespace, req.BlockName, req.ReleaseId, config.KintoCoreHostname, config.KintoCoreOverTls),
	}

	if config.ArgoWorkflowNodePoolLabelValue != "" {
		enrichTemplatesWithNodePoolInfo(templates, config.ArgoWorkflowNodePoolLabelValue)
	}

	buildId, err := submitWorkflow(
		c.argoClient,
		req.BlockName,
		genLabels(req.BlockName, req.ReleaseId, req.Namespace),
		true,
		templates)

	if err != nil {
		klog.ErrorfWithErr(err.Error, "Error submitting workflow for %v.%v", req.BlockName, req.Namespace)
		return nil, err
	}

	return &types.WorkflowResponse{
		Id: buildId,
	}, nil
}

func enrichTemplatesWithNodePoolInfo(templates []v1alpha1.Template, selectorValue string) {
	for i := range templates {
		templates[i].NodeSelector = map[string]string{
			"type": selectorValue,
		}
		templates[i].Tolerations = []corev1.Toleration{
			{
				Key:      "type",
				Operator: corev1.TolerationOpEqual,
				Value:    selectorValue,
				Effect:   corev1.TaintEffectNoSchedule,
			},
		}
	}
}

func (c *BuildClient) AbortRelease(ctx context.Context, buildId string) *utilsGoServer.Error {
	// https://github.com/argoproj/argo/blob/release-2.8/workflow/util/util.go#L808-L835
	err := util.StopWorkflow(
		c.argoClient.ArgoprojV1alpha1().Workflows(config.ArgoWorkflowNamespace), nil, buildId, "", "")

	if err != nil {
		klog.ErrorfWithErr(err, "Error stopping workflow %s.%s", buildId, config.ArgoWorkflowNamespace)
		return utilsGoServer.NewInternalErrorWithErr(
			fmt.Sprintf("Error stopping workflow %s.%s", buildId, config.ArgoWorkflowNamespace), err)
	}

	return nil
}
