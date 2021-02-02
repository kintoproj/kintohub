package kube

import (
	"context"
	"fmt"
	certacmev1alpha2 "github.com/jetstack/cert-manager/pkg/apis/acme/v1alpha2"
	certv1alpha2 "github.com/jetstack/cert-manager/pkg/apis/certmanager/v1alpha2"
	certmetav1 "github.com/jetstack/cert-manager/pkg/apis/meta/v1"
	fakecert "github.com/jetstack/cert-manager/pkg/client/clientset/versioned/fake"
	"github.com/kintohub/kinto-core/internal/config"
	"github.com/kintohub/kinto-core/pkg/consts"
	"github.com/kintohub/kinto-core/pkg/types"
	"github.com/stretchr/testify/assert"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/api/extensions/v1beta1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/intstr"
	fakekube "k8s.io/client-go/kubernetes/fake"
	"k8s.io/utils/pointer"
	"testing"
)

const (
	dummyNamespace    = "dummyNamespace"
	dummyBlockName    = "dummyBlock"
	dummyKintoHost    = "kinto.io"
	dummyCustomDomain = "dummyCustomDomain.io"
)

func TestKubeStore_EnableAndDisablePublicURL(t *testing.T) {
	kubeStore := KubeStore{
		kubeClient: fakekube.NewSimpleClientset(),
	}

	want := &v1beta1.Ingress{
		ObjectMeta: metav1.ObjectMeta{
			Namespace: dummyNamespace,
			Name:      dummyBlockName,
			Annotations: map[string]string{
				"kubernetes.io/ingress.class": "nginx",
			},
			Labels: map[string]string{
				consts.OwnerLabelKey: consts.OwnerLabelValue,
			},
		},
		Spec: v1beta1.IngressSpec{
			TLS: []v1beta1.IngressTLS{
				{
					Hosts: []string{dummyKintoHost},
				},
			},
			Rules: []v1beta1.IngressRule{
				{
					Host: dummyKintoHost,
					IngressRuleValue: v1beta1.IngressRuleValue{
						HTTP: &v1beta1.HTTPIngressRuleValue{
							Paths: []v1beta1.HTTPIngressPath{
								{
									Path: "/",
									Backend: v1beta1.IngressBackend{
										ServiceName: dummyBlockName,
										ServicePort: intstr.IntOrString{
											IntVal: 80,
										},
									},
								},
							},
						},
					},
				},
			},
		},
	}

	uErr := kubeStore.EnablePublicURL(dummyNamespace, dummyBlockName, types.RunConfig_HTTP, dummyKintoHost)
	if uErr != nil {
		t.Errorf("kubeStore.EnablePublicURL = %v - must be nil", uErr)
	}

	got, err := kubeStore.kubeClient.ExtensionsV1beta1().Ingresses(dummyNamespace).Get(
		context.TODO(), dummyBlockName, metav1.GetOptions{})
	assert.NoError(t, err)
	assert.Equal(t, want, got)

	uErr = kubeStore.DisablePublicURL(dummyNamespace, dummyBlockName)
	if uErr != nil {
		t.Errorf("kubeStore.DisablePublicURL = %v - must be nil", uErr)
	}

	_, err = kubeStore.kubeClient.ExtensionsV1beta1().Ingresses(dummyNamespace).Get(
		context.TODO(), dummyBlockName, metav1.GetOptions{})
	assert.Error(t, err)
}

