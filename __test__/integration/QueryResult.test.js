const QNode = require("../../src/controllers/QueryGraphHandler/query_node");
const QEdge = require("../../src/controllers/QueryGraphHandler/query_edge");
const QueryResult = require("../../src/controllers/QueryGraphHandler/query_results");

describe("Testing QueryResults Module", () => {
    const gene_node1 = new QNode("n1", { category: "Gene", id: "NCBIGene:1017" });
    const chemical_node1 = new QNode("n3", { category: "ChemicalSubstance" });
    const edge1 = new QEdge("e01", { subject: gene_node1, object: chemical_node1 });
    describe("Testing _createNodeBindings function", () => {
        test("test when input with string, should output a hash of 40 characters", () => {
            const record = {
                "$reasoner_edge": edge1,
                "$input": "SYMBOL:CDK2",
                "id": "CHEMBL.COMPOUND:CHEMBL354634",
                "$original_input": {
                    "SYMBOL:CDK2": "NCBIGene:1017"
                }
            }
            const queryResult = new QueryResult();
            const res = queryResult._createNodeBindings(record);
            expect(res).toHaveProperty("n1");
            expect(res).toHaveProperty("n3");
            expect(res.n1[0].id).toEqual("NCBIGene:1017");
            expect(res.n3[0].id).toEqual("CHEMBL.COMPOUND:CHEMBL354634");

        })
    })

    describe("Testing _createEdgeBindings function", () => {
        test("test when input with string, should output a hash of 40 characters", () => {
            const record = {
                "$reasoner_edge": edge1,
                "$input": "SYMBOL:CDK2",
                "id": "CHEMBL.COMPOUND:CHEMBL354634",
                "$original_input": {
                    "SYMBOL:CDK2": "NCBIGene:1017"
                },
                "$association": {
                    api_name: "MyChem.info API",
                    source: "drugbank",
                    predicate: "physically_interacts_with"
                }
            }
            const queryResult = new QueryResult();
            const res = queryResult._createEdgeBindings(record);
            expect(res).toHaveProperty("e01");
            expect(res.e01.length).toEqual(1);
        })
    })

    describe("Testing update function", () => {
        test("test when input with string, should output a hash of 40 characters", () => {
            const record = {
                "$reasoner_edge": edge1,
                "$input": "SYMBOL:CDK2",
                "id": "CHEMBL.COMPOUND:CHEMBL354634",
                "$original_input": {
                    "SYMBOL:CDK2": "NCBIGene:1017"
                },
                "$association": {
                    api_name: "MyChem.info API",
                    source: "drugbank",
                    predicate: "physically_interacts_with"
                }
            }
            const queryResult = new QueryResult();
            queryResult.update([record]);
            expect(queryResult.results.length).toEqual(1);
            expect(queryResult.results[0].node_bindings).toHaveProperty("n1");
            expect(queryResult.results[0].edge_bindings).toHaveProperty("e01");
        })
    })

})