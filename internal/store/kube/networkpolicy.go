package kube

import (
	"context"
	"github.com/kintohub/utils-go/klog"
	networkingv1 "k8s.io/api/networking/v1"
	k8serrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"time"
)

const (
	networkPolicyName = "allow-kintohub-owner-namespaces"
)

func upsertNetworkPolicy(kubeClient kubernetes.Interface, namespace string) (*networkingv1.NetworkPolicy, error) {
	defer klog.LogDuration(time.Now(), "upsertNetworkPolicy")

	np, err := kubeClient.NetworkingV1().NetworkPolicies(namespace).Get(
		context.TODO(), networkPolicyName, metav1.GetOptions{})

	if k8serrors.IsNotFound(err) {
		return kubeClient.NetworkingV1().NetworkPolicies(namespace).Create(
			context.TODO(), genNetworkPolicyObject(), metav1.CreateOptions{})
	} else if err != nil {
		return nil, err
	}

	np.Spec = genNetworkPolicySpec()

	return kubeClient.NetworkingV1().NetworkPolicies(namespace).Update(context.TODO(), np, metav1.UpdateOptions{})
}

func genNetworkPolicyObject() *networkingv1.NetworkPolicy {
	return &networkingv1.NetworkPolicy{
		ObjectMeta: metav1.ObjectMeta{
			Name: networkPolicyName,
		},
		Spec: genNetworkPolicySpec(),
	}
}

func genNetworkPolicySpec() networkingv1.NetworkPolicySpec {
	return networkingv1.NetworkPolicySpec{
		PodSelector: metav1.LabelSelector{
			MatchLabels: map[string]string{},
		},
		Ingress: []networkingv1.NetworkPolicyIngressRule{
			{
				From: []networkingv1.NetworkPolicyPeer{
					{
						PodSelector: &metav1.LabelSelector{}, // deny all access from other namespaces
					},
				},
			},
			{
				From: []networkingv1.NetworkPolicyPeer{
					{
						NamespaceSelector: &metav1.LabelSelector{
							MatchLabels: map[string]string{"owner": "kintohub"}, // allow access from kintohub ns
						},
					},
				},
			},
		},
	}
}
