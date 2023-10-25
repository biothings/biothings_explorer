# Installation

BTE can be used locally using Docker, or by [installing the workspace locally](#nodejs-workspace-installation) for further tinkering and development.

## Using Docker

Docker is a program that handles standardized virtual software environments. Put simply, it solves the problem of "Well, it works on my system!" by letting us hand you a bare-bones virtual system on which our code _does work_ so that you don't have to worry about requirements, compatibilities, etc.

Note that our Dockerfile does not take into account your local workspace and instead build from online repositories, so it won't reflect any local development you've done.

### Requirements

#### Docker

Installation for MacOS ([instructions here](https://docs.docker.com/desktop/install/mac-install/)) and most versions of Linux ([instructions here](https://docs.docker.com/desktop/install/linux-install/)) is relatively straightforward.

On Windows, Docker will require Windows Subsystem For Linux version 2 as a backend. In order to install this properly, there are a few steps:

- Ensure that you've enabled virtualization in your machine's UEFI/BIOS.
- Follow [Microsoft's instructions for installing WSL2.](https://learn.microsoft.com/en-us/windows/wsl/setup/environment) You can stop after the 'Update and upgrade packages' section.
- From here, follow the [Docker instructions to install Docker Desktop on Windows.](https://docs.docker.com/desktop/install/windows-install/#install-docker-desktop-on-windows)

If you're running on windows, you'll want to clone the repository using WSL, and run all commands relating to the environment from WSL. Make sure Docker Desktop is running while you're trying to use it in WSL.

> If you plan on doing development or any tinkering, you'll also want to set up a development environment that can interface with WSL. You can see Microsoft's tutorials on [setting up VSCode to work with WSL](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-vscode) and [connecting VSCode to remote containers](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-containers).

#### Docker Compose

If you're building your own image from the repository, you might want Docker Compose to make use of our easy compose file. If you've installed Docker Desktop, Docker Compose should already be on your system. Otherwise, you'll want to see [Docker's instructions on installing Docker Compose.](https://docs.docker.com/compose/install/)

---

### Building an image

First, you'll want to clone the repository and `cd` into it:

```bash
git clone git@github.com:biothings/biothings_explorer.git
cd biothings_explorer
```

#### Using Docker Compose

BTE provides a [docker-compose.yml](../docker-compose.yml) file, which will automatically handle building and running your own BTE image:

```bash
docker compose build --no-cache
```

This will instruct Docker to build and image of BTE using our online repositories.

#### Manually building an image

If you'd prefer to build an image on your own terms, you can use our Dockerfile directly:

```bash
docker build --rm --force-rm --compress -t biothings/bte-trapi .
```

---

### Running

After building a BTE image, you can run it automatically with a paired redis instance using Docker Compose:

```bash
docker compose up
```

#### Running manually

If you'd prefer to run BTE standalone, or with you own manual parameters:

```bash
docker run -it --rm -p 3000:3000 --name bte-trapi biothings/bte-trapi
```

Note that this will run BTE without Redis, which will disable BTE's asynchronous endpoints and caching features. To start a Redis container and start a BTE container connected to it:

```bash
docker run --name bte-redis -p 6379:6379 -d --hostname=redis:latest redis
docker run -it --rm -p 3000:3000 --name bte-trapi -e REDIS_HOST=host.docker.internal -e REDIS_PORT=6379 biothings/bte-trapi
```

You may wish to add `-e DEBUG="biomedical-id-resolver,bte*"` to enable BTE's debug logging.

## NodeJS Workspace Installation

If you'd prefer to get BTE working outside of a container, for development or any other reason, the installation has a few more requirements but is still a relatively simple affair.

### Requirements

For development, you will need Node.js the pnpm package manager installed in your environment. See the [pnpm installation instructions](https://pnpm.io/installation). Your Node version must be higher than v12.

#### Node.js and pnpm

It's recommended to manage Node using the Node Version Manager (NVM). [You can find the install script for NVM here](https://github.com/nvm-sh/nvm#installing-and-updating). After installing NVM, you'll want to ensure you're using at least version 18, which is the current recommended version of Node for BTE.

```bash
nvm install 18
nvm use 18
```

> On Windows, ensure that you're doing this from within WSL. To install WSL, see the [instructions in the Docker section](#docker).

This will install the latest version of Node v18. It'll also install npm, which we forgoing in favor of pnpm -- don't get the two confused!

This workspace uses pnpm instead of npm for its speed and better workspace support. To get pnpm installed, see the [instructions on pnpm's website](https://pnpm.io/installation).


#### Dependencies:

There are some additional dependencies when running a local workspace.

**Ubuntu (Linux or WSL):**

```bash
sudo apt install lz4 python3 make g++
```

**MacOS:**

MacOS will require the XCode Command Line Tools and [Homebrew](https://brew.sh/):

```zsh
xcode-select --install
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

After installing brew, you can install the remaining dependencies:

```
brew install lz4 python3 make
```

#### Redis

Optionally, if you plan to use BTE's asynchronous endpoints or caching features, you'll need to have redis working. You can either create an instance using [Docker](#using-docker) or by [installing redis on your machine.](https://redis.io/docs/getting-started/installation/)

---

### Install

The following commands will clone the repository and install it

```
git clone https://github.com/biothings/biothings_explorer.git
cd biothings_explorer
pnpm run setup
```

> If you ever change Node versions, you'll probably encounter some problems re-running the project. To fix this:

> ```bash
> pnpm install && pnpm rebuild
> ```


### Syncing SmartAPI Specifications

By default, this package does not automatically sync the latest SmartAPI Specifications. You may set it to do so by setting either `NODE_ENV=production` or `SMARTAPI_SYNC=true` as environment variables (e.g. `SMARTAPI_SYNC=true pnpm start`). `SMARTAPI_SYNC` overrides the behavior of `NODE_ENV`.

You may additionally manually trigger a one-time sync by using the following command:

```bash
pnpm run smartapi_sync
```

Note that this is only required for a local workspace, in a container syncing is handled automatically.

---

### Running the project

To start the server with debug logging, which outputs logging statements to the terminal in real time:

```
pnpm start
```

To run the server without debug logging:

```
pnpm run basic-start
```

#### Running the project with Redis

If you have a native installation or Docker image of Redis, the workspace provides a means of automatically starting the server alongside redis with default host/port configurations:

```
pnpm start redis
```

This will automatically start Redis (preferring a Docker container, and falling back to native installation), and then start the server ready to connect to redis. If an existing Redis container is running, or the native Redis is running, they will be reset (all keys dropped) before starting.

#### Stopping the server

After stopping BTE (or in order to stop it if it's running detached from the terminal), if you want to ensure related Redis instances are stopped:

```
pnpm stop
```

This will ensure the server and its subprocesses are killed, and will stop any Redis containers and native Redis servers.

#### Using VSCode's debugging

This repository intentionally includes a set of VSCode task and debug configs for ease-of-use.

If you want to run BTE with debug logging and async support, with VSCode's debugger attaching to BTE so you can set breakpoints, catch on errors, etc., Use "Run and Debug" > "Build w/ Cache" and hit the play button. A number of other configurations are supplied, you can explore them in [the launch.json file.](../.vscode/launch.json)

### Updating
In this base package (biothings_explorer), run the command `npm run pull`, which will pull the latest code from this module and all submodules. Note any warnings or errors in the console logs.


## Usage

Now that you have an instance of BTE up and running, you can POST queries to `http://<HOST>:3000/v1/query`. See [Usage](./USAGE.md) for more information.

Query Examples can be found [here](./examples).
