Goal is to test whether BTE can return the same basic data, even when the query-graph is given with different edge directions.

This is because we are finding that the Translator consortium is sending queries outside the "expected" Predict and Explain templates, and we want to be able to support this.

Note:
- Ideally, the queries within a group should return the same information (number of knowledge_graph.nodes, knowledge_graph.edges, results). However, the edges may use inverse predicates. However, this may not always happen. See the next bullet point...
- We try to support querying "in both directions" whenever possible: for an association between A and B, one can query with A or B and retrieve the association to the other. However, some resources may not support querying in both directions (maybe some external APIs and TRAPIs). We have many APIs where we can't retrieve the same information in both directions because of the document structure. 

## Predict-like

### One-hop

Direction possibilities: :arrow_right: and :arrow_left:

1A: Gene ID (KCNMA1) :arrow_right: Disease (canonical Predict)

Example edge: 
- predicate: gene_associated_with_condition
- object: MONDO:0021016 (channelopathy) 

Use MyDisease specifically by POSTing to http://localhost:3000/v1/smartapi/671b45c0301c8624abbd26ae78449ca2/query

```
{
    "message": {
        "query_graph": {
            "nodes": {
                "n0": {
                    "categories": ["biolink:Gene"],
                    "ids": ["NCBIGene:3778"],
                    "name": "KCNMA1"
                },
                "n1": {
                    "categories": ["biolink:Disease"]
                }
            },
            "edges": {
                "e01": {
                    "subject": "n0",
                    "object": "n1"
                }
            }
        }
    }
}
```

1B: Disease :arrow_right: Gene ID (KCNMA1)

Example edge (inverted predicate and subject/object): 
- predicate: condition_associated_with_gene
- subject: MONDO:0021016 (channelopathy) 

Use MyDisease specifically by POSTing to http://localhost:3000/v1/smartapi/671b45c0301c8624abbd26ae78449ca2/query

```
{
    "message": {
        "query_graph": {
            "nodes": {
                "n0": {
                    "categories": ["biolink:Gene"],
                    "ids": ["NCBIGene:3778"],
                    "name": "KCNMA1"
                },
                "n1": {
                    "categories": ["biolink:Disease"]
                }
            },
            "edges": {
                "e01": {
                    "subject": "n1",
                    "object": "n0"
                }
            }
        }
    }
}
```

### Two-hop

Direction possibilities: :arrow_right: :arrow_right:, :arrow_left: :arrow_right:, :arrow_left: :arrow_left:, :arrow_right: :arrow_left:

2A: Disease ID (White-Sutton syndrome) :arrow_right: Gene :arrow_right: SequenceVariant (canonical Predict)

Example edge for e0:
- predicate: related_to
- object: NCBIGene:23126 (POGZ) 

Example edge for e1:
- predicate: has_sequence_variant
- object: DBSNP:rs4971043

Use MyVariant specifically by POSTing to http://localhost:3000/v1/smartapi/09c8782d9f4027712e65b95424adba79/query

```
{
    "message": {
        "query_graph": {
            "nodes": {
                "n0": {
                    "ids": ["MONDO:0014606"],
                    "categories": ["biolink:Disease"],
                    "name": "white-sutton syndrome"
                },
                "n1": {
                    "categories": ["biolink:Gene"]
                },
                "n2": {
                    "categories": ["biolink:SequenceVariant"]
                }
            },
            "edges": {
                "e0": {
                    "subject": "n0",
                    "object": "n1"
                },
                "e1": {
                    "subject": "n1",
                    "object": "n2"
                }
            }
        }
    }
}
```

2B: Disease ID (White-Sutton syndrome) :arrow_left: Gene :arrow_right: SequenceVariant

Example edge for e0 (inverted subject/object):
- predicate: related_to
- subject: NCBIGene:23126 (POGZ) 

Example edge for e1:
- predicate: has_sequence_variant
- object: DBSNP:rs4971043

Use MyVariant specifically by POSTing to http://localhost:3000/v1/smartapi/09c8782d9f4027712e65b95424adba79/query

```
{
    "message": {
        "query_graph": {
            "nodes": {
                "n0": {
                    "ids": ["MONDO:0014606"],
                    "categories": ["biolink:Disease"],
                    "name": "white-sutton syndrome"
                },
                "n1": {
                    "categories": ["biolink:Gene"]
                },
                "n2": {
                    "categories": ["biolink:SequenceVariant"]
                }
            },
            "edges": {
                "e0": {
                    "subject": "n1",
                    "object": "n0"
                },
                "e1": {
                    "subject": "n1",
                    "object": "n2"
                }
            }
        }
    }
}
```

