# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.3.0](https://github.com/biothings/BioThings_Explorer_TRAPI/compare/v2.2.0...v2.3.0) (2021-04-20)


### Features

* :sparkles: set a hard limit of 3s for all TRAPI APIs ([db96e0b](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/db96e0bc48dda0a345fac6500fcb8851516dc7ac))


### Bug Fixes

* :bug: disable Automat CTD due to poor perform ([3753b2c](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/3753b2cfe69b6c9ef2e82254fe688a039e4e73e3))
* :bug: fix wrong output type ([714f9ab](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/714f9abf81bd5735b2a011d9513a8b9347443adb))

## [2.2.0](https://github.com/biothings/BioThings_Explorer_TRAPI/compare/v2.1.0...v2.2.0) (2021-04-02)

## [2.1.0](https://github.com/biothings/BioThings_Explorer_TRAPI/compare/v2.0.1...v2.1.0) (2021-04-02)


### Features

* :sparkles: add /test/query endpoint to support user specified smartapi spec ([c75e44d](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/c75e44db6b79ccd2ef7b3f6f5cfd2cc448fd2814))
* :sparkles: add additional node attributes to knowledge graph ([4fb93e3](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/4fb93e37c8a16bc2ae9381747ba56a4e13aa33ed))
* :sparkles: add cron job to periodically pull from /predicates endpoint ([94461b1](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/94461b1a7c96b9b7ea66b4f5eb41f55b1a87dcb9))
* :sparkles: add num_of_participants property for pathway ([3d9f820](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/3d9f8209134a5625f2940500a65bf0fd277cb457))
* :sparkles: have bte only use a specified number of APIs ([7fa1732](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/7fa17323faa8e457a60a6df4dea508cc0489a061))
* :sparkles: support restricting /predicates to only api names provide ([9260ec9](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/9260ec969b4244f878f8a0a6c360b04a7dfde8dd))
* :sparkles: update local predicates file and smartapi specs ([425093e](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/425093ee3e96af0b969620805bf796ffe592a6fc))


### Bug Fixes

* :bug: add support for resolving protein ids ([500161a](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/500161ac8357cb89739da58189f73afd1f91cb58))
* :bug: fix api_response_transform bug ([4d911d6](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/4d911d6aa91120775b3d2b70c71fbd1a8e2feefb))
* :bug: fix cache related bug causing query failure ([3bd87ae](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/3bd87aec0283b12dfe1676e9fc7e2b57dd51c41e))
* :bug: fix id resolver failure issue ([eecbe4f](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/eecbe4f163d535a3a0f589d98fbdc0d76d8dd86d))
* :bug: fix missing biolink prefix issue ([153b601](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/153b6011641263bd1d420defa0c881b62b0741a2))
* :bug: fix typo ([5b32009](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/5b320097664afb438f6b9e2fc11b7dc232069b3e))
* :bug: fix wrong edge id in query results ([4bb1aa7](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/4bb1aa7e3e98da8cd713f89236840f91439d00cb))

### [2.0.1](https://github.com/biothings/BioThings_Explorer_TRAPI/compare/v2.0.0...v2.0.1) (2021-03-12)


### Bug Fixes

* :bug: fix wrong uniprot issuue ([92fac04](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/92fac04398329d3dec5d579ed5dcf1d397d515ee))

## [2.0.0](https://github.com/biothings/BioThings_Explorer_TRAPI/compare/v1.12.0...v2.0.0) (2021-03-09)


### Features

* :sparkles: have /query and /v1/query the same behavior ([2db1ff8](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/2db1ff8bd40de94b8d99935e58a711f42441cdf7))
* :sparkles: use redis to enable cacheing query results ([dd42583](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/dd42583b4a458d29a57007872779f33e6034b27b))


### Bug Fixes

* :bug: check semantic type match input type before creating bte edge ([2731602](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/2731602e8f033b71f033a7e98ff7d269fd4c6d34))
* :bug: fix wrong logic to determine if redis cache is enabled ([fdf71ab](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/fdf71ab29b35de00f24428763c7514ad2b4c874a))
* :bug: fix wrongly generated cache hash id ([49a9734](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/49a97348ad3d34b3becc358be01d45cef3c62e33))
* :bug: remove non-edge data from knowledge graph edge attributes ([500a66b](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/500a66bd948ca9cb59a64c04f5114fdfb5b90ceb))
* :bug: stringify all values of dbIDs ([0919e7d](https://github.com/biothings/BioThings_Explorer_TRAPI/commits/0919e7d45f5aa8c4dbe93bc62121d96b6e650a63))

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
