#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
PURPLE='\033[0;35m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m'

#Global variables
TMP_DIR="/tmp/tmpinstalldir"
INSECURE="false"
OUT_DIR="/usr/local/bin"
NEED_SUDO=0

#CLI related values
OWNER="kintoproj"
REPO_NAME="kintohub"
CLI_NAME="kinto"  #will be the final name of the CLI command.
GH="https://github.com"

#Helper Functions
log() { echo -e "➜ $*"; }

function checkSudo() {
    if [[ "$NEED_SUDO" == '1' ]]; then
        sudo "$@"
    else
        "$@"
    fi
}

function cleanup {
	echo rm -rf $TMP_DIR > /dev/null
}

function fail {
	cleanup
	msg=$1
	log "${RED}Error: $msg" 1>&2
	exit 1
}

function getLatestReleaseVersion() {
	curl -L -s -H 'Accept: application/json' https://github.com/$OWNER/$REPO_NAME/releases/latest | 
	sed -e 's/.*"tag_name":"\([^"]*\)".*/\1/'  || 
	fail "Cannot retrieve latest release!"  
                    
}

function checkDependencies(){
	GET=""
	if which curl > /dev/null; then
		GET="curl"
		if [[ $INSECURE = "true" ]]; then GET="$GET --insecure"; fi
		GET="$GET --fail -# -L"
	elif which wget > /dev/null; then
		GET="wget"
		if [[ $INSECURE = "true" ]]; then GET="$GET --no-check-certificate"; fi
		GET="$GET -qO-"
	else
		fail "Neither wget or curl are installed! Please install either of these and try again."
	fi
}

#Main function
function install {
	checkDependencies

	echo ""
	log "Fetching latest version..."

	LATEST_VERSION=$(getLatestReleaseVersion)
	if [ ! $LATEST_VERSION ]; then
		echo "${YELLOW}"
		log "Failed while attempting to install Kinto CLI. Please install manually:"
		echo ""
		log "1. Open your web browser and go to https://github.com/${OWNER}/${REPO_NAME}/releases"
		log "2. Download the CLI from latest release for your platform."
		log "3. Extract the .zip file to a location of your choice."
		log "3. chmod +x ./kinto"
		log "4. mv ./kinto /usr/local/bin"
		echo ""
		fail "Exiting..."
	fi
	log "Found latest version: ${LATEST_VERSION}"
	
	#Find Host OS
	case `uname -s` in
	Darwin) OS="darwin";;
	Linux) OS="linux";;
	*) fail "Unknown os: $(uname -s)";;
	esac

	#Find Host Architecture
	if uname -m | grep 64 > /dev/null; then
		ARCH="amd64"
	else
		fail "Unknown arch: $(uname -m)"
	fi

	#Select release according to Host OS & Arch
	URL=""
	FTYPE=""
	case "${OS}_${ARCH}" in
	"linux_amd64")
		URL=$GH/$OWNER/$REPO_NAME/releases/download/$LATEST_VERSION/cli-kinto-linux-amd64.zip
		FTYPE=".zip"
		;;
	"darwin_amd64")
		URL=$GH/$OWNER/$REPO_NAME/releases/download/$LATEST_VERSION/cli-kinto-mac-amd64.zip
		FTYPE=".zip"
		;;
	*) fail "No latest release found for platform ${OS}-${ARCH}!";;
	esac

	#Download the release
	echo ""
	log "${GREEN}Downloading $REPO_NAME $LATEST_VERSION"
	
	
	#Cd in to temp directory
	mkdir -p $TMP_DIR
	cd $TMP_DIR
	if [[ $FTYPE = ".zip" ]]; then
		which unzip > /dev/null || fail "unzip is not installed"
		bash -c "$GET $URL" > tmp.zip || fail "Download failed"
		unzip -o -qq tmp.zip || fail "unzip failed"
		rm tmp.zip || fail "Cleanup failed"
	elif [[ $FTYPE = "" ]]; then
		bash -c "$GET $URL" || fail "Download failed"
	else
		fail "Unknown file type: $FTYPE"
	fi

	echo ""
	log "${GREEN}Installing Kinto CLI ${LATEST_VERSION}..."

	#Extracted file from the Release archive
	TMP_BIN=kinto

	# check for sudo
	needSudo=$(touch ${OUT_DIR}/.kintoinstall &> /dev/null)
	if [[ "$?" == "1" ]]; then
		NEED_SUDO=1
	fi
	rm ${OUT_DIR}/.kintoinstall &> /dev/null

	if [[ "$NEED_SUDO" == '1' ]]; then
		log
		log "${YELLOW}Path '$OUT_DIR' requires root access to write."
		log "${YELLOW}This script will attempt to execute the move command with sudo.${NC}"
		log "${YELLOW}Are you ok with that? (y/N)${NC}"
		read a
		if [[ $a == "Y" || $a == "y" || $a = "" ]]; then
			echo ""
		else
			echo ""
			log "${BLUE}sudo mv $TMP_BIN $OUT_DIR/$CLI_NAME${NC}"
			echo ""
			fail "Please move the binary manually using the command above."
		fi
	fi
	#Move into PATH or cwd
	log "Moving CLI from $TMP_BIN to ${OUT_DIR}"
	chmod +x $TMP_BIN || fail "chmod +x failed"
	checkSudo mv $TMP_BIN $OUT_DIR/$CLI_NAME || fail "Failed to move file from $TMP_BIN to $OUT_DIR/$CLI_NAME"
	
	#Installation successful!
	echo ""
	log "Kinto CLI successfully installed to $OUT_DIR/$CLI_NAME"
	log "To get started type the command: kinto"

	#Cleanup residue
	cleanup
}
install
