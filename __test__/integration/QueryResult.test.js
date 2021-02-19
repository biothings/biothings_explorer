const QNode = require("../../src/controllers/QueryGraphHandler/query_node");
const QEdge = require("../../src/controllers/QueryGraphHandler/query_edge");
const QueryResult = require("../../src/controllers/QueryGraphHandler/query_results");

describe("Testing QueryResults Module", () => {
    const gene_node1 = new QNode("n1", { category: "Gene", id: "NCBIGene:1017" });
    const chemical_node1 = new QNode("n3", { category: "ChemicalSubstance" });
    const edge1 = new QEdge("e01", { subject: gene_node1, object: chemical_node1 });
    const record = {
        "$edge_metadata": {
            trapi_qEdge_obj: edge1,
            source: "DGIdb",
            api_name: "BioThings DGIDB API"
        },
        "publications": ['PMID:123', 'PMID:1234'],
        "interactionType": "inhibitor",
        "$input": {
            original: "SYMBOL:CDK2",
            obj: {
                primaryID: 'NCBIGene:1017',
                label: "CDK2",
                dbIDs: {
                    SYMBOL: "CDK2",
                    NCBIGene: "1017"
                },
                curies: ['SYMBOL:CDK2', 'NCBIGene:1017']
            }
        },
        "$output": {
            original: "CHEMBL.COMPOUND:CHEMBL744",
            obj: {
                primaryID: 'CHEMBL.COMPOUND:CHEMBL744',
                label: "RILUZOLE",
                dbIDs: {
                    "CHEMBL.COMPOUND": "CHEMBL744",
                    "PUBCHEM": "1234",
                    "name": "RILUZOLE"
                },
                curies: ['CHEMBL.COMPOUND:CHEMBL744', 'PUBCHEM:1234', "name:RILUZOLE"]
            }
        },
    }
    describe("Testing _createNodeBindings function", () => {
        test("test when input with string, should output a hash of 40 characters", () => {
            const queryResult = new QueryResult();
            const res = queryResult._createNodeBindings(record);
            expect(res).toHaveProperty("n1");
            expect(res).toHaveProperty("n3");
            expect(res.n1[0].id).toEqual("NCBIGene:1017");
            expect(res.n3[0].id).toEqual("CHEMBL.COMPOUND:CHEMBL744");

        })
    })

    describe("Testing _createEdgeBindings function", () => {
        test("test when input with string, should output a hash of 40 characters", () => {
            const queryResult = new QueryResult();
            const res = queryResult._createEdgeBindings(record);
            expect(res).toHaveProperty("e01");
            expect(res.e01.length).toEqual(1);
        })
    })

    describe("Testing update function", () => {
        test("test when input with string, should output a hash of 40 characters", () => {
            const queryResult = new QueryResult();
            queryResult.update([record]);
            expect(queryResult.results.length).toEqual(1);
            expect(queryResult.results[0].node_bindings).toHaveProperty("n1");
            expect(queryResult.results[0].edge_bindings).toHaveProperty("e01");
        })
    })

})