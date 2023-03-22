# Installation

The following are instructions on how to set up a local instance of Biothings Explorer, either [bare, for developmennt](#install), or [as a Docker container](#deploy).

_Note: these instructions have been updated to reflect usage in the [workspace](https://github.com/biothings/bte-trapi-workspace), which is required._

## Requirements

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

## Install

The following commands will get

```
$ git clone https://github.com/biothings/bte-trapi-workspace.git
$ cd bte-trapi-workspace
$ npm run clone
$ npm install || true && npm install
```

Note that installation must be run twice to ensure workspace interdependecies are installed properly. The last line simply ensures this is done without reporting ignorable failures.

## Running the project

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

### Simple build for production

```
$ npm build
```

## Deploy

A Dockerfile is included in the base directory of the [workspace](https://github.com/biothings/bte-trapi-workspace) and may be used to build and run the server in a container that simulates the production environment.

To build:

```bash
docker build --rm --force-rm --compress --squash -t biothings/bte-trapi .
```

_note: --squash requires experimental features to be enabled, however it may be omitted_

To run:

```bash
docker run -it --rm -p 3000:3000 --name bte-trapi biothings/bte-trapi
```

Run with debug logs enabled:

```bash
docker run -it --rm -p 3000:3000 --name bte-trapi -e DEBUG="biomedical-id-resolver,bte*" biothings/bte-trapi
```

The container may also be run with a redis-server running at a given host, which enables caching and use of the async endpoints:

```bash
docker run -it --rm -p 3000:3000 --name bte-t∞rapi  -e REDIS_HOST=host.docker.internal -e REDIS_PORT=6379 -e DEBUG="biomedical-id-resolver,bte*" biothings/
```

Log into the container:

```bash
docker exec -ti bte-trapi sh
```

The container can be built and started using docker-compose

```bash
docker-compose up
```

Public Docker image located at [here](https://hub.docker.com/repository/docker/biothings/bte_reasoner_api)

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
