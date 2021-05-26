module github.com/kintoproj/kintohub/builder

go 1.12

require (
	github.com/argoproj/argo v0.0.0-20200528233840-0fff4b21c21c
	github.com/golang/protobuf v1.4.3
	github.com/joho/godotenv v1.3.0
	github.com/kintoproj/go-utils v0.2.3
	github.com/kintoproj/kintohub/core v0.0.0-20210526120029-9ed55ab023fc
	github.com/minio/minio-go/v6 v6.0.57
	golang.org/x/net v0.0.0-20210510120150-4163338589ed
	google.golang.org/grpc v1.38.0
	k8s.io/api v0.18.0
	k8s.io/apimachinery v0.18.0
	k8s.io/client-go v0.18.0
	k8s.io/klog v1.0.0
	k8s.io/utils v0.0.0-20200324210504-a9aa75ae1b89
)

replace k8s.io/client-go => k8s.io/client-go v0.17.0

replace k8s.io/apimachinery => k8s.io/apimachinery v0.17.0
