package api

import (
	"context"
	"fmt"
	chisel "github.com/jpillora/chisel/client"
	"github.com/kintoproj/kinto-cli/internal/config"
	"github.com/kintoproj/kinto-cli/internal/utils"
	"github.com/kintoproj/kinto-core/pkg/types"
	"io"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"syscall"
	"time"
)

// Used for `kinto access` , `kinto env access`, `kinto svs access`
// Allows to port-forward/access services depending upon their nature of caller parent
func (a *Api) StartAccess(blocksToForward []RemoteConfig, envId string) {

	// Default time to cancel is 30 minutes for our nginx gateway
	// TODO: Move to env var / build arg
	duration := time.Now().Add(time.Minute * 30)
	ctx, cancel := context.WithDeadline(context.Background(), duration)
	streamResponse, err := a.client.StartTeleport(
		ctx, &types.TeleportRequest{EnvId: envId})
	defer cancel()

	if err != nil {
		utils.TerminateWithError(err)
		return
	}
	startChisel(blocksToForward, streamResponse, false)

}

// Used for `kinto teleport`
// Allows to teleport & port-forward services. Once service is teleported (traffic is redirected) while
// other services are port-forwarded
func (a *Api) StartTeleport(blocksToForward []RemoteConfig, envId string, blockName string) {

	// Default time to cancel is 30 minutes for our nginx gateway
	// TODO: Move to env var / build arg
	ctx, cancel := context.WithDeadline(context.Background(), time.Now().Add(time.Minute*30))
	streamResponse, err := a.client.StartTeleport(
		ctx, &types.TeleportRequest{EnvId: envId, BlockName: blockName})
	defer cancel()

	if err != nil {
		utils.TerminateWithError(err)
		return
	}

	startChisel(blocksToForward, streamResponse, true)

}

// Parent function to start the chisel client. takes a param `isTeleport` to determine the nature of call.
func startChisel(blocksToForward []RemoteConfig,
	streamResponse types.KintoCoreService_StartTeleportClient, isTeleport bool) {

	host, err := streamResponse.Recv()

	if err == io.EOF {
		utils.TerminateWithCustomError("stream has no data!")
		return
	}
	if err != nil {
		utils.TerminateWithError(err)
		return
	}

	var remotes []string

	// Create remotes to feed to the chisel client
	for _, remote := range blocksToForward {
		newRemote := fmt.Sprintf(
			"%s:%s:%s:%s",
			remote.FromHost,
			strconv.Itoa(remote.FromPort),
			remote.ToHost,
			strconv.Itoa(remote.ToPort),
		)
		remotes = append(remotes, newRemote)
	}

	chiselClient, err := chisel.NewClient(&chisel.Config{
		MaxRetryInterval: 1 * time.Second,
		MaxRetryCount:    50,
		Server:           fmt.Sprintf("https://%s", host.Data.Host),
		Auth:             host.Data.Credentials,
		Remotes:          remotes,
		KeepAlive:        10 * time.Second,
	})

	if err != nil {
		utils.TerminateWithError(err)
		return
	}

	defer chiselClient.Close()

	// Run infinite stream connection
	go func() {
		_, err := streamResponse.Recv()
		if err != nil {
			utils.TerminateWithError(err)
			return
		}
	}()

	chiselClient.Logger.Info = false
	chiselClient.Logger.Debug = false

	fmt.Println("")
	utils.InfoMessage("Starting Tunnel")

	// Create remote list to display to user. check if service is
	// teleported or port-forwarded and show msg accordingly
	for _, remote := range blocksToForward {
		if strings.Contains(remote.FromHost, config.DefaultTeleportInterfacePort) {
			utils.InfoMessage(fmt.Sprintf(
				"Teleporting > %s:%d => %s:%d",
				remote.ToHost,
				remote.ToPort,
				remote.FromHost,
				remote.FromPort))
		} else {
			utils.InfoMessage(fmt.Sprintf(
				"Forwarding  > %s:%d => %s:%d",
				remote.FromHost,
				remote.FromPort,
				remote.ToHost,
				remote.ToPort))
		}
	}
	// Run chisel client in background
	go func() {
		err = chiselClient.Run()
		if err != nil {
			utils.TerminateWithError(err)
			return
		}
	}()

	if err != nil {
		utils.TerminateWithError(err)
		return
	}

	// Show start server message only if teleporting a svs
	// For the lack of a better way, this is a temporary workaround for validating connection status
	if isTeleport {
		fmt.Println("")
		//TODO: make teleport port configurable
		utils.WarningMessage(fmt.Sprintf(
			"Please start your local server at PORT => %d", config.DefaultClientTeleportPort))

		utils.StartSpinner("Waiting for User to start local server... ")
		for utils.CheckIfPortOpened(config.DefaultClientTeleportPort, false) {
			time.Sleep(1 * time.Second)
		}
	}

	utils.StopSpinner()
	utils.SuccessMessage("Connected!")
	fmt.Println("")

	signalChannel := make(chan os.Signal, 1)
	completed := make(chan bool, 1)
	signal.Notify(signalChannel, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-signalChannel
		fmt.Println()
		completed <- true
	}()

	utils.NoteMessage("Press CTRL+C to close the tunnel")
	<-completed
	utils.WarningMessage("Connection Closed")

}