2C: Disease ID (White-Sutton syndrome) :arrow_left: Gene :arrow_left: SequenceVariant

Example edge for e0 (inverted subject/object):
- predicate: related_to
- subject: NCBIGene:23126 (POGZ) 

Example edge for e1 (inverted predicate and subject/object):
- predicate: is_sequence_variant_of 
- subject: DBSNP:rs4971043

Use MyVariant specifically by POSTing to http://localhost:3000/v1/smartapi/09c8782d9f4027712e65b95424adba79/query

```
{
    "message": {
        "query_graph": {
            "nodes": {
                "n0": {
                    "ids": ["MONDO:0014606"],
                    "categories": ["biolink:Disease"],
                    "name": "white-sutton syndrome"
                },
                "n1": {
                    "categories": ["biolink:Gene"]
                },
                "n2": {
                    "categories": ["biolink:SequenceVariant"]
                }
            },
            "edges": {
                "e0": {
                    "subject": "n1",
                    "object": "n0"
                },
                "e1": {
                    "subject": "n2",
                    "object": "n1"
                }
            }
        }
    }
}
```

2D: Disease ID (White-Sutton syndrome) :arrow_right: Gene :arrow_left: SequenceVariant

Example edge for e0:
- predicate: related_to
- object: NCBIGene:23126 (POGZ) 

Example edge for e1 (inverted predicate and subject/object):
- predicate: is_sequence_variant_of 
- subject: DBSNP:rs4971043

Use MyVariant specifically by POSTing to http://localhost:3000/v1/smartapi/09c8782d9f4027712e65b95424adba79/query

```
{
    "message": {
        "query_graph": {
            "nodes": {
                "n0": {
                    "ids": ["MONDO:0014606"],
                    "categories": ["biolink:Disease"],
                    "name": "white-sutton syndrome"
                },
                "n1": {
                    "categories": ["biolink:Gene"]
                },
                "n2": {
                    "categories": ["biolink:SequenceVariant"]
                }
            },
            "edges": {
                "e0": {
                    "subject": "n0",
                    "object": "n1"
                },
                "e1": {
                    "subject": "n2",
                    "object": "n1"
                }
            }
        }
    }
}
```

## Explain-like

### One-hop

Direction possibilities: :arrow_right: and :arrow_left:

3A: Pathway ID (RORA activates gene expression (Homo sapiens)) :arrow_right: Gene ID (CPT1A) (canonical Explain)

Example edge: 
- predicate: has_participant
- object: NCBIGene:1374 (CPT1A) 

```
{
    "message": {
        "query_graph": {
            "nodes": {
                "n0": {
                    "categories": ["biolink:Pathway"],
                    "ids": ["REACT:R-HSA-1368082"],
                    "name": "RORA activates gene expression (Homo sapiens)"
                },
                "n1": {
                    "categories": ["biolink:Gene"],
                    "ids": ["NCBIGene:1374"],
                    "name": "CPT1A"
                }
            },
            "edges": {
                "e01": {
                    "subject": "n0",
                    "object": "n1"
                }
            }
        }
    }
}
```

3B: Gene ID (CPT1A) :arrow_right: Pathway ID (RORA activates gene expression (Homo sapiens))

Example edge (inverted predicate and subject/object): 
- predicate: participates_in
- subject: NCBIGene:1374 (CPT1A) 

```
{
    "message": {
        "query_graph": {
            "nodes": {
                "n0": {
                    "categories": ["biolink:Pathway"],
                    "ids": ["REACT:R-HSA-1368082"],
                    "name": "RORA activates gene expression (Homo sapiens)"
                },
                "n1": {
                    "categories": ["biolink:Gene"],
                    "ids": ["NCBIGene:1374"],
                    "name": "CPT1A"
                }
            },
            "edges": {
                "e01": {
                    "subject": "n1",
                    "object": "n0"
                }
            }
        }
    }
}
```

### Two-hop

Direction possibilities: :arrow_right: :arrow_left:, :arrow_right: :arrow_right:, :arrow_left: :arrow_left:, :arrow_left: :arrow_right:

4A: SmallMolecule ID (celecoxib) :arrow_right: Disease :arrow_left: Gene ID (PTGS1) (canonical Explain)

Example edge for e0:
- predicate: treats
- object: MONDO:0004992 (cancer) 

