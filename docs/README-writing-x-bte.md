# Process of writing a new SmartAPI yaml with x-bte annotation

Prior reading: the other README on the types of APIs that BTE uses (particularly the BioThings and "other" API sections)

The assumption is that we want to add another Translator Knowledge-Provider (KP) API to BTE by registering a new SmartAPI yaml. A "Translator KP" means that the API provides associations between biomedical concepts: an endpoint in the API can be queried with >=1 identifiers (IDs, for specific biomedical concepts), which will retrieve other biomedical concepts (with IDs) that it is associated with.

BTE will use the KP APIs to retrieve associations that match a TRAPI QueryGraph (QGraph) edge, in a process we call sub-querying. Each combination of subject-category, subject-ID-namespace, predicate, object-category, and object-ID-namespace is described in a separate operation. Each operation will include the information to query the API with the subject and retrieve the object and related information on the relationship.

## For a BioThings API

### Where to write the file

In most cases, we'll want the file in a folder in this [repo](https://github.com/NCATS-Tangerine/translator-api-registry). The folder and file can be named whatever you want.

### Start by copying and editing SmartAPI sections

Start with an empty file, then copy sections from an existing BioThings API's yaml. Use a simple yaml like [BioPlanet pathway-disease](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/bioplanet/bioplanet-pathway-disease.yaml) or pick a yaml from the examples listed below that best matches the endpoints your API has and the operations you plan to write.

Examples that use the latest format ("templated" querying):

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
  * SEMMEDDB, see [operations](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/semmeddb/generated_operations.yaml), [operations list](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/semmeddb/generated_list.yaml), vs rest of the yaml that has the [x-bte response mapping](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/semmeddb/version_without_operations.yaml)

### Basic info

Basic info in the beginning of the file includes the top-level properties `openapi`, `info`, and `servers`.

Example from [BioPlanet pathway-disease](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/bioplanet/bioplanet-pathway-disease.yaml):

```yaml
openapi: 3.0.3
info:
  contact:
    email: help@biothings.io
    name: BioThings Team
    x-id: https://github.com/biothings
    x-role: responsible developers
  description: >-
    Documentation of the BioThings [BioPlanet](https://tripod.nih.gov/bioplanet/#) pathway-disease 
    association query web services.
  termsOfService: https://biothings.io/about
  title: BioThings BioPlanet Pathway-Disease API
  version: '1.0'
  x-translator:
    infores: "infores:biothings-bioplanet-pathway-disease"
    component: KP
    team:
      - Service Provider
    biolink-version: "2.2.13"
servers:
- description: Encrypted Production server
  url: https://biothings.ncats.io/bioplanet_pathway_disease
  x-maturity: production
- description: Production server
  url: http://biothings.ncats.io/bioplanet_pathway_disease
  x-maturity: production
```

Often, you will edit:

