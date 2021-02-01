module github.com/kintohub/kinto-build

go 1.12

require (
	github.com/argoproj/argo v0.0.0-20200528233840-0fff4b21c21c
	github.com/golang/protobuf v1.4.0
	github.com/joho/godotenv v1.3.0
	github.com/kintohub/kinto-kube-core v1.4.4-0.20200907031533-582a48e124bc
	github.com/kintohub/utils-go v0.2.3-0.20200901062510-5825dbd55187
	github.com/minio/minio-go/v6 v6.0.57
	github.com/stretchr/testify v1.5.1
	golang.org/x/net v0.0.0-20200602114024-627f9648deb9
	google.golang.org/genproto v0.0.0-20200317114155-1f3552e48f24
	google.golang.org/grpc v1.29.1
	gotest.tools v2.2.0+incompatible
	k8s.io/api v0.18.0
	k8s.io/apimachinery v0.18.0
	k8s.io/client-go v0.18.0
	k8s.io/klog v1.0.0
	k8s.io/utils v0.0.0-20200324210504-a9aa75ae1b89
)

replace k8s.io/client-go => k8s.io/client-go v0.17.0

replace k8s.io/apimachinery => k8s.io/apimachinery v0.17.0
