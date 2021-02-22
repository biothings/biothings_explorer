# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.12.0](https://github.com/biothings/BioThings_Explorer_TRAPI/compare/v1.11.0...v1.12.0) (2021-02-19)


### Features

* :sparkles: adapt to new output from id resolver module ([1b7d1b8](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/1b7d1b8519b2990b0f7b6b42e1115aa97e22015e))


### Bug Fixes

* :bug: add missing next parameter ([d943307](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/d9433077038a72392f3e93f6a75f8d64e96d76be))
* :bug: fix /performance endpoint not working issue ([6f59473](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/6f59473c3155e3b19727cc26aab6babe6b8ea821))
* :bug: fix wrong generate curie logic ([8c0e585](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/8c0e585a8706d5cd0dfcdeb35ef29f0b043bb1cc))

### [1.11.1](https://github.com/biothings/BioThings_Explorer_TRAPI/compare/v1.11.0...v1.11.1) (2021-02-19)

## [1.11.0](https://github.com/biothings/BioThings_Explorer_TRAPI/compare/v1.10.0...v1.11.0) (2021-02-09)


### Features

* :sparkles: run cron job in expressjs event loop ([d2d44bc](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/d2d44bc584583947d6cfad796e13cf7e55ff0588))
* :sparkles: set cron job to pull smartapi spec from API every 10 mins ([8f8dbe1](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/8f8dbe1c1ede0e492ac75157be6c0aa501b14382))
* :sparkles: update metakg endpoint to read from local copy of SmartAPI specs ([c5f40d0](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/c5f40d0dfb9966812acfd46356c394cb82fb9b20))

## [1.10.0](https://github.com/biothings/BioThings_Explorer_TRAPI/compare/v1.9.2...v1.10.0) (2021-02-02)


### Features

* :sparkles: add debug and log for qedge2bteedge module ([abc9265](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/abc92651f9869a566d0e092dcaec1ecf10361060))
* :sparkles: add debug message for nodeUpdateHandler module ([6cf9b5d](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/6cf9b5dc9b75f0845acd49236f9021bb852679c2))
* :sparkles: look for symmetric predicate if qEdge is reversed ([a167345](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/a1673454c396b196c1d6970a65fe67468802e057))
* :sparkles: support edge reversal ([862560d](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/862560daa9da0005dd85fdd5612e72ce5364e0f4))


### Bug Fixes

* :bug: check if user provided predicate is undefined ([56eb1fe](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/56eb1feed819ea4c682c7700602796a663f85ff0))
* :bug: modify query predicate to fit biolink json file ([fc91a31](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/fc91a318c7e218bcf2e37351e3f1921ab970a0cc))
* :bug: synchronize the predicate in kg with the qg ([658aa43](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/658aa434b0efa035cbd79053cbe76a36be132b21))
* :bug: terminate the query if one of the critical intermediate step return empty results ([15ee30a](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/15ee30aef234ebe20ca45372fe5d349ee88a2ed0))
* :bug: use predicate from api if no predicate supplied in qg ([a073f99](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/a073f9959c8a3c2f7fdda8fe0c83768d125e943f))

### [1.9.2](https://github.com/biothings/BioThings_Explorer_TRAPI/compare/v1.9.1...v1.9.2) (2021-02-01)


### Bug Fixes

* :bug: fix issue regarding missing type information for node attributes ([7cf6119](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/7cf61195a7e0dac0f6615e2e7f97defbba365e57))

### [1.9.1](https://github.com/biothings/BioThings_Explorer_TRAPI/compare/v1.9.0...v1.9.1) (2021-01-27)


### Bug Fixes

* :bug: fix CHANGELOG bug ([f72c660](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/f72c660e7afd6fdeec8f4092478b1683b9bdfcb2))
* :bug: fix wrong url in CHANGELOG and autogenerate tools ([f927d5e](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/f927d5ea3a73b24951c9a195d5522d7965e00e19))

## [1.9.0](https://github.com/biothings/BioThings_Explorer_TRAPI/compare/v1.4.0...v1.9.0) (2021-01-26)


### Features

