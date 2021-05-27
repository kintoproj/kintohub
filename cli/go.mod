module github.com/kintoproj/kintohub/cli

go 1.15

require (
	github.com/AlecAivazis/survey/v2 v2.2.7
	github.com/Terry-Mao/goconf v0.0.0-20161115082538-13cb73d70c44
	github.com/briandowns/spinner v1.12.0
	github.com/golang/protobuf v1.4.3
	github.com/gookit/color v1.3.7
	github.com/jpillora/chisel v1.7.4
	github.com/kintoproj/kintohub/core v0.0.0
	github.com/mitchellh/go-homedir v1.1.0
	github.com/olekukonko/tablewriter v0.0.5
	github.com/rs/zerolog v1.22.0
	github.com/spf13/cobra v1.1.3
	github.com/spf13/viper v1.7.1
	google.golang.org/grpc v1.38.0
)

replace github.com/kintoproj/kintohub/core => ../core