func TestKubeStore_UpsertAndDeleteCustomDomainNames(t *testing.T) {
	kubeStore := KubeStore{
		kubeClient:     fakekube.NewSimpleClientset(),
		kubeCertClient: fakecert.NewSimpleClientset(),
	}

	genName := fmt.Sprintf("custom-domain-%s", dummyBlockName)

	config.CertManagerIssuerEmail = "devaccounts@kintohub.com"

	ingressWant := &v1beta1.Ingress{
		ObjectMeta: metav1.ObjectMeta{
			Namespace: dummyNamespace,
			Name:      genName,
			Annotations: map[string]string{
				"kubernetes.io/ingress.class": "nginx",
			},
			Labels: map[string]string{
				consts.OwnerLabelKey: consts.OwnerLabelValue,
			},
		},
		Spec: v1beta1.IngressSpec{
			TLS: []v1beta1.IngressTLS{
				{
					Hosts:      []string{dummyCustomDomain},
					SecretName: genName,
				},
			},
			Rules: []v1beta1.IngressRule{
				{
					Host: dummyCustomDomain,
					IngressRuleValue: v1beta1.IngressRuleValue{
						HTTP: &v1beta1.HTTPIngressRuleValue{
							Paths: []v1beta1.HTTPIngressPath{
								{
									Path: "/",
									Backend: v1beta1.IngressBackend{
										ServiceName: dummyBlockName,
										ServicePort: intstr.IntOrString{
											IntVal: 80,
										},
									},
								},
							},
						},
					},
				},
			},
		},
	}

	issuerWant := &certv1alpha2.Issuer{
		ObjectMeta: metav1.ObjectMeta{
			Namespace: dummyNamespace,
			Name:      genName,
			Labels: map[string]string{
				consts.OwnerLabelKey: consts.OwnerLabelValue,
			},
		},
		Spec: certv1alpha2.IssuerSpec{
			IssuerConfig: certv1alpha2.IssuerConfig{
				ACME: &certacmev1alpha2.ACMEIssuer{
					Email:  fmt.Sprintf("devaccounts+%s@kintohub.com", dummyNamespace),
					Server: config.CertManagerIssuerServer,
					PrivateKey: certmetav1.SecretKeySelector{
						LocalObjectReference: certmetav1.LocalObjectReference{
							Name: fmt.Sprintf("issuer-key-%s", genName),
						},
					},
					Solvers: []certacmev1alpha2.ACMEChallengeSolver{
						{
							HTTP01: &certacmev1alpha2.ACMEChallengeSolverHTTP01{
								Ingress: &certacmev1alpha2.ACMEChallengeSolverHTTP01Ingress{
									Class: pointer.StringPtr("nginx"),
								},
							},
						},
					},
				},
			},
		},
	}

	certificateWant := &certv1alpha2.Certificate{
		ObjectMeta: metav1.ObjectMeta{
			Namespace: dummyNamespace,
			Name:      genName,
			Labels: map[string]string{
				consts.OwnerLabelKey: consts.OwnerLabelValue,
			},
		},
		Spec: certv1alpha2.CertificateSpec{
			DNSNames:   []string{dummyCustomDomain},
			SecretName: genName,
			IssuerRef: certmetav1.ObjectReference{
				Name: genName,
				Kind: "Issuer",
			},
		},
	}

	dummyService := &corev1.Service{
		ObjectMeta: metav1.ObjectMeta{Name: dummyBlockName},
	}
	_, err :=
		kubeStore.kubeClient.CoreV1().Services(dummyNamespace).Create(
			context.TODO(), dummyService, metav1.CreateOptions{})
	assert.NoError(t, err)

	// enable first the public URL for the service
	uErr := kubeStore.EnablePublicURL(dummyNamespace, dummyBlockName, types.RunConfig_HTTP, dummyKintoHost)
	if uErr != nil {
		t.Errorf("store.EnablePublicURL = %v - must be nil", uErr)
	}

	uErr = kubeStore.UpsertCustomDomainNames(
		dummyNamespace, dummyBlockName, types.RunConfig_HTTP, dummyKintoHost, dummyCustomDomain)
	if uErr != nil {
		t.Errorf("store.UpsertCustomDomainNames = %v - must be nil", uErr)
	}

	issuerGot, err :=
		kubeStore.kubeCertClient.CertmanagerV1alpha2().Issuers(dummyNamespace).Get(
			context.TODO(), genName, metav1.GetOptions{})
	assert.NoError(t, err)
	assert.Equal(t, issuerWant, issuerGot)

	certificateGot, err :=
		kubeStore.kubeCertClient.CertmanagerV1alpha2().Certificates(dummyNamespace).Get(
			context.TODO(), genName, metav1.GetOptions{})
	assert.NoError(t, err)
	assert.Equal(t, certificateWant, certificateGot)

	ingressGot, err :=
		kubeStore.kubeClient.ExtensionsV1beta1().Ingresses(dummyNamespace).Get(context.TODO(), genName, metav1.GetOptions{})
	assert.NoError(t, err)
	assert.Equal(t, ingressWant, ingressGot)

	uErr = kubeStore.DeleteCustomDomainNames(dummyNamespace, dummyBlockName, "")
	if uErr != nil {
		t.Errorf("store.DeleteCustomDomainNames = %v - must be nil", uErr)
	}

	_, err =
		kubeStore.kubeCertClient.CertmanagerV1alpha2().Issuers(dummyNamespace).Get(
			context.TODO(), genName, metav1.GetOptions{})
	assert.NoError(t, err) // we don't delete the issuer since it can be used later

	_, err =
		kubeStore.kubeCertClient.CertmanagerV1alpha2().Certificates(dummyNamespace).Get(
			context.TODO(), genName, metav1.GetOptions{})
	assert.Error(t, err)

	_, err =
		kubeStore.kubeClient.ExtensionsV1beta1().Ingresses(dummyNamespace).Get(context.TODO(), genName, metav1.GetOptions{})
	assert.Error(t, err)
}

func TestKubeStore_DoesCustomDomainExistInStore(t *testing.T) {
	kubeStore := KubeStore{
		kubeClient:     fakekube.NewSimpleClientset(),
		kubeCertClient: fakecert.NewSimpleClientset(),
	}

	dummyService := &corev1.Service{
		ObjectMeta: metav1.ObjectMeta{Name: dummyBlockName},
	}
	_, err :=
		kubeStore.kubeClient.CoreV1().Services(dummyNamespace).Create(
			context.TODO(), dummyService, metav1.CreateOptions{})
	assert.NoError(t, err)

	// enable first the public URL for the service
	uErr := kubeStore.EnablePublicURL(dummyNamespace, dummyBlockName, types.RunConfig_HTTP, dummyKintoHost)
	if uErr != nil {
		t.Errorf("store.EnablePublicURL = %v - must be nil", uErr)
	}

	uErr = kubeStore.UpsertCustomDomainNames(
		dummyNamespace, dummyBlockName, types.RunConfig_HTTP, dummyKintoHost, dummyCustomDomain)
	if uErr != nil {
		t.Errorf("store.UpsertCustomDomainNames = %v - must be nil", uErr)
	}

	doesExists, uErr := kubeStore.DoesCustomDomainExistInStore(dummyCustomDomain)
	if uErr != nil {
		t.Errorf("store.DoesCustomDomainExistInStore = %v - must be nil", uErr)
	}

	assert.Equal(t, true, doesExists)
}
