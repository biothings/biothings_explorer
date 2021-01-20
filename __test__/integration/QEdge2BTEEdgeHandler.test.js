const QNode = require("../../src/controllers/QueryGraphHandler/query_node");
const QEdge = require("../../src/controllers/QueryGraphHandler/query_edge");
const QEdge2BTEEdgeHandler = require("../../src/controllers/QueryGraphHandler/qedge2bteedge");
const meta_kg = require("@biothings-explorer/smartapi-kg");

describe("Testing QEdge2BTEEdgeHandler Module", () => {
    const gene_node1 = new QNode("n1", { category: "Gene", curie: "NCBIGene:1017" });
    const node1_equivalent_ids = {
        "NCBIGene:1017": {
            db_ids: {
                NCBIGene: ["1017"],
                SYMBOL: ['CDK2']
            }
        }
    }
    gene_node1.setEquivalentIDs(node1_equivalent_ids);
    const node2_equivalent_ids = {
        "NCBIGene:1017": {
            db_ids: {
                NCBIGene: ["1017"],
                SYMBOL: ['CDK2']
            }
        },
        "NCBIGene:1018": {
            db_ids: {
                NCBIGene: ["1018"],
                SYMBOL: ['CDK3']
            }
        }
    }
    const gene_node2 = new QNode("n2", { category: "Gene", curie: ["NCBIGene:1017", "NCBIGene:1018"] });
    gene_node2.setEquivalentIDs(node2_equivalent_ids);
    const invalid_node = new QNode("n3", { category: "INVALID", curie: ["NCBIGene:1017", "NCBIGene:1018"] })
    const chemical_node1 = new QNode("n3", { category: "ChemicalSubstance" });
    const chemical_node2 = new QNode("n4", { category: "ChemicalSubstance", curie: "CHEMBL.COMPUND:CHEMBL744" });
    const edge1 = new QEdge("e01", { subject: gene_node1, object: chemical_node1 });
    const edge2 = new QEdge("e02", { subject: gene_node1, object: chemical_node1, predicate: "physically_interacts_with" });
    const edge3 = new QEdge('e04', { subject: gene_node2, object: chemical_node1 });
    const invalid_edge = new QEdge("e03", { subject: invalid_node, object: chemical_node1 })
    const kg = new meta_kg();
    kg.constructMetaKGSync();
    describe("Testing _getSmartAPIEdges function", () => {
        test("test valid input", () => {
            const edgeHandler = new QEdge2BTEEdgeHandler([edge1], kg);
            const res = edgeHandler._getSmartAPIEdges(edge1);
            expect(res.length).toBeGreaterThan(1);
            expect(res[0]).toHaveProperty('reasoner_edge');
            expect(res[0].reasoner_edge).toBeInstanceOf(QEdge);
        })

        test("test invalid input should return an empty list", () => {
            const edgeHandler = new QEdge2BTEEdgeHandler([invalid_edge], kg);
            const res = edgeHandler._getSmartAPIEdges(invalid_edge);
            expect(res.length).toEqual(0);
        })

    })

    describe("Testing _createNonBatchSupportBTEEdges function", () => {
        test("test smartapi edge with one input should return one bte edge", () => {
            const edgeHandler = new QEdge2BTEEdgeHandler([edge1], kg);
            const smartapiEdges = edgeHandler._getSmartAPIEdges(edge1);
            const nonBatchEdge = smartapiEdges.filter(edge => edge.query_operation.supportBatch === false)[0];
            const res = edgeHandler._createNonBatchSupportBTEEdges(nonBatchEdge);
            expect(res.length).toEqual(1);
            expect(res[0]).toHaveProperty('input', '1017');
            expect(res[0]).toHaveProperty('input_resolved_identifiers');
            expect(res[0].input_resolved_identifiers).toHaveProperty('NCBIGene:1017');
            expect(res[0].original_input).toHaveProperty('NCBIGene:1017');
        })

        test("test smartapi edge with multiple input should return multiple bte edge", () => {
            const edgeHandler = new QEdge2BTEEdgeHandler([edge3], kg);
            const smartapiEdges = edgeHandler._getSmartAPIEdges(edge3);
            const nonBatchEdge = smartapiEdges.filter(edge => edge.query_operation.supportBatch === false)[0];
            const res = edgeHandler._createNonBatchSupportBTEEdges(nonBatchEdge);
            expect(res.length).toEqual(2);
            expect(res[1]).toHaveProperty('input', '1018');
            expect(res[1]).toHaveProperty('input_resolved_identifiers');
            expect(res[1].input_resolved_identifiers).toHaveProperty('NCBIGene:1018');
            expect(res[1].original_input).toHaveProperty('NCBIGene:1018');
        })

        test("test smartapi edge with multiple input should return multiple bte edge", () => {
            const edgeHandler = new QEdge2BTEEdgeHandler([edge3], kg);
            const smartapiEdges = edgeHandler._getSmartAPIEdges(edge3);
            const nonBatchEdge = smartapiEdges.filter(edge => edge.query_operation.supportBatch === false)[0];
            const res = edgeHandler._createNonBatchSupportBTEEdges(nonBatchEdge);
            expect(res.length).toEqual(2);
            expect(res[1]).toHaveProperty('input', '1018');
            expect(res[1]).toHaveProperty('input_resolved_identifiers');
            expect(res[1].input_resolved_identifiers).toHaveProperty('NCBIGene:1018');
            expect(res[1].original_input).toHaveProperty('NCBIGene:1018');
        })
    })

    describe("Testing _createBatchSupportBTEEdges function", () => {
        test("test smartapi edge with one input should return one bte edge", () => {
            const edgeHandler = new QEdge2BTEEdgeHandler([edge1], kg);
            const smartapiEdges = edgeHandler._getSmartAPIEdges(edge1);
            const batchEdge = smartapiEdges.filter(edge => edge.query_operation.supportBatch === true)[0];
            const res = edgeHandler._createBatchSupportBTEEdges(batchEdge);
            expect(res.length).toEqual(1);
            expect(res[0]).toHaveProperty('input', ['CDK2']);
            expect(res[0]).toHaveProperty('input_resolved_identifiers');
            expect(res[0].input_resolved_identifiers).toHaveProperty('NCBIGene:1017');
            expect(res[0].original_input).toHaveProperty('SYMBOL:CDK2');
        })

        test("test smartapi edge with multiple input should still return one bte edge", () => {
            const edgeHandler = new QEdge2BTEEdgeHandler([edge3], kg);
            const smartapiEdges = edgeHandler._getSmartAPIEdges(edge3);
            const batchEdge = smartapiEdges.filter(edge => edge.query_operation.supportBatch === true)[0];
            const res = edgeHandler._createBatchSupportBTEEdges(batchEdge);
            expect(res.length).toEqual(1);
            expect(res[0]).toHaveProperty('input', ['CDK2', 'CDK3']);
            expect(res[0]).toHaveProperty('input_resolved_identifiers');
            expect(res[0].input_resolved_identifiers).toHaveProperty('NCBIGene:1018');
            expect(res[0].original_input).toHaveProperty('SYMBOL:CDK3');
        })


    })
})