const QueryGraphHelpder = require("../../../../src/controllers/QueryGraphHandler/helper");
const reverse = require("../../../../src/controllers/QueryGraphHandler/reverse");
jest.mock("../../../../src/controllers/QueryGraphHandler/reverse");

describe("Test helper moduler", () => {
    const nodeObject1 = {
        getID() {
            return "n01"
        },
        getCategory() {
            return "Node1Type"
        }
    }
    const nodeObject2 = {
        getID() {
            return "n02"
        },
        getCategory() {
            return "Node2Type"
        }
    }
    const helper = new QueryGraphHelpder();
    describe("Test _getInputQueryNodeID function", () => {

        test("If edge is reversed, should return the node ID of the object", () => {

            const edgeObject = {
                getObject() {
                    return nodeObject1
                },
                getSubject() {
                    return nodeObject2
                },
                isReversed() {
                    return true;
                }
            }
            const record = {
                $edge_metadata: {
                    trapi_qEdge_obj: edgeObject
                }
            }
            const res = helper._getInputQueryNodeID(record);
            expect(res).toEqual('n01')
        })

        test("If edge is not reversed, should return the node ID of the subject", () => {

            const edgeObject = {
                getObject() {
                    return nodeObject1
                },
                getSubject() {
                    return nodeObject2
                },
                isReversed() {
                    return false;
                }
            }
            const record = {
                $edge_metadata: {
                    trapi_qEdge_obj: edgeObject
                }
            }
            const res = helper._getInputQueryNodeID(record);
            expect(res).toEqual('n02')
        })
    })

    describe("Test _getOutputQueryNodeID function", () => {

        test("If edge is reversed, should return the node ID of the subject", () => {

            const edgeObject = {
                getObject() {
                    return nodeObject1
                },
                getSubject() {
                    return nodeObject2
                },
                isReversed() {
                    return true;
                }
            }
            const record = {
                $edge_metadata: {
                    trapi_qEdge_obj: edgeObject
                }
            }
            const res = helper._getOutputQueryNodeID(record);
            expect(res).toEqual('n02')
        })

        test("If edge is not reversed, should return the node ID of the object", () => {

            const edgeObject = {
                getObject() {
                    return nodeObject1
                },
                getSubject() {
                    return nodeObject2
                },
                isReversed() {
                    return false;
                }
            }
            const record = {
                $edge_metadata: {
                    trapi_qEdge_obj: edgeObject
                }
            }
            const res = helper._getOutputQueryNodeID(record);
            expect(res).toEqual('n01')
        })
    })
    describe("Test _getInputID function", () => {

        test("If edge is reversed, should return the primary ID of the output", () => {

            const edgeObject = {
                isReversed() {
                    return true;
                }
            }
            const record = {
                $edge_metadata: {
                    trapi_qEdge_obj: edgeObject
                },
                $input: {
                    obj: {
                        primaryID: "input"
                    }
                },
                $output: {
                    obj: {
                        primaryID: "output"
                    }
                },
            }
            const res = helper._getInputID(record);
            expect(res).toEqual('output')
        })

        test("If edge is not reversed, should return the node ID of the subject", () => {

            const edgeObject = {
                isReversed() {
                    return false;
                }
            }
            const record = {
                $edge_metadata: {
                    trapi_qEdge_obj: edgeObject
                },
                $input: {
                    obj: {
                        primaryID: "input"
                    }
                },
                $output: {
                    obj: {
                        primaryID: "output"
                    }
                },
            }
            const res = helper._getInputID(record);
            expect(res).toEqual('input')
        })
    })

    describe("Test _getOutputID function", () => {

        test("If edge is reversed, should return the node ID of the subject", () => {

            const edgeObject = {
                isReversed() {
                    return true;
                }
            }
            const record = {
                $edge_metadata: {
                    trapi_qEdge_obj: edgeObject
                },
                $input: {
                    obj: {
                        primaryID: "input"
                    }
                },
                $output: {
                    obj: {
                        primaryID: "output"
                    }
                },
            }
            const res = helper._getOutputID(record);
            expect(res).toEqual('input')
        })
    })

    test("If edge is not reversed, should return the node ID of the object", () => {

        const edgeObject = {
            isReversed() {
                return false;
            }
        }
        const record = {
            $edge_metadata: {
                trapi_qEdge_obj: edgeObject
            },
            $input: {
                obj: {
                    primaryID: "input"
                }
            },
            $output: {
                obj: {
                    primaryID: "output"
                }
            },
        }
        const res = helper._getOutputID(record);
        expect(res).toEqual('output')
    })

    describe("Test _getAPI function", () => {
        test("Edge Metadata including api name should return the name", () => {
            const record = {
                $edge_metadata: {
                    api_name: 'MyGene.info API'
                }
            }
            const res = helper._getAPI(record);
            expect(res).toEqual('MyGene.info API')
        })

        test("Edge Metadata NOT including api name should return an empty string", () => {
            const record = {
                $edge_metadata: {
                    api_name1: 'MyGene.info API'
                }
            }
            const res = helper._getAPI(record);
            expect(res).toEqual('')
        })
    })

    describe("Test _getAPI function", () => {
        test("Edge Metadata including api name should return the name", () => {
            const record = {
                $edge_metadata: {
                    api_name: 'MyGene.info API'
                }
            }
            const res = helper._getAPI(record);
            expect(res).toEqual('MyGene.info API')
        })

        test("Edge Metadata NOT including api name should return an empty string", () => {
            const record = {
                $edge_metadata: {
                    api_name1: 'MyGene.info API'
                }
            }
            const res = helper._getAPI(record);
            expect(res).toEqual('')
        })
    })

    describe("Test _getSource function", () => {
        test("Edge Metadata including source should return the source", () => {
            const record = {
                $edge_metadata: {
                    api_name: 'MyGene.info API',
                    source: 'CPDB'
                }
            }
            const res = helper._getSource(record);
            expect(res).toEqual('CPDB')
        })

        test("Edge Metadata NOT including source should return an empty string", () => {
            const record = {
                $edge_metadata: {
                    api_name1: 'MyGene.info API'
                }
            }
            const res = helper._getSource(record);
            expect(res).toEqual('')
        })
    })

    test("Test _createUniqueEdgeID function", () => {
        const edgeObject = {
            isReversed() {
                return false;
            }
        }
        const record = {
            $edge_metadata: {
                trapi_qEdge_obj: edgeObject,
                api_name: 'MyGene.info API',
                source: 'CPDB',
                predicate: 'related_to'
            },
            $input: {
                obj: {
                    primaryID: "input"
                }
            },
            $output: {
                obj: {
                    primaryID: "output"
                }
            },
        }
        const res = helper._createUniqueEdgeID(record);
        expect(res).toEqual('input-output-biolink:related_to-MyGene.info API-CPDB')
    })

    describe("Test _getInputCategory function", () => {

        test("If edge is reversed, should return the category of the object", () => {

            const edgeObject = {
                isReversed() {
                    return true;
                },
                getObject() {
                    return nodeObject1
                },
                getSubject() {
                    return nodeObject2
                },
            }
            const record = {
                $edge_metadata: {
                    trapi_qEdge_obj: edgeObject
                },
                $input: {
                    obj: {
                        primaryID: "input"
                    }
                },
                $output: {
                    obj: {
                        primaryID: "output"
                    }
                },
            }
            const res = helper._getInputCategory(record);
            expect(res).toEqual('Node1Type')
        })

        test("If edge is not reversed, should return the node ID of the subject", () => {

            const edgeObject = {
                isReversed() {
                    return false;
                },
                getObject() {
                    return nodeObject1
                },
                getSubject() {
                    return nodeObject2
                },
            }
            const record = {
                $edge_metadata: {
                    trapi_qEdge_obj: edgeObject
                },
                $input: {
                    obj: {
                        primaryID: "input"
                    }
                },
                $output: {
                    obj: {
                        primaryID: "output"
                    }
                },
            }
            const res = helper._getInputCategory(record);
            expect(res).toEqual('Node2Type')
        })
    })

    describe("Test _getOutputCategory function", () => {

        test("If edge is reversed, should return the node ID of the subject", () => {

            const edgeObject = {
                isReversed() {
                    return true;
                },
                getObject() {
                    return nodeObject1
                },
                getSubject() {
                    return nodeObject2
                },
            }
            const record = {
                $edge_metadata: {
                    trapi_qEdge_obj: edgeObject
                },
                $input: {
                    obj: {
                        primaryID: "input"
                    }
                },
                $output: {
                    obj: {
                        primaryID: "output"
                    }
                },
            }
            const res = helper._getOutputCategory(record);
            expect(res).toEqual('Node2Type')
        })
    })

    test("If edge is not reversed, should return the node ID of the object", () => {

        const edgeObject = {
            isReversed() {
                return false;
            },
            getObject() {
                return nodeObject1
            },
            getSubject() {
                return nodeObject2
            },
        }
        const record = {
            $edge_metadata: {
                trapi_qEdge_obj: edgeObject
            },
            $input: {
                obj: {
                    primaryID: "input"
                }
            },
            $output: {
                obj: {
                    primaryID: "output"
                }
            },
        }
        const res = helper._getOutputCategory(record);
        expect(res).toEqual('Node1Type')
    })

    describe("Test _getInputLabel function", () => {

        test("If edge is reversed, should return the label of the output", () => {

            const edgeObject = {
                isReversed() {
                    return true;
                }
            }
            const record = {
                $edge_metadata: {
                    trapi_qEdge_obj: edgeObject
                },
                $input: {
                    obj: {
                        primaryID: "input",
                        label: 'inputLabel'
                    },
                },
                $output: {
                    obj: {
                        primaryID: "output",
                        label: 'outputLabel'
                    },
                },
            }
            const res = helper._getInputLabel(record);
            expect(res).toEqual('outputLabel')
        })

        test("If edge is not reversed, should return the node label of the subject", () => {

            const edgeObject = {
                isReversed() {
                    return false;
                }
            }
            const record = {
                $edge_metadata: {
                    trapi_qEdge_obj: edgeObject
                },
                $input: {
                    obj: {
                        primaryID: "input",
                        label: 'inputLabel'
                    },
                },
                $output: {
                    obj: {
                        primaryID: "output",
                        label: 'outputLabel'
                    },
                },
            }
            const res = helper._getInputLabel(record);
            expect(res).toEqual('inputLabel')
        })
    })

    describe("Test _getOutputLabel function", () => {

        test("If edge is reversed, should return the label of the subject", () => {

            const edgeObject = {
                isReversed() {
                    return true;
                },
                getObject() {
                    return nodeObject1
                },
                getSubject() {
                    return nodeObject2
                },
            }
            const record = {
                $edge_metadata: {
                    trapi_qEdge_obj: edgeObject
                },
                $input: {
                    obj: {
                        primaryID: "input",
                        label: 'inputLabel'
                    },
                },
                $output: {
                    obj: {
                        primaryID: "output",
                        label: 'outputLabel'
                    },
                },
            }
            const res = helper._getOutputLabel(record);
            expect(res).toEqual('inputLabel')
        })
    })

    test("If edge is not reversed, should return the node ID of the object", () => {

        const edgeObject = {
            isReversed() {
                return false;
            },
            getObject() {
                return nodeObject1
            },
            getSubject() {
                return nodeObject2
            },
        }
        const record = {
            $edge_metadata: {
                trapi_qEdge_obj: edgeObject
            },
            $input: {
                obj: {
                    primaryID: "input",
                    label: 'inputLabel'
                },
            },
            $output: {
                obj: {
                    primaryID: "output",
                    label: 'outputLabel'
                },
            },
        }
        const res = helper._getOutputLabel(record);
        expect(res).toEqual('outputLabel')
    })

    describe("Test _getInputEquivalentIdentifiers function", () => {

        test("If edge is reversed, should return the curies of the output", () => {

            const edgeObject = {
                isReversed() {
                    return true;
                }
            }
            const record = {
                $edge_metadata: {
                    trapi_qEdge_obj: edgeObject
                },
                $input: {
                    obj: {
                        primaryID: "input",
                        label: 'inputLabel',
                        curies: ['123', '456']
                    },
                },
                $output: {
                    obj: {
                        primaryID: "output",
                        label: 'outputLabel',
                        curies: [
                            '789'
                        ]
                    },
                },
            }
            const res = helper._getInputEquivalentIds(record);
            expect(res).toEqual(['789'])
        })

        test("If error occurred, return null", () => {

            const edgeObject = {
                isReversed() {
                    throw new Error();
                }
            }
            const record = {
                $edge_metadata: {
                    trapi_qEdge_obj: edgeObject
                },
                $input: {
                    obj: {
                        primaryID: "input",
                        label: 'inputLabel',
                        curies: ['123', '456']
                    },
                },
                $output: {
                    obj: {
                        primaryID: "output",
                        label: 'outputLabel',
                        curies: [
                            '789'
                        ]
                    },
                },
            }
            const res = helper._getInputEquivalentIds(record);
            expect(res).toBeNull;
        })

        test("If edge is not reversed, should return the curies of the subject", () => {

            const edgeObject = {
                isReversed() {
                    return false;
                }
            }
            const record = {
                $edge_metadata: {
                    trapi_qEdge_obj: edgeObject
                },
                $input: {
                    obj: {
                        primaryID: "input",
                        label: 'inputLabel',
                        curies: ['123', '456']
                    },
                },
                $output: {
                    obj: {
                        primaryID: "output",
                        label: 'outputLabel',
                        curies: [
                            '789'
                        ]
                    },
                },
            }
            const res = helper._getInputEquivalentIds(record);
            expect(res).toEqual(['123', '456'])
        })
    })

    describe("Test _getOutputEquivalentIdentifiers function", () => {

        test("If edge is reversed, should return the curies of the subject", () => {

            const edgeObject = {
                isReversed() {
                    return true;
                },
                getObject() {
                    return nodeObject1
                },
                getSubject() {
                    return nodeObject2
                },
            }
            const record = {
                $edge_metadata: {
                    trapi_qEdge_obj: edgeObject
                },
                $input: {
                    obj: {
                        primaryID: "input",
                        label: 'inputLabel',
                        curies: ['123', '456']
                    },
                },
                $output: {
                    obj: {
                        primaryID: "output",
                        label: 'outputLabel',
                        curies: [
                            '789'
                        ]
                    },
                },
            }
            const res = helper._getOutputEquivalentIds(record);
            expect(res).toEqual(['123', '456'])
        })
    })

    test("If error occurred, return null", () => {

        const edgeObject = {
            isReversed() {
                throw new Error();
            }
        }
        const record = {
            $edge_metadata: {
                trapi_qEdge_obj: edgeObject
            },
            $input: {
                obj: {
                    primaryID: "input",
                    label: 'inputLabel',
                    curies: ['123', '456']
                },
            },
            $output: {
                obj: {
                    primaryID: "output",
                    label: 'outputLabel',
                    curies: [
                        '789'
                    ]
                },
            },
        }
        const res = helper._getOutputEquivalentIds(record);
        expect(res).toBeNull;
    })

    test("If edge is not reversed, should return the curies of the object", () => {

        const edgeObject = {
            isReversed() {
                return false;
            },
            getObject() {
                return nodeObject1
            },
            getSubject() {
                return nodeObject2
            },
        }
        const record = {
            $edge_metadata: {
                trapi_qEdge_obj: edgeObject
            },
            $input: {
                obj: {
                    primaryID: "input",
                    label: 'inputLabel',
                    curies: ['123', '456']
                },
            },
            $output: {
                obj: {
                    primaryID: "output",
                    label: 'outputLabel',
                    curies: [
                        '789'
                    ]
                },
            },
        }
        const res = helper._getOutputEquivalentIds(record);
        expect(res).toEqual(['789'])
    })

    test("Test _generateHash function", () => {
        const res = helper._generateHash('123');
        expect(res.length).toBe(32);
        const res1 = helper._generateHash('kkkkkkkkk');
        expect(res1.length).toBe(32);
    })

    describe("Test _getPredicate function", () => {
        test("return original predicate if edge is not reversed", () => {
            reverse.reverse.mockResolvedValue('hello');
            const edgeObject = {
                isReversed() {
                    return false;
                }
            }
            const record = {
                $edge_metadata: {
                    trapi_qEdge_obj: edgeObject,
                    predicate: "treats"
                }
            }
            const res = helper._getPredicate(record);
            expect(res).toEqual("biolink:treats");
        })

        test("return reversed predicate if edge is reversed", () => {
            reverse.reverse.mockReturnValueOnce('hello');
            const edgeObject = {
                isReversed() {
                    return true;
                }
            }
            const record = {
                $edge_metadata: {
                    trapi_qEdge_obj: edgeObject,
                    predicate: "treats"
                }
            }
            const res = helper._getPredicate(record);
            expect(res).toEqual("biolink:hello");
        })
    })
})
