package kube

import (
	"context"
	"fmt"
	certacmev1alpha2 "github.com/jetstack/cert-manager/pkg/apis/acme/v1alpha2"
	certv1alpha2 "github.com/jetstack/cert-manager/pkg/apis/certmanager/v1alpha2"
	certmetav1 "github.com/jetstack/cert-manager/pkg/apis/meta/v1"
	cert "github.com/jetstack/cert-manager/pkg/client/clientset/versioned"
	"github.com/kintohub/kinto-core/internal/config"
	"github.com/kintohub/kinto-core/pkg/consts"
	k8serrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/utils/pointer"
)

func upsertIssuer(client cert.Interface, name, namespace string) (*certv1alpha2.Issuer, error) {
	_, err :=
		client.CertmanagerV1alpha2().Issuers(namespace).Get(context.TODO(), name, metav1.GetOptions{})

	if k8serrors.IsNotFound(err) {
		issuer := genIssuer(name, namespace)

		return client.CertmanagerV1alpha2().Issuers(namespace).Create(context.TODO(), issuer, metav1.CreateOptions{})
	}

	return nil, nil
}

func genIssuer(name, namespace string) *certv1alpha2.Issuer {
	return &certv1alpha2.Issuer{
		ObjectMeta: metav1.ObjectMeta{
			Name: name,
			Labels: map[string]string{
				consts.OwnerLabelKey: consts.OwnerLabelValue,
			},
		},
		Spec: certv1alpha2.IssuerSpec{
			IssuerConfig: certv1alpha2.IssuerConfig{
				ACME: &certacmev1alpha2.ACMEIssuer{
					Email:  genAliasEmail(config.CertManagerIssuerEmail, namespace),
					Server: config.CertManagerIssuerServer,
					PrivateKey: certmetav1.SecretKeySelector{
						LocalObjectReference: certmetav1.LocalObjectReference{
							Name: fmt.Sprintf("issuer-key-%s", name),
						},
					},
					Solvers: []certacmev1alpha2.ACMEChallengeSolver{
						{
							HTTP01: &certacmev1alpha2.ACMEChallengeSolverHTTP01{
								Ingress: &certacmev1alpha2.ACMEChallengeSolverHTTP01Ingress{
									Class: pointer.StringPtr("nginx"), // TODO make this configurable
								},
							},
						},
					},
				},
			},
		},
	}
}

func upsertCertificate(client cert.Interface, name, namespace string, hosts []string) (*certv1alpha2.Certificate, error) {
	existingCertificate, err :=
		client.CertmanagerV1alpha2().Certificates(namespace).Get(context.TODO(), name, metav1.GetOptions{})

	if k8serrors.IsNotFound(err) {
		certificate := genCertificate(name, hosts)

		return client.CertmanagerV1alpha2().Certificates(namespace).Create(context.TODO(), certificate, metav1.CreateOptions{})
	}

	updateCertificate(existingCertificate, hosts)
	return client.CertmanagerV1alpha2().Certificates(namespace).Update(context.TODO(), existingCertificate, metav1.UpdateOptions{})
}

func genCertificate(name string, hosts []string) *certv1alpha2.Certificate {
	return &certv1alpha2.Certificate{
		ObjectMeta: metav1.ObjectMeta{
			Name: name,
			Labels: map[string]string{
				consts.OwnerLabelKey: consts.OwnerLabelValue,
			},
		},
		Spec: certv1alpha2.CertificateSpec{
			DNSNames:   hosts,
			SecretName: name,
			IssuerRef: certmetav1.ObjectReference{
				Name: name,
				Kind: "Issuer",
			},
		},
	}
}

func updateCertificate(certificate *certv1alpha2.Certificate, hosts []string) {
	certificate.Spec.DNSNames = hosts
}

func deleteCertificate(client cert.Interface, name, namespace string) error {
	_, err :=
		client.CertmanagerV1alpha2().Certificates(namespace).Get(context.TODO(), name, metav1.GetOptions{})

	if k8serrors.IsNotFound(err) {
		return nil
	} else if err != nil {
		return err
	}

	return client.CertmanagerV1alpha2().Certificates(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
}

func checkCertificateReadiness(client cert.Interface, name, namespace string) (bool, error) {
	certificate, err :=
		client.CertmanagerV1alpha2().Certificates(namespace).Get(context.TODO(), name, metav1.GetOptions{})

	if err != nil {
		return false, err
	}

	for _, cond := range certificate.Status.Conditions {
		if cond.Type == certv1alpha2.CertificateConditionReady && cond.Status == certmetav1.ConditionTrue {
			return true, nil
		}
	}

	return false, nil
}
