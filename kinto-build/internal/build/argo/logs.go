package argo

import (
	"bytes"
	"context"
	argoLogs "github.com/argoproj/argo/util/logs"
	"github.com/kintohub/kinto-build/internal/build/utils"
	"github.com/kintohub/kinto-build/internal/config"
	"github.com/kintohub/utils-go/klog"
	utilsGoServer "github.com/kintohub/utils-go/server"
	"github.com/minio/minio-go/v6"
	"sort"
)

func (c *BuildClient) GetLogs(ctx context.Context, buildId string) ([]byte, *utilsGoServer.Error) {
	objCh := c.minioClient.ListObjects(
		config.ArgoWorkflowMinioBucket,
		buildId,
		true,
		ctx.Done())

	var objInfos []minio.ObjectInfo
	for object := range objCh {
		if object.Err != nil {
			return nil, utilsGoServer.NewInternalErrorWithErr("error listing minio objects", object.Err)
		}

		klog.Debugf("found log %s", object.Key)
		objInfos = append(objInfos, object)
	}

	// Order files in order they were last modified so the logs will be in order
	// https://www.geeksforgeeks.org/how-to-sort-a-slice-in-golang/
	sort.Slice(objInfos, func(i, j int) bool {
		return objInfos[i].LastModified.Before(objInfos[j].LastModified)
	})

	var logsData []byte
	for _, objInfo := range objInfos {
		obj, err := c.minioClient.GetObjectWithContext(
			ctx, config.ArgoWorkflowMinioBucket, objInfo.Key, minio.GetObjectOptions{})

		if err != nil {
			return nil, utilsGoServer.NewInternalErrorWithErr("error downloading minio obj", err)
		}

		buf := bytes.Buffer{}
		_, err = buf.ReadFrom(obj)

		if err != nil {
			return nil, utilsGoServer.NewInternalErrorWithErr("error reading minio obj", err)
		}

		data := buf.Bytes()
		if config.UserFriendlyBuildLogsEnabled {
			data = utils.MakeUserFriendlyLogs(data)
		}

		logsData = append(logsData, data...)

		obj.Close()
	}

	return logsData, nil
}

func (c *BuildClient) RunWatchLogs(
	ctx context.Context, buildId string, sendClientLogs func(data []byte) error) *utilsGoServer.Error {

	err := argoLogs.WorkflowLogs(ctx, c.argoClient, c.kubeClient, &logsRequest{
		namespace:  config.ArgoWorkflowNamespace,
		workflowId: buildId,
	}, &logHandler{
		handler: func(data []byte) error {
			if config.UserFriendlyBuildLogsEnabled {
				data = utils.MakeUserFriendlyLogs(data)
			}

			if len(data) > 0 {
				return sendClientLogs(data)
			}

			return nil
		},
	})

	if err != nil {
		return utilsGoServer.NewInternalErrorWithErr("error starting argo logs stream", err)
	}

	return nil
}
