package kube

import (
	"context"
	"github.com/kintoproj/kinto-core/pkg/consts"
	pkgtypes "github.com/kintoproj/kinto-core/pkg/types"
	"k8s.io/api/extensions/v1beta1"
	k8serrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/intstr"
	"k8s.io/client-go/kubernetes"
)

func upsertIngress(
	kubeClient kubernetes.Interface,
	namespace, name, svcName, tlsSecret string,
	protocol pkgtypes.RunConfig_Protocol,
	hosts ...string) (*v1beta1.Ingress, error) {

	port := int32(80) // by default, all services contain port 80 + their own port

	existingIngress, err :=
		kubeClient.ExtensionsV1beta1().Ingresses(namespace).Get(context.TODO(), name, metav1.GetOptions{})

	if k8serrors.IsNotFound(err) {
		ingress := genIngressObject(name, svcName, tlsSecret, port, protocol, hosts...)
		return kubeClient.ExtensionsV1beta1().Ingresses(namespace).Create(
			context.TODO(), ingress, metav1.CreateOptions{})
	} else if err != nil {
		return nil, err
	}

	updateIngressObject(svcName, tlsSecret, port, protocol, existingIngress, hosts...)
	return kubeClient.ExtensionsV1beta1().Ingresses(namespace).Update(
		context.TODO(), existingIngress, metav1.UpdateOptions{})
}

func deleteIngress(kubeClient kubernetes.Interface, namespace, name string) error {
	_, err :=
		kubeClient.ExtensionsV1beta1().Ingresses(namespace).Get(context.TODO(), name, metav1.GetOptions{})

	if k8serrors.IsNotFound(err) {
		return nil
	} else if err != nil {
		return err
	}

	return kubeClient.ExtensionsV1beta1().Ingresses(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
}

func genIngressObject(
	name, svcName, tlsSecret string, port int32, protocol pkgtypes.RunConfig_Protocol, hosts ...string) *v1beta1.Ingress {

	ingress := &v1beta1.Ingress{
		ObjectMeta: metav1.ObjectMeta{
			Name: name,
			Annotations: map[string]string{
				"kubernetes.io/ingress.class": "nginx", // TODO make it configurable
			},
			Labels: map[string]string{
				consts.OwnerLabelKey: consts.OwnerLabelValue,
			},
		},
		Spec: v1beta1.IngressSpec{
			TLS:   genTLS(hosts, tlsSecret),
			Rules: genIngressRules(svcName, port, hosts...),
		},
	}

	if protocol == pkgtypes.RunConfig_GRPC {
		ingress.Annotations["nginx.ingress.kubernetes.io/ssl-redirect"] = "true"
		ingress.Annotations["nginx.ingress.kubernetes.io/backend-protocol"] = "GRPC"
	}

	return ingress
}

func updateIngressObject(
	svcName, tlsSecret string, port int32, protocol pkgtypes.RunConfig_Protocol, ingress *v1beta1.Ingress, hosts ...string) {

	ingress.Spec.Rules = genIngressRules(svcName, port, hosts...)
	ingress.Spec.TLS = genTLS(hosts, tlsSecret)

	if protocol == pkgtypes.RunConfig_GRPC {
		ingress.Annotations["nginx.ingress.kubernetes.io/ssl-redirect"] = "true"
		ingress.Annotations["nginx.ingress.kubernetes.io/backend-protocol"] = "GRPC"
	} else {
		ingress.Annotations["nginx.ingress.kubernetes.io/ssl-redirect"] = ""
		ingress.Annotations["nginx.ingress.kubernetes.io/backend-protocol"] = ""
	}
}

// all the ingress will be tls protected
// if `secretName` is empty, then it will use the default secret from the ingress controller
func genTLS(hosts []string, tlsSecret string) []v1beta1.IngressTLS {
	tls := v1beta1.IngressTLS{
		Hosts: hosts,
	}
	if tlsSecret != "" {
		tls.SecretName = tlsSecret
	}
	return append([]v1beta1.IngressTLS{}, tls)
}

func genIngressRules(svcName string, port int32, hosts ...string) []v1beta1.IngressRule {
	var rules []v1beta1.IngressRule
	for _, host := range hosts {
		rules = append(rules, v1beta1.IngressRule{
			Host: host,
			IngressRuleValue: v1beta1.IngressRuleValue{
				HTTP: &v1beta1.HTTPIngressRuleValue{
					Paths: []v1beta1.HTTPIngressPath{
						{
							Path: "/",
							Backend: v1beta1.IngressBackend{
								ServiceName: svcName,
								ServicePort: intstr.IntOrString{
									IntVal: port,
								},
							},
						},
					},
				},
			},
		})
	}
	return rules
}

// return true if the host already exists in a kubernetes ingress
func doesHostExistInIngresses(kubeClient kubernetes.Interface, host string) (bool, error) {
	// namespace == "" -> will look to all namespaces
	ingresses, err :=
		kubeClient.ExtensionsV1beta1().Ingresses("").List(context.TODO(), metav1.ListOptions{})

	if err != nil {
		return false, err
	}

	for _, ingress := range ingresses.Items {
		for _, rule := range ingress.Spec.Rules {
			if host == rule.Host {
				return true, nil
			}
		}
	}

	return false, nil
}
