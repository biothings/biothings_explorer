# Installation

BTE can be used locally using Docker, or by installing the workspace for further tinkering and development.

## Using Docker

Docker is a program that handles standardized virtual software environments. Put simply, it solves the problem of "Well, it works on my system!" by letting us hand you a bare-bones virtual system on which our code _does work_ so that you don't have to worry about requirements, compatibilities, etc.

### Requirements

#### Installing Docker

Docker Desktop is relatively easy to install, [you can find the instructions here.](https://docs.docker.com/get-docker/)

On Windows, Docker will require Windows Subsystem For Linux version 2 as a backend. In order to install this properly, there are a few steps:

- Ensure that you've enabled virtualization in your machine's UEFI/BIOS
- Follow [Microsoft's instructions for installing WSL2.](https://learn.microsoft.com/en-us/windows/wsl/setup/environment) You can stop after the 'Update and upgrade packages' section.
- From here, follow the [Docker instructions to install Docker Desktop on Windows.](https://docs.docker.com/desktop/install/windows-install/#install-docker-desktop-on-windows)

#### Docker Compose

If you're building your own image from the repository, you might want Docker Compose to make use of our easy compose file. If you've installed Docker Desktop, Docker Compose should already be on your system. Otherwise, you'll want to see [Docker's instructions on installing Docker Compose.](https://docs.docker.com/compose/install/)

### Using Docker Compose

BTE provides a [docker-compose.yml](../docker-compose.yml) file, which will automatically handle building and running your own BTE image:

```bash
docker-compose up --build
```

This will build an image of BTE, pull an image of Redis, and then start the two in concert as if BTE were running on a production server. After the first time running, you can omit the `--build` option to avoid rebuilding the image every time.

### Manually building an image

If you'd prefer to build an image on your own terms, you can use our Dockerfile directly:

```bash
docker build --rm --force-rm --compress -t biothings/bte-trapi .
```

### Running

After building a BTE image, you can run standalone it any time:

```bash
docker run -it --rm -p 3000:3000 --name bte-trapi biothings/bte-trapi
```

Note that this will run BTE standalone, without Redis, which will disable BTE's asynchronous endpoints and caching features. To start a Redis container and start a BTE container connected to it:

```bash
docker run --name test-redis -p 6379:6379 -d --hostname=redis:latest redis bte-redis
docker run -it --rm -p 3000:3000 --name bte-trapi -e REDIS_HOST=host.docker.internal -e REDIS_PORT=6379 biothings/bte-trapi
```

You may wish to add `-e DEBUG="biomedical-id-resolver,bte*"` to enable BTE's debug logging.

## NodeJS Workspace Installation

If you'd prefer to get BTE working outside of a container, for development or any other reason, the installation has a few more requirements but is still a relatively simple afair.

### Requirements

For development, you will need Node.js and a node global package, e.g. npm, installed in your environment. Your Node version must be higher than v12.

- ### Node.js and NPM

  - #### Install Node on Windows

    Just go on [official Node.js website](https://nodejs.org/) and download the installer.
    Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

  - #### Install Node on Ubuntu

    You can install nodejs and npm easily with apt install, just run the following commands.

    ```bash
    sudo apt install nodejs
    sudo apt install npm
    ```

  - #### Other Operating Systems

    You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

    Note that BTE uses the npm workspace feature, which requires npm 7+. It's recommended to use node v15+, which comes with npm v7.
    You may consider using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to install a newer version of node.

  If the installation was successful, you should be able to run the following command.

  ```
  $ node --version
  v12.*.*

  $ npm --version
  7.24.2
  ```

  If you need to update `npm`, you can make it using `npm`! Cool right? After running `npm install npm -g`, just open again the command line and be happy.

- ### Additional Requirements:

  #### Ubuntu:

  ```bash
  sudo apt install lz4 python3 make g++
  ```

  #### MacOS will require the XCode Command Line Tools and [Homebrew](https://brew.sh/):

  ```
  xcode-select --install
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  ```

  After installing brew, you can install the remaining dependencies:

  ```
  brew install lz4 python3 make
  ```

### Install

The following commands will get

```
$ git clone https://github.com/biothings/bte-trapi-workspace.git
$ cd bte-trapi-workspace
$ npm run clone
$ npm install || true && npm install
```

Note that installation must be run twice to ensure workspace interdependecies are installed properly. The last line simply ensures this is done without reporting ignorable failures.

### Running the project

To start the server with debug logging, which outputs logging statements to the terminal in real time:

```
npm start
```

To run the server without debug logging:

```
npm start --workspace='@biothings-explorer/bte-trapi'
```

By default, the `/v1/query` endpoint allows 15 queries per min, you could modify this behavior by setting MAX_QUERIES_PER_MIN [environment variable](./USAGE.md#environment-variables) when starting the service.

```
$ MAX_QUERIES_PER_MIN=5 npm start`
```

### Running the project with redis

If you have a native installation of redis, or a Docker image of the latest redis (`docker pull redis:latest`), the workspace provides a means of automatically starting the server alongside redis with default host/port configurations:

```
npm start redis
```

This will automatically start redis (preferring a Docker container, and falling back to native installation), and then start the server ready to connect to redis.

### Stopping the server

Should the server need to be stopped in the middle of an asynchronous request, or is otherwise misbehaving:

```
npm stop
```

This will ensure the server and its subprocesses are killed.

## Usage

You now can POST queries to `http://<HOST>:3000/v1/query`. See [Usage](./USAGE.md) for more information.

Query Examples can be found [here](/examples).

## Syncing SmartAPI Specifications

By default, this package does not automatically sync the latest SmartAPI Specifications. You may set it to do so by setting either `NODE_ENV=production` or `SMARTAPI_SYNC=true` as environment variables (e.g. `SMARTAPI_SYNC=true npm start`). `SMARTAPI_SYNC` overrides the behavior of `NODE_ENV`.

You may additionally manually trigger a one-time sync by using the following command:

```bash
npm run smartapi_sync
```

## Testing with Alternate SmartAPI Specs (local or hosted)

### Using API Overrides

You may configure a set of API IDs to override from local files or URLs.

If the environment variable `API_OVERRIDE=true` is set (see example below), then [src/config/smartapi_overrides.json](../src/config/smartapi_overrides.json) is checked at server start and overrides are applied, as well as during subsequent `smartapi_specs.json` updates. Note that syncing must be enabled (`SMARTAPI_SYNC=true`) in order for `API_OVERRIDE` to take effect while BTE is running.

Starting BTE with API Overrides and automatic syncing enabled:

```bash
SMARTAPI_SYNC=true API_OVERRIDE=true npm run debug --workspace='@biothings-explorer/bte-trapi'
```

Alternatively, you may choose to only get `smartapi_specs.json` and apply overrides once, removing the requirement of enabling `SMARTAPI_SYNC` while running the server:

```bash
API_OVERRIDE=true npm run smartapi_sync --workspace='@biothings-explorer/bte-trapi'
```

Override files may be specified as a URL which returns the expected yaml file or a `file:///` URI or arbitrary filepath, either of which must contain the absolute path to your override file. Regardless, override files are expected to be in yaml format. If overrides are specified with IDs not in the current SmartAPI spec, they will be appended as new API hits with a log warning.

You may also set `only_overrides` to `true` in the config to remove all other APIs and keep only the specified overrides.

Example:

Replace the latest MyGene.info API with a specific revision, and the MyChem.info API with a local test version:

```JSON
{
  "conf": {
    "only_overrides": false
  },
  "apis": {
    "59dce17363dce279d389100834e43648": "https://raw.githubusercontent.com/NCATS-Tangerine/translator-api-registry/8b36f46d59c82d19b5cba40421a6ca9c2ed62e6b/mygene.info/openapi_full.yml",
    "8f08d1446e0bb9c2b323713ce83e2bd3": "file:///absolute/path/to/file/mychem_test.yaml"
  }
}
```

### API Overrides with Docker container

You may wish to use a container to test your custom API/annotations. After making changes to your override list (example above) you will need to rebuild the container:

```bash
docker build --rm --force-rm --compress --squash -t biothings/bte-trapi .
```

_note: --squash requires experimental features to be enabled, however it may be omitted_

To run the container with overrides and debug logging enabled:

```bash
docker run -it --rm -p 3000:3000 --name bte-trapi -e DEBUG="biomedical-id-resolver,bte*" -e API_OVERRIDE=true biothings/bte-trapi
```
