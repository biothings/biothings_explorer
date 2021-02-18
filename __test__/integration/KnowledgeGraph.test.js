const QNode = require("../../src/controllers/QueryGraphHandler/query_node");
const QEdge = require("../../src/controllers/QueryGraphHandler/query_edge");
const KnowledgeGraph = require("../../src/controllers/QueryGraphHandler/knowledge_graph");

describe("Testing KnowledgeGraph Module", () => {
    const gene_node1 = new QNode("n1", { category: "Gene", id: "NCBIGene:1017" });
    const chemical_node1 = new QNode("n3", { category: "ChemicalSubstance" });
    const edge1 = new QEdge("e01", { subject: gene_node1, object: chemical_node1 });
    const record = {
        "$edge_metadata": {
            trapi_qEdge_obj: edge1,
        },
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
    describe("Testing _createInputNode function", () => {
        test("test when input with string, should output a hash of 40 characters", () => {
            const kg = new KnowledgeGraph();
            const res = kg._createInputNode(record);
            expect(res).toHaveProperty("category", "biolink:Gene");
            expect(res).toHaveProperty("name", "CDK2");
            expect(res.attributes[0]).toHaveProperty("type", "biolink:id");
            expect(res.attributes[0]).toHaveProperty("value", ["SYMBOL:CDK2", "NCBIGene:1017"])
        })
    })

    describe("Testing _createOutputNode function", () => {
        test("test when input with string, should output a hash of 40 characters", () => {
            const kg = new KnowledgeGraph();
            const res = kg._createOutputNode(record);
            expect(res).toHaveProperty("category", "biolink:ChemicalSubstance");
            expect(res).toHaveProperty("name", "RILUZOLE");
            expect(res.attributes[0]).toHaveProperty("type", "biolink:id");
            expect(res.attributes[0]).toHaveProperty("value", ['CHEMBL.COMPOUND:CHEMBL744', 'PUBCHEM:1234', "name:RILUZOLE"])
        })
    })

})