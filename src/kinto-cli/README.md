# Kinto CLI
[![slack](https://img.shields.io/badge/slack-kintoproj-brightgreen)](https://slack.kintohub.com)

Kinto CLI is a command line utility for accessing [kinto-core](https://github.com/kintoproj/kinto-core). Kinto CLI is written in Golang.

# Index
- [Kinto CLI](#kinto-cli)
- [Index](#index)
- [Installation](#installation)
  - [Linux / MacOS](#linux--macos)
    - [Requirements :](#requirements-)
  - [Windows](#windows)
    - [Requirements :](#requirements--1)
- [Development](#development)
  - [Requirements](#requirements)
  - [Project Structure](#project-structure)
  - [Local Setup](#local-setup)
- [CLI Commands](#cli-commands)

# Installation

## Linux / MacOS

### Requirements :

- Make sure you use bash to run this script.
- `unzip` should be installed. If you don't already have it install it using `sudo apt-get install -y unzip` or similar command depending on your linux distro.

Run the installation script to install kinto CLI to its default location `usr/local/bin`

```
curl -L https://raw.githubusercontent.com/kintoproj/kinto-cli/main/install.sh | bash
```

## Windows

### Requirements :

- Windows 7 SP1+ / Windows Server 2008+
- [PowerShell 5](https://aka.ms/wmf5download) (or later, include [PowerShell Core](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-core-on-windows?view=powershell-6))
- PowerShell must be enabled for your user account e.g. `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Run PowerShell as Administrator to avoid any errors.

Run the following command from your PowerShell to install Kinto CLI to its default location `C:\Users\<user>\kinto`

```
Invoke-Expression (New-Object System.Net.WebClient).DownloadString('https://raw.githubusercontent.com/kintoproj/kinto-cli/main/install.ps1')
```

OR

```
iwr -useb raw.githubusercontent.com/kintoproj/kinto-cli/main/install.ps1 | iex
```

`Note :` You can also download the latest available release for your Operating System from [releases](https://github.com/kintoproj/kinto-cli/releases) and add it to your global `PATH` manually.

# Development

Kinto CLI is written in [GoLang](https://golang.org/) using the popular package [Cobra](https://github.com/spf13/cobra) and it uses [Go Modules](https://github.com/golang/go/wiki/Modules) to make working with external dependencies easy.

## Requirements

- [Go v1.13+](https://golang.org/doc/install)
- [Git](https://git-scm.com/downloads)

## Project Structure

Kinto CLI follows the following structure

```
kinto-cli
 |── internal
     ├── api
     ├── cli
     ├── config
     ├── controller
     └── utils

```

- **internal** houses all the code for the CLI
  - **api** provides access to different components of the CLI such as `environments`, `services/blocks`, etc.
  - **cli** contains the root file that houses all the command declarations.
  - **config** stores the consts and configs for the CLI.
  - **controller** hosts the business logic for all the functions declared in **cli**
  - **utils** contains the basic utility functions needed by the CLI.

## Local Setup

Follow the below-given instructions to set up the project locally.

- Clone the repo and `cd` into it

  ```
  git clone https://github.com/kintoproj/kinto-cli

  cd kinto-cli
  ```

- Once you have a local copy of Kinto-CLI repo on your machine, you can use an IDE such as [Goland](https://www.jetbrains.com/go/download/) to make working with GoLang easier or you can do the setup manually by -

  ```
  cd kinto-cli

  go mod download
  ```

- You can build the CLI binary file for your Operating system by running the command

  ```
  go build
  ```

- And install it to `$GOPATH/go/bin/` by

  ```
  go install
  ```

# CLI Commands

For a detailed overview of the available CLI commands see [CLI docs](https://www.kintohub.com/features/cli#commands).
