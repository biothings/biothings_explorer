# Process of writing a new SmartAPI yaml with x-bte annotation

Prior reading: the other README on the types of APIs that BTE uses

The assumption is that we want to add another Translator Knowledge-Provider (KP) API to BTE by registering a new SmartAPI yaml. A "Translator KP" means that the API provides associations between biomedical concepts: an endpoint in the API can be queried with an identifier (ID) for >= 1 specific biomedical concept, which will retrieve other biomedical concepts (with identifiers) that it is associated with. 

BTE will use the KP APIs to retrieve associations that match a TRAPI QueryGraph (QGraph) edge, in a process we call sub-querying. Each combination of subject-category, subject-ID-namespace, predicate, object-category, and object-ID-namespace is described in a separate operation. Each operation will include the information to query the API with the subject and retrieve the object and related information.

<br>

# For a BioThings API

## Where to write the file

In most cases, we'll want the file in a folder in this [repo](https://github.com/NCATS-Tangerine/translator-api-registry). The folder and file can be named whatever you want.

## Start by copying and editing SmartAPI sections

One can start with an empty file, then copy sections from an existing BioThings-API yaml, and edit the text to fit the new API.

When picking an existing yaml as a starting point, pick one that best matches the endpoints the API has and the operations you plan to write. 

If the API can be queried using just the subject ID, the "simple" method of specifying query information can be used. Example:
* BioPlanet pathway-disease: annotation [on `/query POST` endpoint](https://github.com/NCATS-Tangerine/translator-api-registry/blob/6af7db52deaeb5bebcf63fcccbffac9a38ae1df8/bioplanet/bioplanet-pathway-disease.yaml#L243) , [x-bte operations section](https://github.com/NCATS-Tangerine/translator-api-registry/blob/6af7db52deaeb5bebcf63fcccbffac9a38ae1df8/bioplanet/bioplanet-pathway-disease.yaml#L439)

However, if the API needs more (for example, it needs other fields to have certain values), the more-complicated method of specifying query information can be used. Example:
* BioThings dgidb API: annotation [on `/query POST` endpoint](https://github.com/NCATS-Tangerine/translator-api-registry/blob/050a5e9e9bc6b3991d72d1f63ddfd2447c8aaa28/dgidb/openapi.yml#L240), [x-bte operations section](https://github.com/NCATS-Tangerine/translator-api-registry/blob/050a5e9e9bc6b3991d72d1f63ddfd2447c8aaa28/dgidb/openapi.yml#L476)

For more examples, scroll to the bottom of the BioThings section. 

## Basic info

Basic info in the beginning of the file includes the top-level properties `openapi`, `info`, and `servers`.

Often, you will edit:
* `info.contact`: if another team was involved in the creation of this API, perhaps a member of that team should be listed as the contact. 
* `info.description`: this can be kept very simple
* `info.title`: this is the API's name. We tend to call them "BioThings X API"...
* `info.version`: this is the API's version
* `info.x-translator`
    * `infores` uses terms that are in this [catalog](https://docs.google.com/spreadsheets/d/1Ak1hRqlTLr1qa-7O0s5bqeTHukj9gSLQML1-lg6xIHM/edit#gid=293462374), or we create terms and then add them to the catalog (and then let the Translator members that control the catalog know). You can use CTRL-F to see if a term that matches your API already exists. Note that this property's string value [has to start with `infores:`](https://github.com/NCATSTranslator/translator_extensions/blob/8980a59d045ec98f2ef93f295f647404c9a34e7c/x-translator/smartapi_x-translator_schema.json#L19) 
    * `team` may need to be adjusted. If other teams are involved in the creation of this API, add them to the list. The accepted values are [here](https://github.com/NCATSTranslator/translator_extensions/blob/8980a59d045ec98f2ef93f295f647404c9a34e7c/x-translator/smartapi_x-translator_schema.json#L36)
    * `biolink-version` should be set to the version of the biolink-model that BTE is currently on
* `servers`: edit the urls 

## tags

Keep the following tags: "biothings", "query", "metadata", "annotation". Edit or include a tag for the bioentity or association-based endpoints (see the endpoint descriptions below for explanation). The other tags are used for tell users what types of bioentities are described in the API (and this doesn't have to include type if there are a ton of them). 

## paths (aka endpoints)

BioThings APIs will probably have the same set of endpoints, so only minor edits are needed. Note: the "hidden" `/spec` endpoint of BioThings API can be useful for finding information on endpoints (like kinds of parameters or required fields). However, the `/spec` endpoints seem to be very similar between ["pending" APIs](https://pending.biothings.io/). 

The example/examples sections of endpoints are important because they are used to check the API's uptime in the SmartAPI Registry. They should be quick and have small responses. Not all endpoints need an example, but ideally the endpoint that has x-bte annotation on it would have an example (so we can monitor uptime). 

To check that the path metadata (including examples) work as intended, one can run example queries in the SmartAPI [editor](https://smart-api.info/editor).

For bioentity or association-based `GET` and `POST` endpoints:
* these paths get specific records in the API by the record ID
* they have words in their path like `association`, `geneset`, `chem`, `gene`, `anatomy`...
* EDIT:
    * the path itself to match what the API has
    * any `summary` for a path
    * the `example`/`examples`
    * the `tags`. Use a keyword that matches the path (like `association`) as the tag for these endpoints

For metadata-based endpoints (/metadata/ and /metadata/fields): GET endpoints. Often need no edits

For `/query` `GET` and `POST` endpoints:
* these endpoints allow record retrieval based on a flexible set of criteria
* In all cases so far, we put x-bte annotation on these endpoints. Specifically, we prefer the `POST` endpoint because it allows batch-querying (aka sending multiple IDs in 1 query)
* EDIT:
    * any `summary` for a path
    * the `example`/`examples`
    * the `x-bte-kgs-operations` section. This should be on the same level as the `parameters`, `requestBody`, `responses`, and `tags` properties.
    * Notice that `x-bte-kgs-operations` is a list of "references" to other parts of the SmartAPI yaml. This should be edited to list the keys / names of the stuff that will be written in the `components.x-bte-kgs-operations` section. Read [this](https://json-schema.org/understanding-json-schema/structuring.html#ref) for more info on how references work.  

Optional: Some commented-out sections of the document are about "schemas". These can be useful for describing the endpoint responses. However, we currently aren't really using them. 

## components (the non-x-bte stuff)

You probably don't need to edit any of it.

<br>

# Preparation for writing the x-bte sections

It can be much easier to write x-bte annotation when the following work is done:

## Types of bioentities / IDs

Look at the /metadata/fields response and example responses from the API endpoint. Make a list with this info: what types of bioentities are in the API data (diseases, chemicals, phenotypes, pathways, etc.)? What kind of IDs (ID namespaces) are used to specify the bioentities (and do they have prefixes or non-numeric characters? IDs with prefixes are also called [curies](https://cthoyt.com/2021/09/14/curies.html))? What fields contain those IDs? 

## Biolink-model categories and ID-prefix spellings

Look at the [biolink-model semantic-types / categories](https://github.com/biolink/biolink-model/blob/394c3c10595ecaf3d7a24516be764c097af3d335/biolink-model.yaml#L7172) and [ID-prefix spellings](https://github.com/biolink/biolink-model/blob/master/context.jsonld). To the list, add the biolink-model semantic-types and prefix spellings you'll need. 

Tips:
* you have to use biolink-model semantic types that exist in the version of biolink-model BTE is using
* CTRL-F to see if the biolink-model contains suggestions for semantic-type / ID-spelling 
* the spelling for biolink-model categories is actually PascalCase (upper-case first letters)
* we use more-specific terms (not top-level ones like NamedThing, ChemicalEntity, MolecularEntity, BiologicalEntity). We don't use mixins (the entry in the yaml will have `mixin: true`)
* it's okay if the term we pick doesn't match all of the possible IDs for that type of thing...Examples:
    * For chemicals, we use "SmallMolecule" in almost all cases (rather than Drug, MolecularMixture, ComplexMolecularMixture, Polypeptide). This is partially for historic reasons (it's most similar to the older idea of ChemicalSubstances) and most chemical IDs are this semantic type...
    * For [HP](https://hpo.jax.org/app/) IDs, we use "PhenotypicFeature" even though some IDs match up with diseases
* If it's not clear what ID-prefix spelling to use (maybe it doesn't exist in the biolink-model yet), discuss with more-experienced team members. In general, the ID should be in the form that it is in the original vocab. Then the prefix is usually in all-caps, period-delimited, and says what vocab this is from. It's okay if the ID-namespace / prefix used isn't in the biolink-model yet. 
* If it's not clear what semantic types the IDs fit, sometimes it is helpful to input a few IDs into Translator's [Node Normalizer tool](https://nodenormalization-sri.renci.org/docs) and see what semantic type the tool says they are. 

## Combinations

Figure out what combinations/combos of things there are. It can help to run practice queries where you start with a subject ID and try to retrieve relationship info and object IDs. 
* API data tends to have only specific types of associations / relationships
* A "combo" includes:
    * subject-category
    * subject-ID-prefix
    * kind of relationship 
    * object-category
    * object-ID-prefix
* Yes, this means some combos will be redundant (for example, if an API has a bunch of different ID-namespaces/prefixes but they're all Pathways). Right now, we have to write a different operation for each one
* But if you can set relationship field to specific values to get different relationships, then there can be separate combos/ operations based on how that field is set. 
* If the API data has only a few records matching a particular combo, you could write this down as a comment in the yaml and decide not to write an operation for that combo 

## Biolink-model predicates

Decide what biolink-model predicates to use for each combo. The biolink-model yaml section and the visualization can be helpful. 

Tips:
* you have to use biolink-model predicates that exist in the version of biolink-model BTE is using
* CTRL-F for your-words-for-the-relationship to see if the biolink-model contains suggestions for predicate
* the spelling for biolink-model predicates is actually snake_case (all lower-case, "_" between words)
* we try to use more-specific terms, that still match almost all of the data for the combo. We don't use mixins (the entry in the yaml will have `mixin: true`)
    * this means sometimes using a more-general predicate, when we can't set a relationship field to specific values to get different relationships
* for regulation, we tend to use "entity_regulates_entity" (aka this existing-thing regulates this other existing-thing) rather than the process-one (this process affects this other process, and not many biolink-model semantic-types are "processes")

## Other info

Decide what information on the relationship you want to include. Publication IDs (PMID, PMC, etc) and website URLs are strongly appreciated. Additional source info, some relevant variables, and free-text fields may be helpful.

One would only include subject or object-specific fields if there is a concern that the info would be missing if it wasn't retrieved here (so sometimes human-readable names, "original" names and IDs, "types of diseases or chemicals"...).

## Consider "reverse" direction

Consider whether you need to write "reverse" operations. Whenever possible, we want to be able to query "forwards" and "backwards / reverse". For example, if the API has a relationship between "autoimmune disease" and "steroids", we want to be able to retrieve that relationship when querying for "autoimmune disease" or "steroids". 

This often means checking that the combinations from earlier steps can handle queries in "both directions". With the above example, there'd be an operation where the subject is Disease and the object is SmallMolecule AND an operation where the subject is SmallMolecule and the object is Disease (switched). 

In BioThings APIs that have an association structure (each record has a subject section, relationship section, and object section), this is pretty easy to do. 

However, in BioThings APIs with a bioentity-based structure (each record represents a specific bioentity ID and all the info associated with it), this is more complicated. For example, in MyDisease.info, each record represents 1 Disease. This means you cannot get the relationship info (previous step) when querying in the reverse direction. For example if you tried to query from Gene -> Disease with MyDisease.info, you would not get the info specific to that Gene-Disease pair (you'd instead get all the info on that Disease). We often call these "reverse" operations that will lack information compared to the "forward" operations...

<br>

# Writing the `x-bte-kgs-operations` section

In `components`, there are two x-bte sections: `x-bte-kgs-operations` and `x-bte-response-mapping`. These are what we refer to when we say "x-bte annotation". 

<br>

General notes:
* put your notes down as comments in the yaml. This helps you and others understand what was done and how to edit it later
* the x-bte-operations can have whatever key / name you want. We tend to use subject-category/predicate-object-category combos as the names. 
* the subject/ input can check multiple fields for the starting ID
* but the object / output can only map to 1 field, so if there's >=1 that you need to use, those will have to be separate operations and response-mappings

<br>

There'll be 1 operation per combo and direction (forward / reverse). For an operation, there'll be the following sections:
* `supportBatch`: `true` when this endpoint can do batch-querying (multiple IDs in 1 query), `false` otherwise
* `useTemplating`: `true`. Keep this, it means we're using the latest way of describing the input information (in places like `requestBody`)
* `inputs`: it's a weird format (1 element array, that element is an object with two key-value pairs)
    * `id`: put the starting / subject ID-prefix
    * `semantic`: put the starting / subject biolink-model semantic-type
* `requestBody`: when doing a `POST` query, this is where you specify what you're querying with.
    * the `q` field is where the subject-ID goes
    * the `scopes` field is where the name of the API field that has subject-IDs goes (in dot-notation)
    * we like leaving comments on whether the subject-ID in the API data has a prefix or not
    * `{{ queryInputs }}` means BTE will put an array of IDs there (it often strips off the prefix, but not always...)
    * more complicated stuff ("templating") can be done to process the IDs (remove or adding a prefix / suffix) and specify values for other fields (to retrieve specific relationships). See the yaml examples, [notes](https://github.com/biothings/call-apis.js/pull/31) [from](https://github.com/biothings/call-apis.js/pull/30) the PRs for this functionality, [internal](https://suwulab.slack.com/archives/CC218TEKC/p1631736378030300?thread_ts=1631051543.343300&cid=CC218TEKC) [Slack](https://suwulab.slack.com/archives/CC218TEKC/p1632532158233300?thread_ts=1632351568.187000&cid=CC218TEKC) links, and [nunjucks](https://mozilla.github.io/nunjucks/templating.html). Note that the top-level property `requestBodyType: object` is used when you set requestBody.body to a multi-line string (>-) that represents an object/dictionary (notice the text is enclosed in {})
* `outputs`: it's the same input as the `inputs`
    * id: put the retrieved / object ID-prefix
    * semantic: put the retrieved / object biolink-model semantic-type
* `parameters`: 
    * `fields`: this is the fields of the API you want to retrieve. At minimum, it'll have the API field for the object-IDs. Chunlei suggested only listing the fields for relationship info that you want BTE to have. It's a good idea to note what fields you're not listing / using and why. 
    * `size`: 1000. At the moment, always set to this amount. Include to ensure that the max number of records that match your query are retrieved
* `predicate`: put the biolink-model predicate picked here
* `source` (optional): this field is for putting an `infores` term that says where this API got the data. In almost all cases, we want to have this (follow the notes above on finding / creating infores terms). If we don't need to specify where the API got the data in more detail, we can remove this field. 
* `response-mapping`: this is a reference to a key/part of the other "x-bte" section (see below)
* `testExamples`: notice this section is commented out. This is because we aren't using this section yet (it's in development + hiatus)...But it can be useful to give an example subject-ID input and an object-ID you'd expect in the response. Particularly when testing that the yaml is written correctly (see last section below). 

Remember to put the key / names of each operation into the x-bte-kgs-operations list in the endpoint section! 

<br>

# Writing the `x-bte-response-mapping` section

That's where we will map each field in the parameters.fields to the output or another key (that will be used as the name/id of the edge-attribute in BTE). 

You only need 1 response-mapping part per unique combo of field-mappings (so different operations can have the same response-mapping). Remember that the object / output can only map to 1 field, so if there's >=1 that you need to use, those will have to be separate operations and response-mappings. 

Each response-mapping has a key/name (used in the operation references). This can be anything and it is often named after the object semantic-type, object-ID-prefix, and whether it's for a special "reverse" operation. 

The fields are specified using dot-notation.

<br>

Sections:
* 1 key is the object-ID-prefix, and the value is the field in the API response that has the object-IDs. We tend to leave a comment saying whether those IDs are prefixed or not
* pubmed: this is a special key, and the value is the field in the API response holding the PMIDs of publications. BTE will specially handle these. The PMIDs can be plain IDs or prefixed. 
* other fields: when we can, we try to use a [biolink-model association-slot term](https://github.com/biolink/biolink-model/blob/394c3c10595ecaf3d7a24516be764c097af3d335/biolink-model.yaml#L6579). When we use it, we add the biolink prefix like this: "biolink:original_subject". Otherwise, we write our own descriptive key (without spaces). 
* in a special case, other Translator teams ask us to make BioThings APIs and provide their TRAPI edge-attributes in a special section of the records (usually association.edge-attributes). In this case, we want the key to be `edge-attributes`. During testing, we'll want to check if BTE automatically ingested this properly or not (1 mega-attribute with all the stuff from that field in it would be incorrect). 

<br>

# Other Examples of BioThings SmartAPI yamls with x-bte annotation

(using the latest format for "templated" querying)

* simple 
    * [DISEASES](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/DISEASES/smartapi.yaml)
    * [EBI Gene2Phenotype](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/EBIgene2phenotype/smartapi.yaml)
    * [RHEA](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/rhea/smartapi.yaml)
    * [GO BP](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/go_bp/smartapi.yaml), [GO CC](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/go_cc/smartapi.yaml)
    * [iDISK](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/idisk/smartapi.yaml)
    * [pfocr](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/pfocr/smartapi.yaml)
* more complicated
    * [Multiomics Provider Drug response kp api](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/drug_response_kp/smartapi.yaml)
    * [Text-Mining Provider targeted association kp api](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/text_mining/smartapi.yaml)
    * SEMMEDDB, see [operations](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/semmeddb/generated_operations.yaml), [operations list](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/semmeddb/generated_list.yaml), vs rest of the yaml that has the [x-bte response mapping](https://github.com/NCATS-Tangerine/translator-api-registry/blob/050a5e9e9bc6b3991d72d1f63ddfd2447c8aaa28/semmeddb/version_without_operations.yaml#L484)

<br>

# For non-BioThings (other) APIs 

Examples:
* Biolink (Monarch) api (not BioThings or TRAPI): has annotation on each endpoint described, look [here](https://github.com/NCATS-Tangerine/translator-api-registry/blob/050a5e9e9bc6b3991d72d1f63ddfd2447c8aaa28/biolink/openapi.yml#L787) for x-bte annotation
* [EBI Proteins API](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/ebi_proteins/openapi.yml)

(WIP to write the guide for writing these)

<br>

# Testing after it's written

It can be helpful to paste the yaml into the SmartAPI [editor](https://smart-api.info/editor) or a [yaml-viewer](https://jsonformatter.org/yaml-viewer) to check that the yaml has been written correctly. The SmartAPI editor is nice in that it'll also check that all references are used correctly. 

To test that the yaml can be used properly by BTE, you can install a local version of BTE (using [bte-trapi-workspace](https://github.com/biothings/bte-trapi-workspace)). Then you can:
* modify the packages/@biothings-explorer/bte-trapi/src/config/smartapi_overrides.json file. Set `only_overrides` to `true`, and put a key-value pair into the `apis` section. The key can be arbitrary, and the value can be a file path (starting with file:/// for absolute paths) or a link to a raw yaml file. See the instructions [here](https://github.com/biothings/BioThings_Explorer_TRAPI#using-api_overridetrue) for details on this.
* run `API_OVERRIDE=true npm run smartapi_sync --workspace='@biothings-explorer/bte-trapi'` to set BTE to only use the API yaml you're testing
* start up BTE `npm run debug --workspace='@biothings-explorer/bte-trapi'` and set up a `POST` request to `http://localhost:3000/v1/smartapi/your-id-here/query` where `your-id-here` is replaced with the key you set in the `apis` section.
* put a TRAPI query into the `POST` request's request-body section. One can test each operation, or only a few. For testing an operation, you can set the example subject ID (from the testExamples!) and semantic type and the object-semantic type (and sometimes the predicate). Then run the `POST` query, and look for the object-ID (from the testExamples!, found in the underlying API's raw response) in BTE's response. You can also look at the corresponding edge to see if the edge-attributes match what you'd expect from the response-mapping (aka all info is there and is formatted correctly). 

If there are issues with testing, talk to a more experienced team-member. Sometimes the issue is with BTE, sometimes with the x-bte annotation written. 