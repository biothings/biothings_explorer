# What kinds of APIs does BTE use?

## Introduction

BTE does not depend on a static, big knowledge-graph of biomedical knowledge. Instead, it contains a constantly-updating "meta-knowledge graph" of the types of queries and biomedical knowledge served by various APIs. It queries those APIs to retrieve biomedical knowledge.

To build this meta-knowledge graph, BTE processes standard metadata on the API and its endpoints, which is located in the API's [SmartAPI-compliant yaml](https://github.com/SmartAPI/smartAPI-Specification/blob/OpenAPI.next/versions/3.0.0.md) and registered in the [SmartAPI registry](https://smart-api.info/registry). SmartAPI is an extension of the [OpenAPI standard](https://swagger.io/specification/). We use OpenAPI v3.

Notes:

* this readme gives some detail on the APIs and this step of the process. After the cron job described below, BTE further processes API metadata using this [package](https://github.com/biothings/smartapi-kg.js).
* BTE also uses APIs to handle specific tasks, like ID resolution (retrieving cross-mappings to other ID namespaces and labels / human-readable names) and scoring. Currently:
  * the [SRI Node Normalizer](https://nodenormalization-sri.renci.org/docs#/) is used to handle ID resolution
  * the [BioThings SEMMEDDB API](http://biothings.ncats.io/semmeddb/) (specifically the NGD `POST` endpoint, url [here](http://biothings.ncats.io/semmeddb/query/ngd))) is used for scoring

## Types of APIs

APIs fall into three categories:

* "TRAPI": these are made by members of the Translator consortium, and they use the consortium's standard for API endpoints and response formats called [TRAPI](https://github.com/NCATSTranslator/ReasonerAPI). To ingest these APIs, BTE uses their SmartAPI registration yaml metadata and the responses from `/meta_knowledge_graph` endpoints.
* "BioThings": these are made using the [BioThings SDK](https://docs.biothings.io/en/latest/). As a result, in almost all cases, they have a "standard" set of endpoints (`/query` `GET` and `POST`, `/metadata/fields`). To ingest these APIs, BTE uses their SmartAPI registration yaml metadata and special x-bte annotation on specific endpoints.
* "other": these are made by other labs, groups, consortia, etc. They do not necessarily follow the standards in the first two categories. To ingest these APIs, BTE uses their SmartAPI registration yaml metadata and special x-bte annotation on specific endpoints.

These categories are explained in more detail below.

## TRAPI

BTE only uses TRAPI-standard "knowledge provider" (KP) APIs that:

* have been registered in the [SmartAPI registry](https://smart-api.info/registry) AND
* listed in the [config file](https://github.com/biothings/biothings_explorer/blob/main/src/config/apis.js) AND
* respond to the latest cron job's query of the `/meta_knowledge_graph` endpoint (described below). These TRAPI KP APIs ideally are on the same TRAPI version as BTE.

The TRAPI-standard APIs use a specific format to query their [`/query`](https://github.com/NCATSTranslator/ReasonerAPI/blob/e39886c54fff24b41d9e9f43353a31c3fc591b19/TranslatorReasonerAPI.yaml#L171) (or `/asyncquery`) endpoints. They also provide standard metadata on the kinds of associations they have in their `/meta_knowledge_graph` endpoint responses. BTE uses the response from the API's `/meta_knowledge_graph` endpoint to write templated queries to the API.

To ingest this kind of API, BTE checks the SmartAPI registry regularly during its [cron job](https://github.com/biothings/biothings_explorer/blob/main/src/controllers/cron/update_local_smartapi.js). It searches for APIs with specific metadata:

* `info.x-translator.component` == "KP"
* `paths` has `/query` and `/meta_knowledge_graph` endpoints
* `info.x-trapi` exists
* the API's SmartAPI registry ID isn't in [this list of exclusions](https://github.com/biothings/biothings_explorer/blob/main/src/config/smartapi_exclusions.js)
* the TRAPI version in `info.x-trapi.version` is usable by BTE (currently we allow 1.1 and 1.2)

BTE then sends a `GET` request to those APIs' `/meta_knowledge_graph` endpoints to (1) check that they are working and (2) retrieve up-to-date, standard metadata on what kinds of associations are in those APIs.

## BioThings

### What BioThings APIs are

The Su / Wu Labs create many APIs using the [BioThings SDK](https://docs.biothings.io/en/latest/) they developed. As a result, these APIs have a "standard" set of endpoints (`/query` `GET` and `POST`, `/metadata/fields`) and they do not follow the Translator consortium's TRAPI standard. Note that BioThings APIs can be created or maintained by other labs. Currently, we don't use a BioThings API that is completely independent from the Su / Wu Labs.

The [core BioThings APIs](https://biothings.io/) serve many users besides the Translator consortium. The parsers used to make these APIs are [publically available on Github](https://github.com/biothings).

There are also [APIs that are made specifically for the Translator consortium or as "stand-alone" services that may later be incorporated into the core BioThings APIs](https://biothings.ncats.io/). Some of these APIs are made by the Wu Lab (aka the Service Provider group in Translator) in collaboration with other teams in the Translator consortium; these APIs therefore have data elements related to Translator's standards (semantic terms from the [biolink-model](https://github.com/biolink/biolink-model), TRAPI edge-attributes, etc). These APIs have parsers that may be in the [pending biothings github repo](https://github.com/biothings/pending.api/tree/master/plugins) or in a collaborator's github repo.

Notes for BioThings APIs:

* they have a [specific transformer](https://github.com/biothings/api-respone-transform.js/blob/main/src/transformers/biothings_transformer.ts)
* they generally have a limitation regarding the size of the response:
  * 1000000 (10^6) records can be retrieved by 1 `POST` query. BioThings APIs also expect a maximum of 1000 identifiers in 1 `POST` query, so it has a limit of 1000 records returned per identifer...
  * We can try modifying these limits on per-API basis. Also, BTE has a [config](https://github.com/biothings/bte_trapi_query_graph_handler/blob/main/src/config.js) to set custom limits on the number of identifiers sent in a query to an API.

## How BTE ingests APIs with x-bte annotation

For BTE to use these APIs, they must be registered to the SmartAPI registry with special metadata:

* the document must have a [`translator` tag](https://github.com/biothings/biothings_explorer/blob/3b730a5e600397d75be832f3c53b5b185e1015a5/src/controllers/cron/update_local_smartapi.js#L155). See [example](https://github.com/NCATS-Tangerine/translator-api-registry/blob/c4d4c9db5632d258293755815ff042bb42bdbf9a/mydisease.info/smartapi.yaml#L27) and OpenAPI's [standard](https://swagger.io/specification/#schema) on tags.
* the document must have x-bte annotation on >= 1 endpoints. An endpoint can be queried with >= 1 identifiers (IDs, for specific biomedical concepts), which will retrieve other biomedical concepts (with IDs) that it is associated with.
* currently, the document [must have a property under the `components` section of the OpenAPI doc, and that property's name starts with "x-bte"](https://github.com/biothings/biothings_explorer/blob/3b730a5e600397d75be832f3c53b5b185e1015a5/src/controllers/cron/update_local_smartapi.js#L155). Because x-bte information can be lengthy, we use [x-refs](https://json-schema.org/understanding-json-schema/structuring.html#ref) in the endpoint's annotation section and put the full stuff under `components`.

For most of BTE's endpoints ("general" `/query` and `/asyncquery` endpoints and "team-specific" endpoints that have `v1/team/` in their url), BTE will only use the APIs listed in the [config file](https://github.com/biothings/biothings_explorer/blob/main/src/config/apis.js). Additionally, for the team-specific endpoints, BTE will query all APIs that have a matching value in the `info.x-translator.team` section of the SmartAPI registration yaml. The accepted values are "Multiomics Provider", "Text Mining Provider", and "Service Provider".

For the API-specific BTE endpoints (have `v1/smartapi/` in their url), BTE will allow any valid SmartAPI ID (from the registry or local testing using [this](https://github.com/biothings/biothings_explorer/blob/main/src/config/smartapi_overrides.json))...as long as it isn't listed in [this variable](https://github.com/biothings/biothings_explorer/blob/d33fd406c4a0f6214a04643c8d24f4f5cbd6cedb/src/config/apis.js#L248).

We write and store many of the SmartAPI registration yamls in this github [repo](https://github.com/NCATS-Tangerine/translator-api-registry ) (which was originally started for Translator).

BTE queries the SmartAPI registry during its [cron job](https://github.com/biothings/biothings_explorer/blob/main/src/controllers/cron/update_local_smartapi.js#L155) and retrieves the metadata for the APIs that fulfill the requirements above. It then parses the x-bte annotation to know how to query the APIs to retrieve information.

### what is the x-bte annotation format?

The format of x-bte annotation will be described later...These are some good starting examples.

* BioPlanet pathway-disease: annotation [on `/query POST` endpoint](https://github.com/NCATS-Tangerine/translator-api-registry/blob/6af7db52deaeb5bebcf63fcccbffac9a38ae1df8/bioplanet/bioplanet-pathway-disease.yaml#L243) , [x-bte operations section](https://github.com/NCATS-Tangerine/translator-api-registry/blob/6af7db52deaeb5bebcf63fcccbffac9a38ae1df8/bioplanet/bioplanet-pathway-disease.yaml#L439) (uses latest format for "templated" querying, but is simple)
* BioThings dgidb API: annotation [on `/query POST` endpoint](https://github.com/NCATS-Tangerine/translator-api-registry/blob/050a5e9e9bc6b3991d72d1f63ddfd2447c8aaa28/dgidb/openapi.yml#L240), [x-bte operations section](https://github.com/NCATS-Tangerine/translator-api-registry/blob/050a5e9e9bc6b3991d72d1f63ddfd2447c8aaa28/dgidb/openapi.yml#L476) (uses latest format for "templated" querying, but is more complicated)
* Biolink (Monarch) api (not BioThings or TRAPI): has annotation on each endpoint described, look [here](https://github.com/NCATS-Tangerine/translator-api-registry/blob/050a5e9e9bc6b3991d72d1f63ddfd2447c8aaa28/biolink/openapi.yml#L787) for x-bte annotation

(it would help to build a json-schema for it...)

### can we tell if an API is down?

We can look at the SmartAPI registration. The Registry tets the endpoints once a day (around midnight?) using the endpoint examples specified in the SmartAPI yamls.

## Other

These are APIs that do not follow the TRAPI standard and are not developed using the BioThings SDK. They have a variety of formats for endpoints, queries, responses, and biomedical concept IDs. At the moment, we don't have an easy way to tell when the underlying API has an update, change to its format, or is deprecated.

For BTE to use these APIs, [we sometimes need to write custom "transformers" to pre-process the raw API responses](https://github.com/biothings/api-respone-transform.js/tree/main/src/transformers). They also must be registered to the SmartAPI registry with special metadata (see the "How BTE ingests APIs with x-bte annotation" section above). This means that we often write a custom SmartAPI yaml for this API and register it ourselves, and we keep those yamls in [this github repo](https://github.com/NCATS-Tangerine/translator-api-registry). Otherwise, we need to contact the responsible group for the API, ask for modifications to their SmartAPI yaml registration, and ask them to keep it up-to-date.

Note:

* Other APIs generally have performance limits that are more restrictive than BioThings APIs. For example: how often they can be queried, how many identifiers can be sent in one query, how large of a response can be returned in one query, etc.
