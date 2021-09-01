Goal is to test whether BTE can return the same basic data, even when the query-graph is given with different edge directions.

This is because we are finding that the Translator consortium is sending queries outside the "expected" Predict and Explain templates, and we want to be able to support this.

The queries within a group should return the same information (number of knowledge_graph.nodes, knowledge_graph.edges, results). However, the edges may use inverse predicates. 

## Predict-like

### One-hop

Direction possibilities: → and ←

1A: Gene ID (KCNMA1) → Disease (canonical Predict)
Example edge: NCBIGene:3778-biolink:gene_associated_with_condition-MONDO:0005252
```
{
    "message": {
        "query_graph": {
            "nodes": {
                "n0": {
                    "categories": ["biolink:Gene"],
                    "ids": ["NCBIGene:3778"]
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

1B: Disease → Gene ID (KCNMA1)
Example edge: MONDO:0005252-biolink:condition_associated_with_gene-NCBIGene:3778
```
{
    "message": {
        "query_graph": {
            "nodes": {
                "n0": {
                    "categories": ["biolink:Gene"],
                    "ids": ["NCBIGene:3778"]
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

Direction possibilities: → →, ← →, ← ←, → ←

2A: Disease ID (Alzheimer disease) → BiologicalProcessOrActivity → SmallMolecule (canonical Predict)
Example edges:
- MONDO:0004975-biolink:correlated_with-GO:0019318 (no asymmetrical predicates on this step)
- GO:0019318-biolink:has_participant-PUBCHEM.COMPOUND:206 
```
{
    "message": {
        "query_graph": {
            "nodes": {
                "n0": {
                    "ids": ["MONDO:0004975"],
                    "categories": ["biolink:Disease"]
                },
                "n1": {
                    "categories": ["biolink:BiologicalProcessOrActivity"]
                },
                "n2": {
                    "categories": ["biolink:SmallMolecule"]
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

2B: Disease ID (Alzheimer disease) ← BiologicalProcessOrActivity → SmallMolecule
Example edges:
- GO:0019318-biolink:correlated_with-MONDO:0004975 (no asymmetrical predicates on this step)
- GO:0019318-biolink:has_participant-PUBCHEM.COMPOUND:206 
```
{
    "message": {
        "query_graph": {
            "nodes": {
                "n0": {
                    "ids": ["MONDO:0004975"],
                    "categories": ["biolink:Disease"]
                },
                "n1": {
                    "categories": ["biolink:BiologicalProcessOrActivity"]
                },
                "n2": {
                    "categories": ["biolink:SmallMolecule"]
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

2C: Disease ID (Alzheimer disease) ← BiologicalProcessOrActivity ← SmallMolecule
Example edges: 
- GO:0019318-biolink:correlated_with-MONDO:0004975 (no asymmetrical predicates on this step)
- PUBCHEM.COMPOUND:206-biolink:participates_in-GO:0019318 
```
{
    "message": {
        "query_graph": {
            "nodes": {
                "n0": {
                    "ids": ["MONDO:0004975"],
                    "categories": ["biolink:Disease"]
                },
                "n1": {
                    "categories": ["biolink:BiologicalProcessOrActivity"]
                },
                "n2": {
                    "categories": ["biolink:SmallMolecule"]
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

2D: Disease ID (Alzheimer disease) → BiologicalProcessOrActivity ← SmallMolecule
Example edges: 
- MONDO:0004975-biolink:correlated_with-GO:0019318 (no asymmetrical predicates on this step)
- PUBCHEM.COMPOUND:206-biolink:participates_in-GO:0019318 
```
{
    "message": {
        "query_graph": {
            "nodes": {
                "n0": {
                    "ids": ["MONDO:0004975"],
                    "categories": ["biolink:Disease"]
                },
                "n1": {
                    "categories": ["biolink:BiologicalProcessOrActivity"]
                },
                "n2": {
                    "categories": ["biolink:SmallMolecule"]
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

Direction possibilities: → and ←

3A: Pathway ID (RORA activates gene expression (Homo sapiens)) → Gene ID (CPT1A) (canonical Explain)
Expected edge: REACT:R-HSA-1368082-biolink:has_participant-NCBIGene:1374
```
{
    "message": {
        "query_graph": {
            "nodes": {
                "n0": {
                    "categories": ["biolink:Pathway"],
                    "ids": ["REACT:R-HSA-1368082"]
                },
                "n1": {
                    "categories": ["biolink:Gene"],
                    "ids": ["NCBIGene:1374"]
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

3B: Gene ID (CPT1A) → Pathway ID (RORA activates gene expression (Homo sapiens))
Expected edge: NCBIGene:1374-biolink:participates_in-REACT:R-HSA-1368082
```
{
    "message": {
        "query_graph": {
            "nodes": {
                "n0": {
                    "categories": ["biolink:Pathway"],
                    "ids": ["REACT:R-HSA-1368082"]
                },
                "n1": {
                    "categories": ["biolink:Gene"],
                    "ids": ["NCBIGene:1374"]
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

Direction possibilities: → ←, → →, ← ←, ← →

4A: SmallMolecule ID (celecoxib) → Disease ← Gene ID (PTGS1) (canonical Explain)
Example edges:
- PUBCHEM.COMPOUND:2662-biolink:causes_adverse_event-MONDO:0018874
- NCBIGene:5742-biolink:gene_associated_with_condition-MONDO:0018874 
```
{
    "message": {
        "query_graph": {
            "nodes": {
                "n0": {
                    "ids":["PUBCHEM.COMPOUND:2662"],
                    "categories":["biolink:SmallMolecule"]
                },
                "n1": {
                    "categories":["biolink:Disease"]
               },
                "n2": {
                    "categories":["biolink:Gene"],
                       "ids":["HGNC:9604"]
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

4B: SmallMolecule ID (celecoxib) → Disease → Gene ID (PTGS1)
Example edges:
- PUBCHEM.COMPOUND:2662-biolink:causes_adverse_event-MONDO:0018874
- MONDO:0018874-biolink:condition_associated_with_gene-NCBIGene:5742
```
{
    "message": {
        "query_graph": {
            "nodes": {
                "n0": {
                    "ids":["PUBCHEM.COMPOUND:2662"],
                    "categories":["biolink:SmallMolecule"]
                },
                "n1": {
                    "categories":["biolink:Disease"]
               },
                "n2": {
                    "categories":["biolink:Gene"],
                       "ids":["HGNC:9604"]
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

4C: SmallMolecule ID (celecoxib) ← Disease ← Gene ID (PTGS1)
Example edges:
- MONDO:0018874-biolink:adverse_event_caused_by-PUBCHEM.COMPOUND:2662
- NCBIGene:5742-biolink:gene_associated_with_condition-MONDO:0018874
```
{
    "message": {
        "query_graph": {
            "nodes": {
                "n0": {
                    "ids":["PUBCHEM.COMPOUND:2662"],
                    "categories":["biolink:SmallMolecule"]
                },
                "n1": {
                    "categories":["biolink:Disease"]
               },
                "n2": {
                    "categories":["biolink:Gene"],
                       "ids":["HGNC:9604"]
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

4D: SmallMolecule ID (celecoxib) ← Disease → Gene ID (PTGS1)
Example edges:
- MONDO:0018874-biolink:adverse_event_caused_by-PUBCHEM.COMPOUND:2662
- MONDO:0018874-biolink:condition_associated_with_gene-NCBIGene:5742
```
{
    "message": {
        "query_graph": {
            "nodes": {
                "n0": {
                    "ids":["PUBCHEM.COMPOUND:2662"],
                    "categories":["biolink:SmallMolecule"]
                },
                "n1": {
                    "categories":["biolink:Disease"]
               },
                "n2": {
                    "categories":["biolink:Gene"],
                       "ids":["HGNC:9604"]
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
