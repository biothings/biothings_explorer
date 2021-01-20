# BioThings Explorer TRAPI
[![Coverage Status](https://coveralls.io/repos/github/kevinxin90/single-hop-app.js/badge.svg?branch=master)](https://coveralls.io/github/kevinxin90/single-hop-app.js?branch=master)


# Project Title

BioThings Explorer Reasoner API

---
## Requirements

For development, you will only need Node.js and a node global package, e.g. npm, installed in your environement.

### Node
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
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g


---

## Install

    $ git clone https://github.com/biothings/single-hop-app.js
    $ cd single-hop-app.js
    $ npm install


## Running the project

    $ npm start

## Simple build for production

    $ npm build

## Deploy

A docker file is included in the base directory and can be used to build the customized container

```bash
docker build -t bte_reasoner_api .
```

Container can be built and started using docker-compose

```bash
docker-compose up
```

Public Docker image located at [link](https://hub.docker.com/repository/docker/biothings/bte_reasoner_api)

## Usage

`http://<HOST>:3000`
