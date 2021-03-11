package controller

func stripeReleaseId(releaseId string) string {
	const max = 8
	if len(releaseId) < max {
		return releaseId
	}
	return releaseId[0 : max-1]
}
