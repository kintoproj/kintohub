package types

import (
	"encoding/json"
	"errors"
	"fmt"

	"github.com/golang/protobuf/ptypes"
	"github.com/kintohub/kinto-core/pkg/consts"
	"github.com/rs/zerolog/log"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func ConfigMapToBlock(configMap *corev1.ConfigMap) (*Block, error) {
	if blockData, ok := configMap.Data[consts.BlockConfigMapDataKey]; ok {
		block := Block{}

		err := json.Unmarshal([]byte(blockData), &block)

		if err != nil {
			return nil, err
		}

		return &block, nil
	} else {
		return nil, errors.New(fmt.Sprintf("found empty config map without any data? %v", configMap))
	}
}

func BlockToConfigMap(block *Block) (*corev1.ConfigMap, error) {
	data, err := json.Marshal(&block)

	if err != nil {
		return nil, err
	}

	return &corev1.ConfigMap{
		ObjectMeta: metav1.ObjectMeta{
			Name: GenBlockConfigMapName(block.Name),
			Labels: map[string]string{
				"id":                 block.Id,
				consts.OwnerLabelKey: consts.OwnerLabelValue,
				consts.AppLabelKey:   block.Name,
			},
		},
		Data: map[string]string{
			consts.BlockConfigMapDataKey: string(data),
		},
	}, nil
}

func GenBlockConfigMapName(blockName string) string {
	return fmt.Sprintf("%s-%s", consts.BlockConfigMapNamePrefix, blockName)
}

func GetLatestSuccessfulRelease(releases map[string]*Release) *Release {
	if releases == nil || len(releases) == 0 {
		return nil
	}

	var latestRelease *Release
	for _, release := range releases {
		// filter release by only successfully deployed and with valid deployment type (exclude SUSPEND and UNDEPLOY)
		// NOT_SET is included as well for backward compatibility
		if release.Status.State == Status_SUCCESS &&
			(release.Type == Release_ROLLBACK ||
				release.Type == Release_DEPLOY ||
				release.Type == Release_NOT_SET) {
			if latestRelease == nil {
				latestRelease = release
				continue
			}

			latestCreatedAt, err := ptypes.Timestamp(latestRelease.CreatedAt)

			if err != nil {
				log.Error().Err(err).Msgf(
					"cannot parse timestamp %v to time for release %v", latestRelease.CreatedAt, latestRelease)
				continue
			}

			releaseCreateAt, err := ptypes.Timestamp(release.CreatedAt)

			if err != nil {
				log.Error().Err(err).Msgf(
					"cannot parse timestamp %v to time for release %v", release.CreatedAt, release)
				continue
			}

			if releaseCreateAt.After(latestCreatedAt) {
				latestRelease = release
			}
		}
	}

	return latestRelease
}

// https://golang.org/doc/faq#convert_slice_of_interface
func convertInt32ArrayToInterfaceArray(t []int32) []interface{} {
	s := make([]interface{}, len(t))
	for i, v := range t {
		s[i] = v
	}
	return s
}

// https://golang.org/doc/faq#convert_slice_of_interface
func convertFloat32ArrayToInterfaceArray(t []float32) []interface{} {
	s := make([]interface{}, len(t))
	for i, v := range t {
		s[i] = v
	}
	return s
}
