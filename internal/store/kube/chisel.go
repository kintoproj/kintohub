package kube

import (
	"context"
	"errors"
	"fmt"
	k8strings "k8s.io/utils/strings"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/kintohub/utils-go/klog"
	utilsGoServer "github.com/kintohub/utils-go/server"
	"github.com/kintohub/utils-go/utils"
	"github.com/kintoproj/kinto-core/internal/config"
	"github.com/kintoproj/kinto-core/pkg/consts"
	"github.com/kintoproj/kinto-core/pkg/types"
	"github.com/rs/zerolog/log"
	appsv1 "k8s.io/api/apps/v1"
	autoscalingv1 "k8s.io/api/autoscaling/v1"
	corev1 "k8s.io/api/core/v1"

	k8serrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/intstr"
	"k8s.io/client-go/kubernetes"
	"k8s.io/utils/pointer"
)

const (
	chiselAuthTokenEnvKey = "AUTH"
	chiselAppName         = "kinto-dev-proxy"

	defaultChiselPort         = 8080
	overrideTrafficChiselPort = 3000
)

// Start chisel and configure it for `access` (proxy from local to remote) or `teleport` (proxy from remote to local)
// blockNameToTeleport - if empty, does not `teleport` anything
// the k8s service `blockNameToTeleport` will be modified to target chisel
// TODO handle the teleport differently, this is super confusing
func (k *KubeStore) StartChiselService(
	ctx context.Context, envId, blockNameToTeleport string) (*types.TeleportServiceData, *utilsGoServer.Error) {
	defer klog.LogDuration(time.Now(), "StartChiselService")

	deployment, err := k.kubeClient.AppsV1().Deployments(envId).Get(ctx, chiselAppName, metav1.GetOptions{})

	if k8serrors.IsNotFound(err) {
		newDeployment, uErr := createChiselService(k.kubeClient, ctx, envId) // TODO it should be upsert

		if uErr != nil {
			return nil, uErr
		}

		deployment = newDeployment
	} else if err != nil {
		return nil, utilsGoServer.NewInternalErrorWithErr("error getting chisel deployment", err)
	} else { // chisel is already there but it's down so we just scale it up
		_, err = k.kubeClient.AppsV1().Deployments(envId).UpdateScale(ctx, chiselAppName, &autoscalingv1.Scale{
			ObjectMeta: metav1.ObjectMeta{
				Name:      chiselAppName,
				Namespace: envId,
			},
			Spec: autoscalingv1.ScaleSpec{
				Replicas: 1,
			},
		}, metav1.UpdateOptions{})

		if err != nil {
			return nil, utilsGoServer.NewInternalErrorWithErr("could not start chisel service", err)
		}
	}

	log.Debug().Msgf("successfully started chisel service in env %s", envId)

	if blockNameToTeleport != "" {
		err = forwardServiceToChisel(ctx, k.kubeClient, envId, blockNameToTeleport)

		if err != nil {
			klog.ErrorfWithErr(err, "Error while configuring teleport for %s.%s", blockNameToTeleport, envId)
			return nil, utilsGoServer.NewInternalErrorWithErr("Error while configuring teleport", err)
		}
	}

	credentials := getChiselCredsFromDeployment(deployment)

	if credentials == "" {
		return nil, utilsGoServer.NewInternalErrorWithErr(
			"Couldn't find chisel credentials in deployment", errors.New("chisel deployment yaml is wrong"))
	}

	// Return the auth token to client
	return &types.TeleportServiceData{
		Host:        genChiselHostName(envId),
		Credentials: credentials,
	}, nil
}

// Stop chisel
// blockNameTeleported - if empty, does not do anything
// the k8s service `blockNameTeleported` will be modified to target the user app (it was targetting chisel)
// TODO handle the teleport differently, this is super confusing
func (k *KubeStore) StopChiselService(envId, blockNameTeleported string) *utilsGoServer.Error {
	_, err := k.kubeClient.AppsV1().Deployments(envId).UpdateScale(context.TODO(), chiselAppName, &autoscalingv1.Scale{
		ObjectMeta: metav1.ObjectMeta{
			Name:      chiselAppName,
			Namespace: envId,
		},
		Spec: autoscalingv1.ScaleSpec{
			Replicas: 0,
		},
	}, metav1.UpdateOptions{})

	if err != nil {
		return utilsGoServer.NewInternalErrorWithErr("could not stop chisel service", err)
	}

	log.Debug().Msgf("successfully stopped chisel service in env %s", envId)

	if blockNameTeleported != "" {
		err = revertServiceToOriginal(context.TODO(), k.kubeClient, envId, blockNameTeleported)

		if err != nil {
			klog.ErrorfWithErr(err, "Error while cancelling teleport for %s.%s", blockNameTeleported, envId)
			return utilsGoServer.NewInternalErrorWithErr("Error while cancelling teleport", err)
		}
	}

	return nil
}

