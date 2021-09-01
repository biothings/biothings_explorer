Goal is to test whether BTE can return the same basic data, even when the query-graph is given with different edge directions.

This is because we are finding that the Translator consortium is sending queries outside the "expected" Predict and Explain templates, and we want to be able to support this.

The queries within a group should return the same information (number of knowledge_graph.nodes, knowledge_graph.edges, results). However, the edges may use inverse predicates. 

## Predict-like

### One-hop

Direction possibilities: &#8594; and &#8592;

1A: Gene ID (KCNMA1) &#8594; Disease (canonical Predict)
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

1B: Gene ID (KCNMA1) &#8592; Disease 
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

Direction possibilities: &#8594; &#8594;, &#8592; &#8594;, &#8592; &#8592;, &#8594; &#8592;

2A: Disease ID (Alzheimer disease) &#8594; BiologicalProcessOrActivity &#8594; SmallMolecule (canonical Predict)
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

2B: Disease ID (Alzheimer disease) &#8592; BiologicalProcessOrActivity &#8594; SmallMolecule
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

2C: Disease ID (Alzheimer disease) &#8592; BiologicalProcessOrActivity &#8592; SmallMolecule
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

2D: Disease ID (Alzheimer disease) &#8594; BiologicalProcessOrActivity &#8592; SmallMolecule
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

Direction possibilities: &#8594; and &#8592;

3A: Pathway ID (RORA activates gene expression (Homo sapiens)) &#8594; Gene ID (CPT1A) (canonical Explain)
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

3B: Pathway ID (RORA activates gene expression (Homo sapiens)) &#8592; Gene ID (CPT1A) (canonical Explain)
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

Direction possibilities: -> <-, -> ->, <- <-, <- ->

4A: SmallMolecule ID (celecoxib) -> Disease <- Gene ID (PTGS1) (canonical Explain)
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

4B: SmallMolecule ID (celecoxib) -> Disease -> Gene ID (PTGS1)
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

4C: SmallMolecule ID (celecoxib) <- Disease <- Gene ID (PTGS1)
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

4D: SmallMolecule ID (celecoxib) <- Disease -> Gene ID (PTGS1)
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