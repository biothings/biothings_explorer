# BioThings Explorer TRAPI API

[![Test with workspace](https://github.com/biothings/BioThings_Explorer_TRAPI/actions/workflows/test_ws_codecov.yml/badge.svg)](https://github.com/biothings/BioThings_Explorer_TRAPI/actions/workflows/test_ws_codecov.yml)
[![codecov](https://codecov.io/gh/biothings/BioThings_Explorer_TRAPI/branch/main/graph/badge.svg?token=I4A29PQQJK)](https://codecov.io/gh/biothings/BioThings_Explorer_TRAPI)
[![ci-cd](https://github.com/biothings/BioThings_Explorer_TRAPI/actions/workflows/deploy.yml/badge.svg)](https://github.com/biothings/BioThings_Explorer_TRAPI/actions/workflows/deploy.yml)

## Introduction

This GitHub repo serves as the development repo for the TRAPI API implementation of **BioThings Explorer (BTE)**. BTE is an engine for autonomously querying a distributed knowledge graph. The distributed knowledge graph is made up of biomedical APIs that have been annotated with semantically-precise descriptions of their inputs and outputs in the [SmartAPI registry](https://smart-api.info/). This project is primarily funded by the [NCATS Translator project](https://ncats.nih.gov/translator). There is also an older [python version of BioThings Explorer](https://github.com/biothings/biothings_explorer) that is currently not being actively developed.

An older version of the meta knowledge graph that is consumed by BTE is in this figure (which, although older, gives a nice conceptual visualization of API interoperability):

![BTE Meta-KG](diagrams/smartapi_metagraph.png "BioThings Explorer metagraph")

### What's TRAPI?

TRAPI stands for [Translator Reasoner API](https://github.com/NCATSTranslator/ReasonerAPI). It is a standard defined for APIs developed within NCATS Biomedical Translator project to facilitate information exchange between resources. BTE exports results via TRAPI to maintain interoperability with other Translator tools. BTE can also _consume_ knowledge resources that expose the TRAPI interface, but it also can consume APIs that have been annotated in the [SmartAPI registry](https://smart-api.info/) using the [x-bte extension](https://x-bte-extension.readthedocs.io/en/latest/index.html) to the OpenAPI specification.

### Trapi API Implementation

```mermaid
sequenceDiagram
autonumber
participant I as index.js - query()
participant QG as query_graph.js
participant BEQ as batch_edge_query.js
participant Q2A as qedge2apiedge.js
participant R as query_results.js
participant C as call-apis module

note over I, R: query_graph_handler module

I->>QG: processQueryGraph()
QG->>QG: Process TRAPI Query Graph Object into <br/> internal qEdge and qXEdge representation
note right of QG: qEdge - Edge in TRAPI query graph <br/> qXEdge - Internal UpdatedExeEdge representation <br/> of a qEdge to be executed
QG->>I: return qXEdges

I->>I: Inferred Mode: create <br/> templated queries

loop Executing with Edge Manager
I->>I: while there are unexecuted qXEdges, <br/> get next qXEdge

I->>BEQ: BatchEdgeQueryHandler()
BEQ->>BEQ: NodesUpdateHandler(): get equivalent IDs
BEQ->>BEQ: cacheHandler(): fetch cached records

alt if there are uncached qXEdges
BEQ->>Q2A: QEdge2APIEdgeHandler()
Q2A->>Q2A: convert qXEdges into API calls by using <br/> metaKG to get metaEdges for qXEdge
Q2A->>BEQ: return metaXEdges
note right of BEQ: metaEdge - An edge in the metaKG <br/> metaXEdge - A metaEdge pair with a qXEdge
BEQ->>C: query()
C->>C: make API calls in batches <br/> and merge results
C->>BEQ: return records from APIs
end

BEQ->>BEQ: cacheHandler(): cache result records
note right of BEQ: record - A single unit of transformed <br/> data from a sub-query response

BEQ->>I: return records

I->>I: Store records/update edge manager
I->>I: Mark Edge as Executed
end

I->>R: trapiResultsAssembler
R->>R: assemble and convert records into <br/> final return results
R->>I: put results in bteGraph
note left of R: result - 1 item of the array in the <br/> TRAPI response (message.results)
I->>I: bteGraph: prune not fully connected <br/> results from graph
```

## Try it Out!

### Live TRAPI Instance

We maintain a live instance of this application at https://api.bte.ncats.io/ that can be used for testing. Query Examples can be found [here](/examples).

### Local installations

See [Installation documentation](./docs/INSTALLATION.md).

### Usage

See [Usage documentation](./docs/USAGE.md).