func getChiselCredsFromDeployment(deployment *appsv1.Deployment) string {
	containers := deployment.Spec.Template.Spec.Containers
	if len(containers) > 0 {
		for _, env := range containers[0].Env {
			if env.Name == chiselAuthTokenEnvKey {
				return env.Value
			}
		}
	}
	return ""
}

func genChiselHostName(envId string) string {
	return fmt.Sprintf("%s-%s.%s",
		chiselAppName,
		strings.ToLower(envId),
		config.KintoDomain,
	)
}

func createChiselService(kubeClient kubernetes.Interface, ctx context.Context, envId string) (*appsv1.Deployment, *utilsGoServer.Error) {
	clientId := uuid.New()
	clientSecret := utils.RandString(32)

	// Create Deployment
	deployment, err := kubeClient.AppsV1().Deployments(envId).Create(ctx, &appsv1.Deployment{
		ObjectMeta: metav1.ObjectMeta{
			Name: chiselAppName,
			Labels: map[string]string{
				consts.AppLabelKey:   chiselAppName,
				consts.OwnerLabelKey: consts.OwnerLabelValue,
				consts.EnvLabelKey:   envId,
			},
		},
		Spec: appsv1.DeploymentSpec{
			Replicas: pointer.Int32Ptr(1),
			Selector: &metav1.LabelSelector{
				MatchLabels: map[string]string{
					consts.AppLabelKey:   chiselAppName,
					consts.OwnerLabelKey: consts.OwnerLabelValue,
					consts.EnvLabelKey:   envId,
				},
			},
			Template: corev1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Name: chiselAppName,
					Labels: map[string]string{
						consts.AppLabelKey:   chiselAppName,
						consts.OwnerLabelKey: consts.OwnerLabelValue,
						consts.EnvLabelKey:   envId,
					},
				},
				Spec: corev1.PodSpec{
					Containers: []corev1.Container{
						{
							Name: chiselAppName,
							//TODO: move to env var one day.
							Image: "jpillora/chisel:1.6.0",
							Command: []string{
								"/app/chisel",
								"server",
								"--reverse",
								"-v", // keep verbose, it's easier to debug
							},
							Ports: []corev1.ContainerPort{
								{
									Name:          "http-8080",
									Protocol:      corev1.ProtocolTCP,
									ContainerPort: defaultChiselPort,
								},
								{
									Name:          "http-3000",
									Protocol:      corev1.ProtocolTCP,
									ContainerPort: overrideTrafficChiselPort,
								},
							},
							Env: []corev1.EnvVar{
								{
									// this sets the auth user/password combo for chisel
									// read more about the --auth param and AUTH env var
									// https://github.com/jpillora/chisel#authentication
									Name: chiselAuthTokenEnvKey,
									// TODO: Consider moving to secret one day.
									Value: fmt.Sprintf("%s:%s",
										clientId,
										clientSecret,
									),
								},
							},
						},
					},
				},
			},
		},
	}, metav1.CreateOptions{})

	if err != nil {
		return nil, utilsGoServer.NewInternalErrorWithErr("error creating chisel deployment", err)
	}

	// Create Service
	const defaultServicePort = 80
	_, err = kubeClient.CoreV1().Services(envId).Create(ctx, &corev1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name: chiselAppName,
		},
		Spec: corev1.ServiceSpec{
			Selector: map[string]string{
				consts.AppLabelKey:   chiselAppName,
				consts.OwnerLabelKey: consts.OwnerLabelValue,
			},
			Ports: []corev1.ServicePort{
				{
					Name:       "http-80",
					Protocol:   corev1.ProtocolTCP,
					Port:       defaultServicePort,
					TargetPort: intstr.FromInt(defaultChiselPort),
				},
				{
					Name:       "http-3000",
					Protocol:   corev1.ProtocolTCP,
					Port:       overrideTrafficChiselPort,
					TargetPort: intstr.FromInt(overrideTrafficChiselPort),
				},
			},
		},
	}, metav1.CreateOptions{})

	if err != nil {
		return nil, utilsGoServer.NewInternalErrorWithErr("error creating chisel service", err)
	}

	// we don't need to provide the "tlsSecret" since it will use the default one from the ingress
	_, err = upsertIngress(
		kubeClient,
		envId,
		chiselAppName,
		chiselAppName,
		"",
		config.SSLEnabled,
		defaultServicePort,
		genChiselHostName(envId),
	)

	if err != nil {
		return nil, utilsGoServer.NewInternalErrorWithErr("error occurred creating chisel ingress", err)
	}

	return deployment, nil
}

