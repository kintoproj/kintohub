# Kinto Dashboard
[![slack](https://img.shields.io/badge/slack-kintoproj-brightgreen)](https://join.slack.com/t/kintogoons/shared_invite/zt-mu6bvg79-BmkkdMRRwohJioZggXVYeA)

Kintohub Dashboard is a general purpose, web-based UI for managing your [kinto-core](https://github.com/kintoproj/kinto-core). 
It allows you to manage your applications deployed by kinto-core with ease.
This project is written in typescript with react/redux.

![Kinto-Dashboard](LandingPage.png)

## Getting Started

You can find the documentation [on the website](https://docs.kintohub.com)

### Prerequisite

Make sure you have a kubernetes cluster and a [kinto-core](https://github.com/kintoproj/kinto-core) is running on it.

### Running locally

[comment]: <> (add helm chart/docker image for direct deploy?)

If you have direct access to the kubernetes cluster and kinto-core, 
you can run the dashboard locally with connecting to the port-forwarded kinto-core  

```bash
# port-forward your kinto-core
kubectl port-forward -n kintohub kinto-core 8080:8080 

# create the environment variable REACT_APP_SERVER_URL and point it to kinto-core
echo "REACT_APP_SERVER_URL=http://localhost:8080" > .env

# install dependencies
yarn 

# start with default 3000 port
yarn start
```

### Install via kubernetes yaml

You can also install the dashboard into kubernetes directly. 
But we strongly advise not to expose the dashboard to public as it could expose some admin actions that may harmful to your cluster.

[comment]: <> (TODO: add the )

## Development

### Project structure

```text
|
|- .story
|- build   # build folder for the website 
|- config  # config files for building, including the webpack config
|- refs    # git submodules for kinto-core
|- public  # static files
|- scripts # start up scripts. including the envVar replacement script
|- src     # src folder
    |- __tests__  # jest tests
    |- assets     # assets for react app  
    |- components # React components
    |- libraries  # logic and helper classes
    |- routes     # routers
    |- state      # redux states/actions/reducers
    |- stories    # storybook files
    |- theme      # MUI theme and colors
    |- types      # typescript types
       
```

### Generating types from proto files

The `.proto` files of this project is referencing from `kinto-core`. 
In normal case the `main` branch already contains the latest codes generated from `.proto` files. 
However, if you want to use the proto files other than `main` from `kinto-core` (for example some alpha features) 
you should checkout the corresponding branch for the git submodule (the `refs` folder) and generate the codes from them.

```bash

cd refs/kinto-core

git checkout dev

cd ../..

# generate the type files from protos
./protogen.sh

```

### Storybook

Storybook provides a way to test the component easily.
We use storybook to test some atoms/molecules especially those are on SidePanel or Popups.

```bash
yarn storybook

# visit localhost:9009
```

### Environment variables


```bash

# first add the environment variables here 
./src/libraries/envVars.ts

# second update the script to make sure the env vars get replaced at run time
./scripts/replaceEnvVars.sh
```

## Contribution

## License
