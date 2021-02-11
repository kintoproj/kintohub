package api

type RemoteConfig struct {
	FromHost string
	FromPort int
	ToHost   string
	ToPort   int
}

type EnvDetails struct {
	EnvName string
	EnvId   string
}