* :sparkles: disable id resolution module for text mining KPs ([f3f5067](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/f3f506759c54386fc8394d27b3240a7327b2317b))
* :sparkles: include call apis error message in log ([4ff93b0](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/4ff93b0362b31c06927e489bfd8a442b015d4bd3))


### Bug Fixes

* :bug: Fix issue related to publication extraction ([cfe3c3c](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/cfe3c3c0366eef8962dccd8b810b0ec6abf5b067))

## [1.8.0](https://github.com/biothings/BioThings_Explorer_TRAPI/compare/v1.4.0...v1.8.0) (2021-01-26)



### Features

* :sparkles: include call apis error message in log ([4ff93b0](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/4ff93b0362b31c06927e489bfd8a442b015d4bd3))


### Bug Fixes

* :bug: Fix issue related to publication extraction ([cfe3c3c](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/cfe3c3c0366eef8962dccd8b810b0ec6abf5b067))

## [1.7.0](https://github.com/biothings/BioThings_Explorer_TRAPI/compare/v1.4.0...v1.7.0) (2021-01-26)


### Features

* :sparkles: include call apis error message in log ([4ff93b0](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/4ff93b0362b31c06927e489bfd8a442b015d4bd3))


### Bug Fixes

* :bug: Fix issue related to publication extraction ([cfe3c3c](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/cfe3c3c0366eef8962dccd8b810b0ec6abf5b067))

## [1.6.0](https://github.com/biothings/BioThings_Explorer_TRAPI/compare/v1.4.0...v1.6.0) (2021-01-26)


### Features

* :sparkles: include call apis error message in log ([4ff93b0](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/4ff93b0362b31c06927e489bfd8a442b015d4bd3))


### Bug Fixes

* :bug: Fix issue related to publication extraction ([cfe3c3c](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/cfe3c3c0366eef8962dccd8b810b0ec6abf5b067))

## [1.5.0](https://github.com/biothings/BioThings_Explorer_TRAPI/compare/v1.4.0...v1.5.0) (2021-01-26)


### Features

* :sparkles: include call apis error message in log ([4ff93b0](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/4ff93b0362b31c06927e489bfd8a442b015d4bd3))

## [1.4.0](https://github.com/biothings/BioThings_Explorer_TRAPI/compare/v1.3.0...v1.4.0) (2021-01-26)


### Features

* :sparkles: Enable logging for call-apis module ([406a62b](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/406a62b64e3cd0e1d961782f27e39485b90ded25))

## [1.3.0](https://github.com/biothings/BioThings_Explorer_TRAPI/compare/v1.1.1...v1.3.0) (2021-01-26)


### Features

* :sparkles: Enable BTE TRAPI to query SmartAPI on real time ([be00d80](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/be00d804af9a93d1f84f4cbb968160c62fd3fbd2))


### Bug Fixes

* :bug: change log level to warning if no smartapi edge found ([082759f](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/082759f0c5abc51e3a3b8f2700a82f2c4a86e60c))
* :bug: Display correct log message based on whether smartapi edges are found or not ([54cf072](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/54cf0722076201bfeb617749986e478e552597b0))
* added jenkinsfile ([b35c484](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/b35c48408872c4686120715daa3f7f4e146a72cc))
* update the image name ([77c74f7](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/77c74f72e0d8505b26b7b95eb8ddb03bb19a9fbe))

## [1.2.0](https://github.com/biothings/BioThings_Explorer_TRAPI/compare/v1.1.1...v1.2.0) (2021-01-26)


### Features

* :sparkles: Enable BTE TRAPI to query SmartAPI on real time ([be00d80](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/be00d804af9a93d1f84f4cbb968160c62fd3fbd2))


### Bug Fixes

* added jenkinsfile ([b35c484](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/b35c48408872c4686120715daa3f7f4e146a72cc))
* update the image name ([77c74f7](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/77c74f72e0d8505b26b7b95eb8ddb03bb19a9fbe))

### [1.1.1](https://github.com/biothings/BioThings_Explorer_TRAPI/compare/v3.6.11...v1.1.1) (2021-01-25)


### Bug Fixes

* :bug: change teamName to team_name for api input ([95e71ce](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/95e71cef9f66c34a995dad8a57ffd249dde31971))
