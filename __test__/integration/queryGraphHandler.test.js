const QueryGraphHandler = require("../../src/controllers/QueryGraphHandler/query_graph");
const QNode = require("../../src/controllers/QueryGraphHandler/query_node");
const QEdge = require("../../src/controllers/QueryGraphHandler/query_edge");

describe("Testing QueryGraphHandler Module", () => {
    const disease_entity_node = {
        category: "biolink:Disease",
        id: "MONDO:0005737"
    };
    const gene_class_node = {
        category: "biolink:Gene"
    };
    const chemical_class_node = {
        category: "biolink:ChemicalSubstance"
    };
    const pathway_class_node = {
        category: "biolink:Pathways"
    };
    const phenotype_class_node = {
        category: "biolink:Phenotype"
    };
    const OneHopQuery = {
        nodes: {
            n0: disease_entity_node,
            n1: gene_class_node
        },
        edges: {
            e01: {
                subject: "n0",
                object: "n1"
            }
        }
    };

    const OneHopQueryReverse = {
        nodes: {
            n1: disease_entity_node,
            n0: gene_class_node,
        },
        edges: {
            e01: {
                subject: "n0",
                object: "n1"
            }
        }
    };

    const TwoHopQuery = {
        nodes: {
            n0: disease_entity_node,
            n1: gene_class_node,
            n2: chemical_class_node,
        },
        edges: {
            e01: {
                subject: "n0",
                object: "n1"
            },
            e02: {
                subject: "n1",
                object: "n2"
            },
        }
    };

    const TwoHopBranchedQuery = {
        nodes: {
            n0: disease_entity_node,
            n1: gene_class_node,
            n2: chemical_class_node,
            n3: phenotype_class_node,
        },
        edges: {
            e01: {
                subject: "n0",
                object: "n1"
            },
            e02: {
                subject: "n1",
                object: "n2"
            },
            e03: {
                subject: "n1",
                object: "n3"
            }
        }
    };

    const FourHopQuery = {
        nodes: {
            n0: disease_entity_node,
            n1: gene_class_node,
            n2: chemical_class_node,
            n3: phenotype_class_node,
            n4: pathway_class_node,
        },
        edges: {
            e01: {
                subject: "n0",
                object: "n1"
            },
            e02: {
                subject: "n1",
                object: "n2"
            },
            e03: {
                subject: "n2",
                object: "n3"
            },
            e04: {
                subject: "n3",
                object: "n4"
            },
        }
    };

    describe("test _storeNodes function", () => {

        test("test if storeNodes with one hop query", async () => {
            let handler = new QueryGraphHandler(OneHopQuery);
            let nodes = handler._storeNodes();
            expect(nodes).toHaveProperty("n0");
            expect(nodes).not.toHaveProperty("n2");
            expect(nodes.n0).toBeInstanceOf(QNode);
        });

        test("test if storeNodes with multi hop query", async () => {
            let handler = new QueryGraphHandler(FourHopQuery);
            let nodes = handler._storeNodes();
            expect(nodes).toHaveProperty("n0");
            expect(nodes).toHaveProperty("n3");
            expect(nodes.n0).toBeInstanceOf(QNode);
            expect(nodes.n3).toBeInstanceOf(QNode);
        });
    });

    describe("test _storeEdges function", () => {

        test("test storeEdges with one hop query", async () => {
            let handler = new QueryGraphHandler(OneHopQuery);
            let edges = handler._storeEdges();
            expect(edges).toHaveProperty("e01");
            expect(edges).not.toHaveProperty("e02");
            expect(edges.e01).toBeInstanceOf(QEdge);
            expect(edges.e01.getSubject()).toBeInstanceOf(QNode);
        });

        test("test storeEdges with multi hop query", async () => {
            let handler = new QueryGraphHandler(FourHopQuery);
            let edges = handler._storeEdges();
            expect(edges).toHaveProperty("e01");
            expect(edges).toHaveProperty("e02");
            expect(edges.e01).toBeInstanceOf(QEdge);
        });
    });

    describe("test _findFirstLevelEdges function", () => {

        test("test findFirstLevelEdges with one hop query", async () => {
            let handler = new QueryGraphHandler(OneHopQuery);
            let edges = handler._findFirstLevelEdges();
            expect(edges).toHaveProperty("paths");
            expect(edges.paths).toHaveLength(1);
            expect(edges).toHaveProperty("output_nodes");
            expect(edges.output_nodes).toHaveLength(1);
            expect(edges.output_nodes[0].getID()).toEqual("n1");
        });

        test("test findFirstLevelEdges with multi hop query", async () => {
            let handler = new QueryGraphHandler(FourHopQuery);
            let edges = handler._findFirstLevelEdges();
            expect(edges).toHaveProperty("paths");
            expect(edges.paths).toHaveLength(1);
            expect(edges).toHaveProperty("output_nodes");
            expect(edges.output_nodes).toHaveLength(1);
        });

        test("test findFirstLevelEdges with reversed one hop query", async () => {
            let handler = new QueryGraphHandler(OneHopQueryReverse);
            let edges = handler._findFirstLevelEdges();
            expect(edges).toHaveProperty("paths");
            expect(edges.paths).toHaveLength(1);
            expect(edges).toHaveProperty("output_nodes");
            expect(edges.output_nodes).toHaveLength(1);
            expect(edges.output_nodes[0].getID()).toEqual("n0")
        });
    });

    describe("test _createQueryPaths function", () => {

        test("test createQueryPaths with one hop query", async () => {
            let handler = new QueryGraphHandler(OneHopQuery);
            let edges = handler.createQueryPaths();
            expect(Object.keys(edges)).toHaveLength(1);
        });

        test("test createQueryPaths with two hop query", async () => {
            let handler = new QueryGraphHandler(TwoHopQuery);
            let edges = handler.createQueryPaths();
            expect(Object.keys(edges)).toHaveLength(2);
        });

        test("test createQueryPaths with three hop query", async () => {
            let handler = new QueryGraphHandler(FourHopQuery);
            let edges = handler.createQueryPaths();
            expect(Object.keys(edges)).toHaveLength(3);
        });
    });
});