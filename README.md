# BioThings Explorer TRAPI API
[![Build Status](https://travis-ci.com/kevinxin90/BioThings_Explorer_TRAPI.svg?branch=master)](https://travis-ci.com/kevinxin90/BioThings_Explorer_TRAPI)
[![Coverage Status](https://coveralls.io/repos/github/kevinxin90/BioThings_Explorer_TRAPI/badge.svg?branch=master)](https://coveralls.io/github/kevinxin90/BioThings_Explorer_TRAPI?branch=master)

## Introduction

This GitHub repo serves as the development repo for the TRAPI API implementation of BioThings Explorer.

### What's BioThings Explorer

BioThings Explorer aims at helping users querying and linking results from a variety of biomedical relevant APIs through one interface. The project is funded by the [NCATS Translator project](https://ncats.nih.gov/translator).

### What's TRAPI

TRAPI stands for [Translator Reasoner API](https://github.com/NCATSTranslator/ReasonerAPI). It is a standard defined for APIs developed within NCATS Biomedical Translator project to allow easy information exchange among them.

### Our TRAPI Interface

Please visit our TRAPI API landing page [here](http://bte_trapi.smart-api.info/).


### Some Query Examples

Query Examples can be found [here](https://github.com/kevinxin90/BioThings_Explorer_TRAPI/tree/master/examples).

---


## Current Development Status

Currently, the BioThings Explorer TRAPI API implements TRAPI v1.0.0 standard, and can be queried at https://api.bte.ncats.io/v1/query endpoint.


The TRAPI v0.9.2 standard is deprecated. But it can still be tested using https://api.bte.ncats.io/query endpoint.

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

`$ npm install npm -g`

---

## Install

`$ git clone https://github.com/biothings/BioThings_Explorer_TRAPI`
`$ cd BioThings_Explorer_TRAPI`
`$ npm install`


## Running the project

`$ npm start`

## Simple build for production

`$ npm build`

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