func forwardServiceToChisel(ctx context.Context, kubeClient kubernetes.Interface, envId, blockName string) error {
	release, err := getLatestSuccessfulReleaseFromConfigMap(kubeClient, envId, blockName)

	if err != nil {
		return err
	} else if release == nil {
		return fmt.Errorf("couldn't find a successful release for block %s.%s", blockName, envId)
	}

	service, err := kubeClient.CoreV1().Services(envId).Get(ctx, blockName, metav1.GetOptions{})

	if err != nil {
		return err
	}

	convertBlockServiceToChiselService(service)

	_, err = kubeClient.CoreV1().Services(envId).Update(ctx, service, metav1.UpdateOptions{})

	return err
}

func convertBlockServiceToChiselService(service *corev1.Service) {
	service.Spec.ExternalName = ""
	service.Annotations = nil
	service.Spec.Type = "ClusterIP"
	service.Spec.Selector = map[string]string{}
	service.Spec.Selector[consts.AppLabelKey] = chiselAppName
	service.Spec.Ports = []corev1.ServicePort{
		{
			Name:       fmt.Sprintf("http-%d", overrideTrafficChiselPort),
			Port:       int32(overrideTrafficChiselPort),
			TargetPort: intstr.FromInt(overrideTrafficChiselPort),
		},
		{
			Name:       "http-80",
			Port:       80,
			TargetPort: intstr.FromInt(overrideTrafficChiselPort),
		},
	}
}

func revertServiceToOriginal(ctx context.Context, kubeClient kubernetes.Interface, envId, blockName string) error {
	release, err := getLatestSuccessfulReleaseFromConfigMap(kubeClient, envId, blockName)

	if err != nil {
		return err
	} else if release == nil { // this should never happen
		return fmt.Errorf("couldn't find a successful release for block %s.%s", blockName, envId)
	}

	service, err := kubeClient.CoreV1().Services(envId).Get(ctx, blockName, metav1.GetOptions{})

	if err != nil {
		return err
	}

	err = revertChiselServiceToBlockService(service, blockName, release)

	if err != nil {
		return fmt.Errorf("error reverting chisel service for k8s service %s.%s - %v", blockName, envId, err)
	}

	_, err = kubeClient.CoreV1().Services(envId).Update(ctx, service, metav1.UpdateOptions{})

	return err
}

func revertChiselServiceToBlockService(service *corev1.Service, blockName string, release *types.Release) error {
	if release.RunConfig.SleepModeEnabled {
		// must be the same as
		// https://github.com/kintohub/kinto-build/blob/master/images/kinto-deploy/internal/store/kube/proxless.go
		service.Spec.ClusterIP = ""
		service.Spec.Ports = nil
		service.Spec.Selector = nil
		service.Spec.Type = "ExternalName"
		service.Spec.ExternalName = config.ProxlessFQDN

		service.Annotations = map[string]string{
			"proxless/domains":                   release.RunConfig.Host,
			"proxless/deployment":                genDeploymentName(blockName, release.Id),
			"proxless/ttl-seconds":               strconv.Itoa(int(release.RunConfig.SleepModeTTLSeconds)),
			"proxless/readiness-timeout-seconds": strconv.Itoa(int(release.RunConfig.TimeoutInSec)),
			"proxless/service":                   genProxlessServiceName(blockName),
		}
	} else {
		// must be the same as
		// https://github.com/kintohub/kinto-build/blob/master/images/kinto-deploy/internal/store/kube/service.go
		service.Spec.Selector[consts.AppLabelKey] = service.Name
		service.Spec.Selector[consts.ReleaseLabelKey] = release.Id

		port, err := strconv.Atoi(release.RunConfig.Port)
		if err != nil {
			return err
		}
		service.Spec.Ports = []corev1.ServicePort{
			{
				Name:       "http-80",
				Port:       80,
				TargetPort: intstr.FromInt(port),
			},
		}
		if port != 80 {
			service.Spec.Ports = append(
				service.Spec.Ports,
				corev1.ServicePort{
					Name:       fmt.Sprintf("http-%d", port),
					Port:       int32(port),
					TargetPort: intstr.FromInt(port),
				},
			)
		}
	}

	return nil
}

func genDeploymentName(blockName, releaseId string) string {
	return fmt.Sprintf("%s-%s", k8strings.ShortenString(blockName, 20), releaseId)
}

func genProxlessServiceName(serviceName string) string {
	return fmt.Sprintf("%s-proxless", serviceName)
}

func getLatestSuccessfulReleaseFromConfigMap(
	kubeClient kubernetes.Interface, envId, blockName string) (*types.Release, error) {

	cmName := types.GenBlockConfigMapName(blockName)

	cm, err := kubeClient.CoreV1().ConfigMaps(envId).Get(context.TODO(), cmName, metav1.GetOptions{})

	if err != nil {
		return nil, err
	}

	block, err := types.ConfigMapToBlock(cm)

	if err != nil {
		return nil, err
	}

	return types.GetLatestSuccessfulRelease(block.Releases), nil
}
