package argo

import (
	"github.com/argoproj/argo/pkg/apiclient/workflow"
	corev1 "k8s.io/api/core/v1"
)

// implementation for argo logs queries
type logsRequest struct {
	namespace  string
	workflowId string
}

func (l logsRequest) GetNamespace() string {
	return l.namespace
}

func (l logsRequest) GetName() string {
	return l.workflowId
}

func (l logsRequest) GetPodName() string {
	// Return empty for all pods
	return ""
}
func (l logsRequest) GetLogOptions() *corev1.PodLogOptions {
	return &corev1.PodLogOptions{
		Container: "main",
		Follow:    true,
		// Required for frontend to order logs
		Timestamps: true,
	}
}

type logHandler struct {
	handler func(data []byte) error
}

func (l *logHandler) Send(entry *workflow.LogEntry) error {
	entry.Content += "\n"
	return l.handler([]byte(entry.Content))
}