Example edge for e1:
- predicate: affects_risk_for
- object: MONDO:0004992 (cancer) 

Use Biothings SEMMEDDB specifically by POSTing to http://localhost:3000/v1/smartapi/1d288b3a3caf75d541ffaae3aab386c8/query

```
{
    "message": {
        "query_graph": {
            "nodes": {
                "n0": {
                    "ids":["PUBCHEM.COMPOUND:2662"],
                    "categories":["biolink:SmallMolecule"],
                    "name": "celecoxib"
                },
                "n1": {
                    "categories":["biolink:Disease"]
               },
                "n2": {
                    "categories":["biolink:Gene"],
                    "ids":["HGNC:9604"],
                    "name": "PTGS1"
               }
            },
            "edges": {
                "e0": {
                    "subject": "n0",
                    "object": "n1"
                },
                "e1": {
                    "subject": "n2",
                    "object": "n1"
                }
            }
        }
    }
}
```

4B: SmallMolecule ID (celecoxib) :arrow_right: Disease :arrow_right: Gene ID (PTGS1)

Example edge for e0:
- predicate: treats
- object: MONDO:0004992 (cancer) 

Example edge for e1 (inverted predicate and subject/object):
- predicate: risk_affected_by
- subject: MONDO:0004992 (cancer) 

Use Biothings SEMMEDDB specifically by POSTing to http://localhost:3000/v1/smartapi/1d288b3a3caf75d541ffaae3aab386c8/query

```
{
    "message": {
        "query_graph": {
            "nodes": {
                "n0": {
                    "ids":["PUBCHEM.COMPOUND:2662"],
                    "categories":["biolink:SmallMolecule"],
                    "name": "celecoxib"
                },
                "n1": {
                    "categories":["biolink:Disease"]
               },
                "n2": {
                    "categories":["biolink:Gene"],
                    "ids":["HGNC:9604"],
                    "name": "PTGS1"
               }
            },
            "edges": {
                "e0": {
                    "subject": "n0",
                    "object": "n1"
                },
                "e1": {
                    "subject": "n1",
                    "object": "n2"
                }
            }
        }
    }
}
```

4C: SmallMolecule ID (celecoxib) :arrow_left: Disease :arrow_left: Gene ID (PTGS1)

Example edge for e0 (inverted predicate and subject/object):
- predicate: treated_by
- subject: MONDO:0004992 (cancer) 

Example edge for e1:
- predicate: affects_risk_for
- object: MONDO:0004992 (cancer) 

Use Biothings SEMMEDDB specifically by POSTing to http://localhost:3000/v1/smartapi/1d288b3a3caf75d541ffaae3aab386c8/query

```
{
    "message": {
        "query_graph": {
            "nodes": {
                "n0": {
                    "ids":["PUBCHEM.COMPOUND:2662"],
                    "categories":["biolink:SmallMolecule"],
                    "name": "celecoxib"
                },
                "n1": {
                    "categories":["biolink:Disease"]
               },
                "n2": {
                    "categories":["biolink:Gene"],
                    "ids":["HGNC:9604"],
                    "name": "PTGS1"
               }
            },
            "edges": {
                "e0": {
                    "subject": "n0",
                    "object": "n1"
                },
                "e1": {
                    "subject": "n1",
                    "object": "n2"
                }
            }
        }
    }
}
```

4D: SmallMolecule ID (celecoxib) :arrow_left: Disease :arrow_right: Gene ID (PTGS1)

Example edge for e0 (inverted predicate and subject/object):
- predicate: treated_by
- subject: MONDO:0004992 (cancer) 

Example edge for e1 (inverted predicate and subject/object):
- predicate: risk_affected_by
- subject: MONDO:0004992 (cancer) 

Use Biothings SEMMEDDB specifically by POSTing to http://localhost:3000/v1/smartapi/1d288b3a3caf75d541ffaae3aab386c8/query

```
{
    "message": {
        "query_graph": {
            "nodes": {
                "n0": {
                    "ids":["PUBCHEM.COMPOUND:2662"],
                    "categories":["biolink:SmallMolecule"],
                    "name": "celecoxib"
                },
                "n1": {
                    "categories":["biolink:Disease"]
               },
                "n2": {
                    "categories":["biolink:Gene"],
                    "ids":["HGNC:9604"],
                    "name": "PTGS1"
               }
            },
            "edges": {
                "e0": {
                    "subject": "n0",
                    "object": "n1"
                },
                "e1": {
                    "subject": "n1",
                    "object": "n2"
                }
            }
        }
    }
}
```