* `info.contact`: if another team was involved in the creation of this API, perhaps a member of that team should be listed as the contact.
* `info.description`: this can be kept very simple
* `info.title`: this is the API's name. We tend to call them "BioThings X API"...
* `info.version`: this is the API's version
* `info.x-translator`
  * `infores` uses terms that are in this [catalog](https://docs.google.com/spreadsheets/d/1Ak1hRqlTLr1qa-7O0s5bqeTHukj9gSLQML1-lg6xIHM/edit#gid=293462374), or we create terms and then add them to the catalog (and then let the Translator members that control the catalog know). You can use CTRL-F to see if a term that matches your API already exists. Note that this property's string value [has to start with `infores:`](https://github.com/NCATSTranslator/translator_extensions/blob/main/x-translator/smartapi_x-translator_schema.json)
  * `team` may need to be adjusted. If other teams are involved in the creation of this API, add them to the list. The accepted values are [here](https://github.com/NCATSTranslator/translator_extensions/blob/main/x-translator/smartapi_x-translator_schema.json)
  * `biolink-version` should be set to the version of the biolink-model that BTE is currently on
* `servers`: edit the urls. For pending APIs, use the "biothings.ncats.io" urls. 

### tags

Example from [BioPlanet pathway-disease](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/bioplanet/bioplanet-pathway-disease.yaml):

```yaml
tags:
- name: association
- name: pathway
- name: disease
- name: query
- name: translator
- name: biothings
```

This section doesn't need much editing:

* Keep the following tags: "biothings", "query", translator", "metadata"
* Edit or include a tag for the bioentity or association-based endpoints (see the endpoint descriptions below for explanation).
* The other tags are used to tell others what types of bioentities are described in the API (and this doesn't have to include all of them if there are a ton).

### paths (aka endpoints)

Probably only minor edits are needed, because BioThings APIs tend to have a common set of endpoints. Note: the "hidden" `/spec` endpoint of BioThings API can be useful for understanding endpoints (like parameters or required fields). However, the `/spec` endpoints seem to be very similar between ["pending" APIs](https://biothings.ncats.io/).

The example/examples sections of endpoints are important because they are used to check the API's uptime in the SmartAPI Registry. They should be quick and have small responses. Not all endpoints need an example, but ideally the endpoint that has x-bte annotation on it would have an example (so we can monitor uptime).

To check that the path metadata (including examples) work as intended, one can run example queries in the SmartAPI [editor](https://smart-api.info/editor).

#### For bioentity or association-based `GET` and `POST` endpoints

* these paths get specific records in the API by the record ID
* they have words in their path like `association`, `geneset`, `chem`, `gene`, `anatomy`...
* EDIT:
  * the path itself to match what the API has
  * any `summary` for a path
  * the `example`/`examples`
  * the `tags`. Use a keyword that matches the path (like `association`) as the tag for these endpoints

Example from [BioPlanet pathway-disease](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/bioplanet/bioplanet-pathway-disease.yaml):

```yaml
paths:
  "/association/{id}":
    get:
      parameters:
      - name: id
        in: path
        required: true
        example: "bioplanet_912-109800"
        schema:
          type: string
      - "$ref": "#/components/parameters/raw"
      - "$ref": "#/components/parameters/rawquery"
      - "$ref": "#/components/parameters/_source"
      - "$ref": "#/components/parameters/size"
      - "$ref": "#/components/parameters/dotfield"
      - "$ref": "#/components/parameters/_sorted"
      - "$ref": "#/components/parameters/always_list"
      - "$ref": "#/components/parameters/allow_null"
      - "$ref": "#/components/parameters/format"
      responses:
        '200':
          description: "Success"
      #     content:
      #       application/json:
      #         schema:
      #           $ref: '#/components/schemas/Association'
      #   '404':
      #     description: A response indicating an unknown association ID
      summary: >-
        Retrieve association based on ID
      tags:
      - association
  "/association":
    post:
      parameters:
      - "$ref": "#/components/parameters/raw"
      - "$ref": "#/components/parameters/rawquery"
      - "$ref": "#/components/parameters/_source"
      - "$ref": "#/components/parameters/size"
      - "$ref": "#/components/parameters/dotfield"
      - "$ref": "#/components/parameters/_sorted"
      - "$ref": "#/components/parameters/always_list"
      - "$ref": "#/components/parameters/allow_null"
      - "$ref": "#/components/parameters/format"
      requestBody:
        content:
          application/json:
            example:
              ids:
              - "bioplanet_912-109800"
              - "bioplanet_244-615363"
            schema:
              type: object
              properties:
                ids:
                  description: 'multiple Association IDs separated by comma. Note that
                    currently we only take the input ids up to 1000 maximum, the rest
                    will be omitted. Type: string (list). Max: 1000.'
                  type: array
                  items:
                    type: string
      responses:
        '200':
          description: "Success"
      summary: >-
        Retrieve multiple associations' information based on ID
      tags:
      - association
```

#### For metadata-based endpoints (/metadata/ and /metadata/fields)

GET endpoints. Often need no edits

Example from [BioPlanet pathway-disease](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/bioplanet/bioplanet-pathway-disease.yaml):

```yaml
  "/metadata":
    get:
      parameters:
      - "$ref": "#/components/parameters/format"
      - "$ref": "#/components/parameters/raw"
      - "$ref": "#/components/parameters/dev"
      responses:
        '200':
          description: Success
      summary: Get metadata about the data available from the API
      tags:
      - metadata
  "/metadata/fields":
    get:
      parameters:
      - "$ref": "#/components/parameters/format"
      - "$ref": "#/components/parameters/raw"
      - "$ref": "#/components/parameters/search"
      - "$ref": "#/components/parameters/prefix"
      responses:
        '200':
          description: Success
      summary: Get metadata about the data fields available from a record
      tags:
      - metadata
```

#### For `/query` `GET` and `POST` endpoints

* these endpoints allow record retrieval based on a flexible set of criteria
* In all cases so far, we put x-bte annotation on these endpoints. Specifically, we prefer the `POST` endpoint because it allows batch-querying (aka sending multiple IDs in 1 query)
* EDIT:
  * any `summary` for a path
  * the `example`/`examples`
  * the `x-bte-kgs-operations` section. This should be on the same level as the `parameters`, `requestBody`, `responses`, and `tags` properties. Check that this section is in the endpoint you want BTE to use when querying the API.
  * Notice that `x-bte-kgs-operations` is a list of "references" to other parts of the SmartAPI yaml. This should list the keys / names of the stuff in the `components.x-bte-kgs-operations` section. Read [this](https://json-schema.org/understanding-json-schema/structuring.html#ref) for more info on how references work.  

Optional: Some commented-out sections of the document are about "schemas". These can be useful for describing the endpoint responses. However, we currently aren't really using them.

Example from [BioPlanet pathway-disease](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/bioplanet/bioplanet-pathway-disease.yaml):

```yaml
  "/query":
    get:
      parameters:
      - name: q
        description: Query string.
        in: query
        required: true
        example: "subject.PHENO_TYPE:608446"
        schema:
          type: string
      - "$ref": "#/components/parameters/aggs"
      - "$ref": "#/components/parameters/facet_size"
      - "$ref": "#/components/parameters/from"
      - "$ref": "#/components/parameters/userquery"
      - "$ref": "#/components/parameters/sort"
      - "$ref": "#/components/parameters/explain"
      - "$ref": "#/components/parameters/fetch_all"
      - "$ref": "#/components/parameters/scroll_id"
      - "$ref": "#/components/parameters/raw"
      - "$ref": "#/components/parameters/rawquery"
      - "$ref": "#/components/parameters/_source"
      - "$ref": "#/components/parameters/size"
      - "$ref": "#/components/parameters/dotfield"
      - "$ref": "#/components/parameters/_sorted"
      - "$ref": "#/components/parameters/always_list"
      - "$ref": "#/components/parameters/allow_null"
      - "$ref": "#/components/parameters/format"
      responses:
        '200':
          description: Success
      #     content:
      #       application/json:
      #         schema:
      #           "$ref": "#/components/schemas/QueryResult"
      #   '400':
      #     content:
      #       application/json:
      #         schema:
      #           "$ref": "#/components/schemas/ErrorResult"
      #     description: A response indicating an improperly formatted query
      # summary: Make queries and return matching gene hits. Supports JSONP and CORS
      #   as well.
      tags:
      - query
    post:
      parameters:
      - name: q
        in: query
        required: false
        schema:
          type: array
          items:
            type: string
      - name: scopes
        in: query
        required: false
        schema:
          type: array
          items:
            type: string
            default:
            - _id
      - "$ref": "#/components/parameters/from"
      - "$ref": "#/components/parameters/sort"
      - "$ref": "#/components/parameters/raw"
      - "$ref": "#/components/parameters/rawquery"
      - "$ref": "#/components/parameters/_source"
      - "$ref": "#/components/parameters/size"
      - "$ref": "#/components/parameters/dotfield"
      - "$ref": "#/components/parameters/_sorted"
      - "$ref": "#/components/parameters/always_list"
      - "$ref": "#/components/parameters/allow_null"
      - "$ref": "#/components/parameters/format"
      requestBody:
        content:
          application/json:
            example:
              q:
              - "608446"
              - "157300"
              scopes:
              - "subject.PHENO_TYPE"
            schema:
              type: object
              properties:
                q:
                  type: array
                  items:
                    type: string
                scopes:
                  type: array
                  items:
                    type: string
                from:
                  type: integer
                sort:
                  type: array
                  items:
                    type: string
      responses:
        '200':
          description: Success
      #     content:
      #       application/json:
      #         schema:
      #           "$ref": "#/components/schemas/QueryPOSTResult"
      #   '400':
      #     content:
      #       application/json:
      #         schema:
      #           "$ref": "#/components/schemas/ErrorResult"
      #     description: A response indicating an improperly formatted query
      # summary: Make batch gene queries and return matching gene hits
      tags:
      - query
      ## 2 operations
      x-bte-kgs-operations:
      - $ref: '#/components/x-bte-kgs-operations/pathway-disease'
      - $ref: '#/components/x-bte-kgs-operations/disease-pathway'
```

### components (the non-x-bte stuff)

You probably don't need to edit any of it.

Beginning of the section:

```yaml
components:
  parameters:
    _sorted:
      name: _sorted
      in: query
      required: false
      schema:
        type: boolean
        default: true
    _source:
      name: _source
      in: query
      required: false
      schema:
        type: array
        items:
          type: string
```

## Preparation for writing the x-bte sections

It can be much easier and faster to write x-bte annotation when the following work is done. It looks like a LOT but for small one-source APIs, it's not that bad!

### Types of bioentities / IDs

Look at the `/metadata/fields` response and example responses from the API endpoint. Make a list with this info:

* what types of bioentities are in the API data (diseases, chemicals, phenotypes, pathways, etc.)?
* What kind of IDs (ID namespaces) are used to specify the bioentities (and do they have prefixes or non-numeric characters? IDs with prefixes are also called [curies](https://cthoyt.com/2021/09/14/curies.html))?
* What fields contain those IDs?

Example from [BioPlanet pathway-disease](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/bioplanet/bioplanet-pathway-disease.yaml):

```text
* 3 potential types:
  * diseases: omim disease IDs without prefixes, in field subject.PHENO_TYPE
  * genes: ncbi gene / entrez IDs without prefixes, in field relation.GENE_ID
  * pathways: bioplanet pathway IDs without prefixes but ID itself seems to have text (bioplanet_90), 
    in field object.PATHWAY_ID
```

### Biolink-model categories and ID-prefix spellings

Look at the [biolink-model](https://github.com/biolink/biolink-model/blob/master/biolink-model.yaml) semantic-types / categories (pick the tag/version that BTE is on and look for the `## THINGS` comment heading) and [ID-prefix spellings](https://github.com/biolink/biolink-model/blob/master/context.jsonld). The [tree visualization](https://tree-viz-biolink.herokuapp.com/categories/2.2.13) can be helpful and its url can be modified for the tag/version of biolink-model. To the list you made above, add the biolink-model semantic-types and prefix spellings you'll need.

Tips:

* you have to use biolink-model semantic types that exist in the version of biolink-model BTE is using. They cannot be labeled `abstract: true` or `mixin: true` (abstract and mixin terms are only for querying, not for annotating data). 
* CTRL-F to see if the biolink-model contains suggestions for semantic-type / ID-spelling
* the spelling for biolink-model categories is actually PascalCase (upper-case first-letters, no spaces)
* we use more-specific terms (not top-level ones like NamedThing, ChemicalEntity, MolecularEntity, BiologicalEntity). We don't use mixins (the entry in the yaml will have `mixin: true`)
* it's okay if the term we pick doesn't match all the IDs in the resource. Examples:
  * For chemicals, we use "SmallMolecule" in almost all cases (rather than Drug, MolecularMixture, ComplexMolecularMixture, Polypeptide). This is partially for historic reasons (it's most similar to the older idea of ChemicalSubstances) and most chemical IDs are this semantic type...
  * For [HP](https://hpo.jax.org/app/) IDs, we use "PhenotypicFeature" even though some IDs match up with diseases
* If it's not clear what ID-prefix spelling to use (maybe it doesn't exist in the biolink-model yet), discuss with more-experienced team members. In general, the ID should be in the form that it is in the original vocab. Then the prefix is usually in all-caps, period-delimited, and says what vocab this is from. It's okay if the ID-namespace / prefix used isn't in the biolink-model yet.
* If it's not clear what semantic types the IDs fit, sometimes it is helpful to input a few IDs into Translator's [Node Normalizer tool](https://nodenormalization-sri.renci.org/docs) and see what semantic type the tool says they are.

Example from [BioPlanet pathway-disease](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/bioplanet/bioplanet-pathway-disease.yaml):

```text
* 3 potential types:
  * Disease (biolink): OMIM IDs without prefixes, in field subject.PHENO_TYPE
  * Gene (biolink): NCBIGene IDs without prefixes, in field relation.GENE_ID
  * Pathway (biolink): bioplanet IDs (later versions of biolink-model spell it as `ncats.bioplanet`), without prefixes but ID
    itself seems to have text (bioplanet_90), in field object.PATHWAY_ID
```

### Combinations

Figure out what combinations/combos of things there are, and make a list of them. These will become the operations of the "x-bte operations". It can help to run practice queries where you start with a subject ID and try to retrieve relationship info and object IDs.

* API data tends to have only specific types of associations / relationships
* A "combo" includes:
  * subject-category
  * subject-ID-prefix
  * kind of relationship
  * object-category
  * object-ID-prefix
* If there are multiple ID-prefixes for a "subject-category" or "object-category", you should consider:
  * Can you retrieve different records/documents by querying with or retrieving different ID-prefixes? If so, then writing multiple operations makes sense. If not, then just pick one.
  * Pick a set of ID-prefixes that will cover most of the API's data. This can be easily checked with BioThings APIs by doing queries with `_exists_` ([example](https://biothings.ncats.io/bindingdb/query?q=_exists_:object.pubchem_cid))
  * If you have several ID-prefixes that are "equally good", use the biolink-model's id-prefixes list order for the category (they're in order from most-preferred to least-preferred).
* Yes, this means some combos will be redundant (for example, if an API has a bunch of different ID-namespaces/prefixes but they're all Pathways). Right now, we have to write a different operation for each one
* And if you can set relationship field to specific values to get different relationships, then there can be separate combos / operations based on how that field is set.
* If the API data has only a few records matching a particular combo, you could write this down as a comment in the yaml and decide not to write an operation for that combo

Example from [BioPlanet pathway-disease](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/bioplanet/bioplanet-pathway-disease.yaml):

```text
* Gene is an "intermediate" / explanation for Disease <-> Pathway associations so 
  I'm currently only doing Disease <-> Pathway
  * Disease -> Pathway
  * Pathway -> Disease
```

### Biolink-model predicates

Decide what biolink-model predicates to use for each combo; write that down in the list of combos. Look at the [biolink-model](https://github.com/biolink/biolink-model/blob/master/biolink-model.yaml) predicates (pick the tag/version that BTE is on and look for the `## PREDICATES/RELATIONS` comment heading). The [tree visualization](https://tree-viz-biolink.herokuapp.com/predicates/2.2.13) can be helpful and its url can be modified for the tag/version of biolink-model.

Tips:

* you have to use biolink-model predicates that exist in the version of biolink-model BTE is using. Generally, they cannot be labeled `abstract: true` or `mixin: true` (abstract and mixin terms are only for querying, not for annotating data). 
  * However, you may encounter a predicate you want to use that is labeled abstract or mixin, or your data's relationship term maps to a term that is labeled abstract or mixin. In this case, ask Data-Modeling team about this situation and ask what predicate to use. 
* CTRL-F using your words for the relationship to see if the biolink-model has suggestions / mappings
* the spelling for biolink-model predicates is actually snake_case (all lower-case, "_" between words)
* use predicates that have inverses!
* we try to use more-specific terms that still match almost all of the data for the combo. We don't use mixins (the entry in the yaml will have `mixin: true`)
  * this means sometimes using a more-general predicate, when we can't set a relationship field to specific values to get different relationships
* for regulation, we tend to use "entity_regulates_entity" (aka this existing-thing regulates this other existing-thing) rather than the process-one (this process affects this other process, and not many biolink-model semantic-types are "processes")

Example from [BioPlanet pathway-disease](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/bioplanet/bioplanet-pathway-disease.yaml):

* decided to use Pathway "actively_involved_in" Disease because that's the same predicate used by a similar operation written for [biolink (monarch) api](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/biolink/openapi.yml)
* for the other direction ("inverse"), it's Disease "actively_involves" Pathway

### Other info

Decide what information on the relationship you want to include. Publication IDs (PMID, PMC, etc) and website URLs are strongly appreciated. Additional source info, some relevant variables, and free-text fields may be helpful.

One would only include subject or object-specific fields if there is a concern that the info would be missing if it wasn't retrieved here (so sometimes human-readable names, "original" names and IDs, "types of diseases or chemicals"...).

Example from [BioPlanet pathway-disease](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/bioplanet/bioplanet-pathway-disease.yaml):

```text
* this API didn't have any publications or websites in its fields
* Gene is an "intermediate" / explanation for Disease <-> Pathway associations, so I decided to include
  its info: relation.GENE_SYMBOL,relation.GENE_ID
* because [Node Normalizer tool](https://nodenormalization-sri.renci.org/docs) probably won't recognize
  the new BIOPLANET IDs for a while, I decided to include the pathway information fields:
  object.PATHWAY_NAME,object.PATHWAY_CATEGORIES
* so...I then decided to include the Disease name as well...that's optional: subject.DISEASE_NAME
```

### Consider "reverse" direction

Consider whether you need to write "reverse" operations. Whenever possible, we want to be able to query "forwards" and "backwards / reverse". For example, if the API has a relationship between "autoimmune disease" (a Disease) and "steroids" (a SmallMolecule), we want to be able to retrieve that relationship when querying for "autoimmune disease" or "steroids". This often means checking that the combinations from earlier steps can handle queries in "both directions". With the earlier example, there'd be an operation where the subject is Disease and the object is SmallMolecule AND an operation where the subject is SmallMolecule and the object is Disease (switched).

In BioThings APIs that have an association structure (each record has a subject section, relationship section, and object section), this is pretty easy to do.

However, in BioThings APIs with a bioentity-based structure (each record represents a specific bioentity ID and all the info associated with it), this is more complicated. For example, in MyDisease.info, each record represents 1 Disease. This means you cannot get the relationship info (previous step) when querying in the reverse direction. If you tried to query from Gene -> Disease with MyDisease.info, you would not get the info specific to that Gene-Disease pair (you'd instead get all the info on that Disease). We often call these special "reverse" operations since they will lack information compared to the "forward" operations...

Example from [BioPlanet pathway-disease](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/bioplanet/bioplanet-pathway-disease.yaml):

```text
* This API has an association-structure (each record represents 1 association between a subject-object).
  So I can grab the related info fields when querying for subject or for object.
* I want to describe both Disease -> Pathway and Pathway -> Disease.
```

## Writing the `x-bte-kgs-operations` section

In `components`, there are two x-bte sections: `x-bte-kgs-operations` and `x-bte-response-mapping`. These are what we refer to when we say "x-bte annotation".

General notes:

* put your notes down as comments in the yaml. This helps you and others understand what was done
* the x-bte-operations can have whatever key / name you want. We tend to use subject-category/predicate-object-category combos as the names.
* the subject/ input can check multiple fields for the starting ID
* but the object / output can only map to 1 field, so if there's >=1 that you need to use, those will have to be separate operations and response-mappings

Example from [BioPlanet pathway-disease](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/bioplanet/bioplanet-pathway-disease.yaml):

```yaml
  x-bte-kgs-operations:
  ## 3 potential types: Disease, Gene, Pathway (BioPlanet IDs)
  ## - API pathway IDs don't have a bioplanet prefix on them (but they are in the format bioplanet_276)
  ## - Gene is an "intermediate" / explanation for Disease <-> Pathway associations
  ##   so I'm currently only doing Disease <-> Pathway
    pathway-disease:
    ## 44,084 documents in the API 
      - supportBatch: true
        useTemplating: true ## flag to say templating is being used below
        inputs:
          - id: "ncats.bioplanet"
            semantic: Pathway
        requestBody:
          body:
            ## API data has no prefix
            ## joinSafe is only needed if the delimiter isn't a comma
            q: "{{ queryInputs }}"
            scopes: object.PATHWAY_ID
        outputs:
          - id: OMIM
            semantic: Disease
        parameters:
          fields: >-
            subject.PHENO_TYPE,
            object.PATHWAY_NAME,object.PATHWAY_CATEGORIES,
            subject.DISEASE_NAME,
            relation.GENE_SYMBOL,relation.GENE_ID
          size: 1000
        ## using the same predicate that biolink (monarch) api uses
        predicate: actively_involved_in
        source: "infores:bioplanet"
        response_mapping:
          "$ref": "#/components/x-bte-response-mapping/disease"
        # testExamples:
        #   - qInput: "ncats.bioplanet:bioplanet_276"     ## Alpha-hemoglobin stabilizing enzyme (AHSP) pathway
        #     oneOutput: "OMIM:300751"                    ## Anemia, sideroblastic, X-linked, 300751 (3)
    disease-pathway:
      - supportBatch: true
        useTemplating: true ## flag to say templating is being used below
        inputs:
          - id: OMIM
            semantic: Disease
        requestBody:
          body:
            ## API data has no prefix
            ## joinSafe is only needed if the delimiter isn't a comma
            q: "{{ queryInputs }}"
            scopes: subject.PHENO_TYPE
        outputs:
          - id: "ncats.bioplanet"
            semantic: Pathway
        parameters:
          fields: >-
            object.PATHWAY_ID,
            object.PATHWAY_NAME,object.PATHWAY_CATEGORIES,
            subject.DISEASE_NAME,
            relation.GENE_SYMBOL,relation.GENE_ID
          size: 1000
        ## inverse of actively_involved_in
        predicate: actively_involves
        source: "infores:bioplanet"
        response_mapping:
          "$ref": "#/components/x-bte-response-mapping/pathway"
        # testExamples:
        #   - qInput: "OMIM:603909"                        ## Autoimmune lymphoproliferative syndrome, type II, 603909 (3) 
        #     oneOutput: "ncats.bioplanet:bioplanet_26"    ## D4-GDI signaling pathway
```

There'll be 1 operation per combo,  direction (forward / reverse), and object field. For an operation, there'll be the following sections:

* `supportBatch`: `true` when this endpoint can do batch-querying (multiple IDs in 1 query), `false` otherwise
* `useTemplating`: `true`. Don't edit this, it means we're using the latest way of describing the input information (in places like `requestBody`)
* `inputs`: it's a weird format (1 element array, that element is an object with two key-value pairs)
  * `id`: put the starting / subject ID-prefix
  * `semantic`: put the starting / subject biolink-model semantic-type
* `requestBody.body`: when doing a `POST` query, this is where you specify what you're querying with.
  * the `q` field is where the subject-ID goes
  * the `scopes` field is where the name of the API field that has subject-IDs goes (in dot-notation)
  * we like leaving comments on whether the subject-ID in the API data has a prefix or not
  * `{{ queryInputs }}` means BTE will put an array of IDs there (it often strips off the prefix, but not always...)
  * more complicated stuff ("templating") can be done to process the IDs (remove or adding a prefix / suffix) and specify values for other fields (to retrieve specific relationships). See [BioThings dgidb API](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/dgidb/openapi.yml) and other "complicated" examples in the list above, [notes](https://github.com/biothings/call-apis.js/pull/31) [from](https://github.com/biothings/call-apis.js/pull/30) the PRs for this functionality, [internal](https://suwulab.slack.com/archives/CC218TEKC/p1631736378030300?thread_ts=1631051543.343300&cid=CC218TEKC) [Slack](https://suwulab.slack.com/archives/CC218TEKC/p1632532158233300?thread_ts=1632351568.187000&cid=CC218TEKC) links, and [nunjucks](https://mozilla.github.io/nunjucks/templating.html). Note that the top-level property `requestBodyType: object` is used when you set `requestBody.body` to a multi-line string (>-) that represents an object/dictionary (notice the text is enclosed in {})
* `outputs`: it's the same input as the `inputs`
  * id: put the retrieved / object ID-prefix
  * semantic: put the retrieved / object biolink-model semantic-type
* `parameters`:
  * `fields`: this is the fields of the API you want to retrieve, specified using dot-notation. At minimum, it'll have the API field for the object-IDs. Chunlei suggested only listing the fields for relationship info that you want BTE to have. It's a good idea to note what fields you're not listing / using and why.
  * `size`: 1000. At the moment, always set to this amount. Include to ensure that the max number of records that match your query are retrieved
* `predicate`: put the biolink-model predicate picked here
* `source` (optional): this field is for putting an `infores` term that says where this API got the data. In almost all cases, we want to have this (follow the notes above on finding / creating infores terms). If we don't need to specify where the API got the data in more detail, we can remove this field.
* `response-mapping`: this is a reference to a key/part of the other "x-bte" section (see below)
* `testExamples`: notice this section is commented out. This is because we aren't using this section yet (it's in development + hiatus)...But it can be useful to record an example subject-ID input and an object-ID you'd expect in the response. This can then be used when manually testing that the BTE works well with the yaml (see last section below).

Remember to put the key / names of each operation into the x-bte-kgs-operations list in the paths (endpoint) section!

## Writing the `x-bte-response-mapping` section

That's where we will map each field in the parameters.fields to the output or another key (that will be used as the name/id of the edge-attribute in BTE).

You only need 1 response-mapping part per unique combo of field-mappings (so different operations can have the same response-mapping). Remember that the object / output can only map to 1 field, so if there's >=1 that you need to use, those will have to be separate operations and response-mappings.

Each response-mapping has a key/name (used in the operation references). This can be anything and it is often named after the object semantic-type, object-ID-prefix, and whether it's for a special "reverse" operation.

The fields are specified using dot-notation.

Example from [BioPlanet pathway-disease](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/bioplanet/bioplanet-pathway-disease.yaml):

```yaml
  x-bte-response-mapping:
    disease:
      OMIM: subject.PHENO_TYPE   ## no prefix
      pathway_name: object.PATHWAY_NAME
      pathway_categories: object.PATHWAY_CATEGORIES
      disease_name: subject.DISEASE_NAME
      related_genes_symbol: relation.GENE_SYMBOL
      related_genes_ncbigene: relation.GENE_ID
    pathway:
      "ncats.bioplanet": object.PATHWAY_ID   ## no prefix
      pathway_name: object.PATHWAY_NAME
      pathway_categories: object.PATHWAY_CATEGORIES
      disease_name: subject.DISEASE_NAME
      related_genes_symbol: relation.GENE_SYMBOL
      related_genes_ncbigene: relation.GENE_ID
```

Sections:

* 1 key is the object-ID-prefix, and the value is the dot-notation for the field that has the object-IDs. We tend to leave a comment saying whether those IDs are prefixed or not
* pubmed: this is a special key, and the value is the dot-notation for the field holding the PMIDs of publications. BTE will specially handle these. The PMIDs can be plain IDs or prefixed.
* other fields: when we can, we try to use a [biolink-model](https://github.com/biolink/biolink-model/blob/master/biolink-model.yaml) association-slot term (pick the tag/version that BTE is on and look for the `## ASSOCIATION SLOTS` comment heading). When we use it, we add the biolink prefix like this: "biolink:original_subject". Otherwise, we write our own descriptive key (without spaces).
* in a special case, other Translator teams ask us to make BioThings APIs and provide their TRAPI edge-attributes in a special section of the records (usually association.edge-attributes). In this case, we want the key to be `edge-attributes`. During testing, we'll want to check if BTE automatically ingested this properly or not (1 mega-attribute with all the stuff from that field in it would be incorrect).

## For non-BioThings (other) APIs

Examples:

* Biolink (Monarch) api (not BioThings or TRAPI): has annotation on each endpoint described, look [here](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/biolink/openapi.yml)
* [EBI Proteins API](https://github.com/NCATS-Tangerine/translator-api-registry/blob/master/ebi_proteins/openapi.yml)

(WIP to write the guide for writing these)

## Testing after it's written

It can be helpful to paste the yaml into the SmartAPI [editor](https://smart-api.info/editor) or a [yaml-viewer](https://jsonformatter.org/yaml-viewer) to check that the yaml has been written correctly. The SmartAPI editor is nice in that it'll also check that all references are used correctly.

To test that the yaml can be used properly by BTE, you can install a local version of BTE (using [bte-trapi-workspace](https://github.com/biothings/bte-trapi-workspace)). If you have any issues installing BTE, contact a member of the BTE team. Then you can:

* modify the `packages/@biothings-explorer/bte-trapi/src/config/smartapi_overrides.json` file. Set `only_overrides` to `true`, and put a key-value pair into the `apis` section. The key can be arbitrary, and the value can be a file path (starting with file:/// for absolute paths) or a link to a raw yaml file. See the instructions [here](https://github.com/biothings/BioThings_Explorer_TRAPI#using-api_overridetrue) for details on this.
* run `API_OVERRIDE=true npm run smartapi_sync --workspace='@biothings-explorer/bte-trapi'` to set BTE to only use the API yaml you're testing
* start up BTE `npm run debug --workspace='@biothings-explorer/bte-trapi'` and set up a `POST` request to `http://localhost:3000/v1/smartapi/your-id-here/query` where `your-id-here` is replaced with the key you set in the `apis` section.
* put a TRAPI query into the `POST` request's request-body section. One can test each operation, or only a few. For testing an operation, you can set the example subject ID (from the testExamples notes) and semantic type and the object-semantic type (and sometimes the predicate). Then run the `POST` query, and look for the object-ID (from the testExamples notes) in BTE's response. You can also look at the corresponding edge to see if the edge-attributes match what you'd expect from the response-mapping (aka all info is there and is formatted correctly).

If there are issues with testing, talk to a more experienced team-member. Sometimes the issue is with BTE, sometimes with the x-bte annotation written.

## "Deploying": Checking, registering and refreshing registration, connecting to BTE

### Checking

When the SmartAPI yaml with x-bte annotation has been written, we suggest that you send links to the yaml file and corresponding API to Colleen Xu, a member of the BTE team that is the current expert on writing these yamls and x-bte annotation. They can check for things like: 

* correct adherence to Translator standards (whenever possible)
* structuring templated queries to BioThings APIs
* correct use of keywords for TRAPI data-handling (like using `edge-attributes` in response-mapping so BTE can ingest already-TRAPI-formatted edge-attribute data)

### Registering and refreshing the registration

Once the SmartAPI yaml with x-bte annotation is ready, it needs to be registered in the SmartAPI registry [here](https://smart-api.info/add-api). You may need to make an account with the registry by linking your github account.

Often you just need to paste a raw-github link of your SmartAPI yaml (make sure the repo name and branch are what you want them to be, because if you change them the registration will break and need to be deleted / re-registered). Then, press the submit button. 

Afterwards, you should check your [dashboard](https://smart-api.info/dashboard) and validate your yaml, refresh your registration, and do an uptime-check. The validation is to make sure the yaml passes all requirements for a valid SmartAPI yaml. Refreshing your registration pulls the latest version of the SmartAPI file from the raw-github link (this is also good if edits have been made). Finally, the uptime-check will use the examples on the endpoints to check if the API is responsive / up - and then a badge showing the uptime-status will show up on the registration.  

### Connecting to BTE

In almost all cases, you will want your API to "automatically" be used by various ARA tools like BTE, Aragorn, etc. This means you will want to do the following to connect your registered API (with SmartAPI and x-bte annotation) to BTE (which also functions as a Service Provider tool). 

You will want to make a PR to BTE's `include` list, which is in the exports.API_LIST object stored in this [github file](https://github.com/biothings/BioThings_Explorer_TRAPI/blob/main/src/config/apis.js). Inside the list, there are different sections (specified by comments) for the different KP tools that BTE automatically uses when it works as an ARA. In addition, all listed KPs that use x-bte annotation will also automatically be available to other ARA tools like Aragorn through the [BTE's separate Service Provider function](https://smart-api.info/registry?q=36f82f05705c317bac17ddae3a0ea2f0). 

In your edit, you'll want to add an object for your API into the section that fits your API (is it made in collaboration with Multiomics or Text Mining Provider? is it owned by the Su / Wu Labs?). If no section fits your API, contact a member of BTE (Colleen Xu is the current point-person for this part of BTE) to ask for help.

Each object has two key-value pairs, one for the SmartAPI Registration ID (`id`) and one for SmartAPI Registration's name (`name`, aka the API's name specified in info.title of the SmartAPI yaml). This is why we need the API to be registered in the SmartAPI registry (and passing validation) first. 

Once the PR is ready, please contact a member of BTE (anyone should do) to ask about merging and deploying this change to BTE.

If you do not do this, your API will only be accessible through specific URLs that you will have to tell other teams with ARA tools to use. 

## Editing an existing SmartAPI yaml

When editing a SmartAPI yaml with x-bte annotation that has already been registered in the SmartAPI Registry (for the first few times), we strongly suggest putting your edits in a side-branch and making a PR. That gives everyone a chance to do the checking and refreshing-registration process. 

The checking process will be similar (hopefully less rigorous) to the process described above for new APIs. Then the edits would be merged. Because the yaml is already registered, you (if you own the registration) or a member of the Service Provider team can refresh the registration to pull the latest version of the SmartAPI file from the raw-github link. We then suggest doing an uptime-check.

If the API is already connected to BTE (has an entry in the exports.API_LIST's `include` list), BTE should ingest your edited SmartAPI registration during its regular cron job (every 10 min). So after 10 min, if your API is used by BTE or served through BTE's Service Provider function, your latest edits should be deployed.

### Editing x-bte annotation for biolink 3.0.3 qualifier-refactor

Current for 2022-11-14.

DO NOT directly edit the registered yaml; instead, make the edits for qualifiers/biolink-3.0.3 in a different github branch. Then contact Colleen or Jackson to ask about hooking your edited yaml up to BTE's dev instance. The BTE devs ask this because at the moment, Translator wants all qualifier stuff on dev instances of tools only. 

BTE is planning to migrate to biolink-model v3.0.3. The biolink-model update from v2 to v3 involved refactoring predicates and adding qualifiers for chemical-gene and gene-gene relationships. 

For biolink v3.0.3, the types of qualifiers and their possible enumerated values are listed [here](https://github.com/biothings/BioThings_Explorer_TRAPI/issues/512#issuecomment-1273814279). Currently, BTE's dev team is only planning support for qualifier values that are enumerated in the biolink-model. There may be bugs or missing features ("expanding" down an ontology) if ontology-terms or arbitrary strings are used as qualifier values in x-bte annotation. 

To add qualifier-types and their values to an existing operation (in the `x-bte-kgs-operations` section):

* add a field (same level as `predicate`) called `qualifiers`. Its value is an object
  * the keys are the qualifier-type string (aka qualifier_type_id value in TRAPI)
    * don't include a biolink-prefix; BTE will handle that
  * the values are the qualifier's value (aka qualifier_value's value in TRAPI)
    * don't include a biolink-prefix for a qualified_predicate
    * currently, the enumerated-qualifier-values from biolink-model DO NOT need the biolink-prefix 
* for reverse operations, subject- and object-specific qualifier-types from the forward operation will need to be adjusted (replace "subject" with "object" and vice versa)

The DGIdb yaml on the biolink3 branch [here](https://github.com/NCATS-Tangerine/translator-api-registry/blob/biolink3/dgidb/openapi.yml#L476) is a good example of operations with qualifier information. Here is an example of two operations (forward and reverse) from DGIdb with `qualifiers` fields: 

```yaml
    activator:
    ## https://biothings.ncats.io/dgidb/query?q=association.interaction_types:activator
    ## 195 records
      - supportBatch: true
        useTemplating: true ## flag to say templating is being used below
        inputs:
          - id: "CHEMBL.COMPOUND"
            semantic: SmallMolecule
        requestBodyType: object
        requestBody:
          body: >-
            {
              "q": [ {{ queryInputs | wrap( '["' , '","activator"]') }} ],
              "scopes": ["subject.CHEMBL_COMPOUND", "association.interaction_types"]
            }
        parameters:
          fields: >-
            object.NCBIGene,association.interaction_group_score,
            association.interaction_claim_source,association.pmids,association.interaction_types
          size: 1000
        outputs:
          - id: NCBIGene
            semantic: Gene
        ## biolink 2.4.8: used entity_positively_regulates_entity
        predicate: affects
        ## nesting allows this main key to stay the same even with future changes
        qualifiers:
        ## key is the "qualifier_type_id", value is the "qualifier_value" in the TRAPI Edge.qualifiers spec
          qualified_predicate: causes
          object_aspect_qualifier: activity
          object_direction_qualifier: increased
          causal_mechanism_qualifier: activation   ## extra since DGIdb labels these as "activator"
        source: "infores:dgidb"
        response_mapping:
          "$ref": "#/components/x-bte-response-mapping/forward"
        # testExamples:
        #   - qInput: "CHEMBL.COMPOUND:CHEMBL266510"   ## FLINDOKALNER
        #     oneOutput: "NCBIGene:9132"               ## KCNQ4
    activator-rev:
      - supportBatch: true
        useTemplating: true ## flag to say templating is being used below
        inputs:
          - id: NCBIGene
            semantic: Gene
        requestBodyType: object
        requestBody:
          body: >-
            {
              "q": [ {{ queryInputs | wrap( '["' , '","activator"]') }} ],
              "scopes": ["object.NCBIGene", "association.interaction_types"]
            }
        parameters:
          fields: >-
            subject.CHEMBL_COMPOUND,association.interaction_group_score,
            association.interaction_claim_source,association.pmids,association.interaction_types
          size: 1000
        outputs:
          - id: "CHEMBL.COMPOUND"
            semantic: SmallMolecule
        ## biolink 2.4.8: used entity_positively_regulated_by_entity
        predicate: affected_by
        qualifiers:
          qualified_predicate: caused_by
          subject_aspect_qualifier: activity
          subject_direction_qualifier: increased
          causal_mechanism_qualifier: activation   ## extra since DGIdb labels these as "activator"
        source: "infores:dgidb"
        response_mapping:
          "$ref": "#/components/x-bte-response-mapping/reverse"
        # testExamples:
        #   - qInput: "NCBIGene:2983"                 ## GUCY1B1
        #     oneOutput: "CHEMBL.COMPOUND:CHEMBL730   ## NITROGLYCERIN
```
