# BioThings Explorer TRAPI API
[![Test Coveralls](https://github.com/biothings/BioThings_Explorer_TRAPI/actions/workflows/test.yml/badge.svg)](https://github.com/biothings/BioThings_Explorer_TRAPI/actions/workflows/test.yml)
[![Coverage Status](https://coveralls.io/repos/github/biothings/BioThings_Explorer_TRAPI/badge.svg)](https://coveralls.io/github/biothings/BioThings_Explorer_TRAPI)
[![ci-cd](https://github.com/biothings/BioThings_Explorer_TRAPI/actions/workflows/deploy.yml/badge.svg)](https://github.com/biothings/BioThings_Explorer_TRAPI/actions/workflows/deploy.yml)

## Introduction

This GitHub repo serves as the development repo for the TRAPI API implementation of **BioThings Explorer (BTE)**. BTE is an engine for autonomously querying a distributed knowledge graph. The distributed knowledge graph is made up of biomedical APIs that have been annotated with semantically-precise descriptions of their inputs and outputs in the [SmartAPI registry](https://smart-api.info/). This project is primarily funded by the [NCATS Translator project](https://ncats.nih.gov/translator).  There is also an older [python version of BioThings Explorer](https://github.com/biothings/biothings_explorer) that is currently not being actively developed.

An older version of the meta knowledge graph that is consumed by BTE is in this figure (which, although older, gives a nice conceptual visualization of API interoperability):

![BTE Meta-KG](diagrams/smartapi_metagraph.png "BioThings Explorer metagraph")

### What's TRAPI?

TRAPI stands for [Translator Reasoner API](https://github.com/NCATSTranslator/ReasonerAPI). It is a standard defined for APIs developed within NCATS Biomedical Translator project to facilitate information exchange between resources.  BTE exports results via TRAPI to maintain interoperability with other Translator tools.  BTE can also _consume_ knowledge resources that expose the TRAPI interface, but it also can consume APIs that have been annotated in the [SmartAPI registry](https://smart-api.info/) using the [x-bte extension](https://x-bte-extension.readthedocs.io/en/latest/index.html) to the OpenAPI specification.

### Live TRAPI Instance

We maintain a live instance of this application at https://api.bte.ncats.io/ that can be used for testing.  Query Examples can be found [here](/examples).


---


## Local installations

### Requirements

For development, you will only need Node.js and a node global package, e.g. npm, installed in your environment. Your Node version must be higher than v12.


- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems

  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v12.*.*

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

`$ npm install npm -g`

---

### Installation

    $ git clone https://github.com/biothings/BioThings_Explorer_TRAPI
    $ cd BioThings_Explorer_TRAPI
    $ npm install


### Running the project

    $ npm start

To enable debug mode, which outputs logging statements to the terminal in real time:

`$ DEBUG=biothings-explorer-trapi:* npm start`

`$ DEBUG=biothings-explorer-trapi:*,smartapi-kg:*,call-apis:*,biomedical-id-resolver:* npm start` (also outputs debug statements from dependencies)

By default, the `/v1/query` endpoint only supports 3 queries per min, you could modify this behavior by setting MAX_QUERIES_PER_MIN environment variable when starting the service

`$ MAX_QUERIES_PER_MIN=5 npm start`

### Simple build for production

    $ npm build

### Deploy

A docker file is included in the base directory and can be used to build the customized container

```bash
docker build -t bte_reasoner_api .
```

Container can be built and started using docker-compose

```bash
docker-compose up
```

Public Docker image located at [link](https://hub.docker.com/repository/docker/biothings/bte_reasoner_api)

### Usage

You now can POST queries to `http://<HOST>:3000/v1/query`.

Query Examples can be found [here](/examples).


### Testing with Alternate SmartAPI Specs (local or hosted)

#### Using `API_OVERRIDE=true`

You may configure a set of API IDs to override from local files or URLs.

If the environment variable `API_OVERRIDE=true` is set (e.g. `API_OVERRIDE=true npm run debug --workspace=@biothings-explorer/bte-trapi`), then `/config/smartapi_overrides.json` is checked at server start and overrides are applied, as well as during subsequent `smartapi_specs.json` updates.

Override files may be specified as a URL which returns the expected yaml file, a `file:///` URL which will search with the `data` folder as the root directory, or an arbitrary filepath. Regardless, override files are expected to be in yaml format. If overrides are specified with IDs not in the current SmartAPI spec, they will be appended as new API hits with a log warning.

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
    "8f08d1446e0bb9c2b323713ce83e2bd3": "file:///mychem_test.yaml"
  }
}
```

#### Using `/test/query`

*This method is deprecated, and may be subject to removal in the future.*

The TRAPI interface has `/test/query` endpoint which uses a SmartAPI spec stored at **test** folder named **smartapi.json**

If you would like to use the `/test/query` endpoint to test a local SmartAPI spec, you can mount the your local folder containing the SmartAPI spec to the folder **/home/node/app/test** in the container. [Note: The SmartAPI spec must be named **smartapi.json**]

You could do so using the following commands:

First pull the biothings/bte_reasoner_api image from Docker Hub:
`docker pull biothings/bte_reasoner_api`

Then, Run the image and mount your local smartapi spec folder

`docker run -p 3000:3000 -v [local_folder_contain_smartapi_spec]:/home/node/app/test -d biothings/bte_reasoner_api`

Now, you should be able to test your local smartapi using POST queries at:

`http://localhost:3000/test/query`

### Asynchronous queries

You can also use our asynchronous query which supports webhooks.
You can do the following:

POST on `http://localhost:3000/asyncquery`. This endpoint behaves similarly to the `http://localhost:3000/query` endpoint.

**Key differences**
- Instead of waiting for the query to complete an *id* is returned which you can then use to check the query status.
- An additional *callback_url* parameter can be used which we will use to perform a POST request to send the data to. (optional)

**Checking the query status**

You can perform a POST request to the `http://localhost:3000/check_async_query/<id>` to check the query status.
Example response:

```
{
  'id': '1', 
  'state': 'completed', 
  'returnvalue': {
    'response': { ... },
    'status': 200,
    'callback': 'Data sent to callback_url'
  }, 
  'progress': 0
}
```

### Testing on a specific SmartAPI API

By default, BTE queries all APIs specified in the the[ config.js file](https://github.com/biothings/BioThings_Explorer_TRAPI/blob/main/src/routes/v1/config.js).  In some cases, you may want to override that default to specifically query a single API.  For example, the SmartAPI record for the "EBI Proteins API) is [43af91b3d7cae43591083bff9d75c6dd](https://smart-api.info/registry?q=43af91b3d7cae43591083bff9d75c6dd). To instruct BTE to query that API only, you can POST your query to http://localhost:3000/v1/smartapi/43af91b3d7cae43591083bff9d75c6dd/query
