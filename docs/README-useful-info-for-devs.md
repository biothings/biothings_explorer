## BTE development guidelines

### Getting started
* install from [bte-trapi-workspace](https://github.com/biothings/bte-trapi-workspace#bte-trapi-workspace). You may need to run `npm i` twice (first time will have an error). 
* [vocab](https://github.com/biothings/BioThings_Explorer_TRAPI/issues/379#issuecomment-1068057622) (expand the table in the linked comment) 
* diagram of what happens during a query in the [README](https://github.com/biothings/BioThings_Explorer_TRAPI#trapi-api-implementation) of BTE's main repo

### Policies
* name branches in different repos the same if they're part of the same feature update

### Running BTE

* To get console logs in close-to-real-time, you can use `USE_THREADING=false npm start` to run your local instance

## BTE links

* ITRB prod: https://bte.transltr.io/v1
* ITRB test: https://bte.test.transltr.io/v1
* ITRB ci / staging: https://bte.ci.transltr.io/v1
* non-ITRB dev: https://api.bte.ncats.io/v1

Query the ARA by sending TRAPI Query to .io/v1/query or .io/v1/asyncquery. We can also query as a KP / query specific KPs. Read the SmartAPI yaml for BTE!
* [Process of setting up a TRAPI query](https://suwulab.slack.com/archives/CC218TEKC/p1644352727203369) with useful links 


* ITRB Production and Test are deployed manually, and are based on the last image of the CI/staging instance (so we want to make sure changes are live there first). 
    * we message ITRB folks (currently Pouyan Ahmadi or Ke Wang) and ask them to deploy to test/prod. 
* ITRB CI / staging is basically deployed manually, from main branches. 
    * go to your local instance of bte-trapi-workspace. Be on the main branch. 
    * run `npm run get_rev > prod_revisions.txt`
    * commit the changes (there should be one to the prod_revisions.txt file) to bte-trapi-workspace's main branch
    * wait ~5 min for changes to be active on CI instance
* non-ITRB dev: total manual control on updates (what branches of modules are used for updates). Can run demotests on this instance to check how PRs affect a variety of queries (performance, number of nodes/edges/results, etc). 

## UI and ARS links

UIs: 
* [MVP](http://transltr-bma-ui-dev.ncats.io)
* ARAX: arax.ncats.io (better), arax.ci.transltr.io

ARS (links go to actors so we can see what instance of BTE is being used):
* prod: https://ars-prod.transltr.io/ars/api/actors
* test: https://ars.test.transltr.io/ars/api/actors
* ci / staging: https://ars.ci.transltr.io/ars/api/actors
* dev: https://ars.transltr.io/ars/api/actors

Query by sending TRAPI Query to .io/ars/api/submit

[Old Translator guidance](https://docs.google.com/document/d/1_a4gE_lY-2oZTrdFMtaZ_pxqNgd-x_1ZYI7hRGfFjng/edit) on how to query the ARS

## Translator tools

* [SRI Node Normalizer](https://smart-api.info/ui/400f7c11028ff36f460af4ea85dc72f5): used to find equivalent IDs / node-category for an ID
* [Name Resolver](https://smart-api.info/ui/9995fed757acd034ef099dbb483c4c82): used to find IDs for a concept, or find the human-readable name for an ID

## SmartAPI registry

How to link to a specific SmartAPI Registration ID like Service Provider TRAPI's: use _id. Example: https://smart-api.info/registry?q=_id:36f82f05705c317bac17ddae3a0ea2f0 


## Useful links for TRAPI standard

The standard is (stored in [yaml](https://github.com/NCATSTranslator/ReasonerAPI/blob/master/TranslatorReasonerAPI.yaml)). This [link](https://github.com/NCATSTranslator/ReasonerAPI/blob/master/TranslatorReasonerAPI.yaml) is based on that yaml and is easier to read (but may lose a little detail).

TRAPI also comes with [implementation rules](https://github.com/NCATSTranslator/ReasonerAPI/blob/master/ImplementationRules.md) to follow. 


## How to do certain BTE dev tasks

Some links will be to our lab's internal Slack. 


Jackson's debugging [setup](https://suwulab.slack.com/archives/CC218TEKC/p1643226763127100)

[How to get records](https://suwulab.slack.com/archives/CC218TEKC/p1652302859447909) from a query's execution to use as a starting point for test-writing

Inspect TRAPI response ([link 1](https://github.com/biothings/BioThings_Explorer_TRAPI/issues/409#issuecomment-1041955701), [link 2](https://suwulab.slack.com/archives/CC218TEKC/p1644266456332279))
* nodes and edges in results but not in KG
* nodes and edges in KG but not in results

How to compare two demotest runs, the url format: https://api.bte.ncats.io/demotests/compare?new=results-2022-01-20-m1&old=results-2022-01-16 

the multiple configs for bte-trapi [here](https://github.com/biothings/BioThings_Explorer_TRAPI/tree/main/src/config), [here](https://github.com/biothings/BioThings_Explorer_TRAPI/blob/main/src/routes/v1/config.js), and [how the cron job works](https://github.com/biothings/BioThings_Explorer_TRAPI/blob/main/src/controllers/cron/update_local_smartapi.js)

the multiple configs for query_handler [currently](https://github.com/biothings/bte_trapi_query_graph_handler/blob/main/src/config.js) and [buried in code](https://github.com/biothings/BioThings_Explorer_TRAPI/issues/419#issuecomment-1063368241)

config in call-apis: [sub-query timeouts](https://github.com/biothings/call-apis.js/pull/53)

## x-bte annotation templating

Lots of links:
* [How to do "each-record-is-an-association" querying](https://suwulab.slack.com/archives/CC218TEKC/p1632532158233300?thread_ts=1632351568.187000&cid=CC218TEKC)
* [Jackson commented on this thread on syntax / info on what strings are reserved (queryInputs)](https://suwulab.slack.com/archives/CC218TEKC/p1631736378030300?thread_ts=1631051543.343300&cid=CC218TEKC)
* more BTE-specific functions [here](https://github.com/biothings/call-apis.js/pull/31) + [here](https://github.com/biothings/call-apis.js/pull/30)
* [nunjucks](https://mozilla.github.io/nunjucks/templating.html) in general
