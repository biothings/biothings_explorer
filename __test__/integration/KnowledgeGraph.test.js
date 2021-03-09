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
            source: "DGIdb",
            api_name: "BioThings DGIDB API"
        },
        "publications": ['PMID:123', 'PMID:1234'],
        "interactionType": "inhibitor",
        "$input": {
            original: "SYMBOL:CDK2",
            obj: [{
                primaryID: 'NCBIGene:1017',
                label: "CDK2",
                dbIDs: {
                    SYMBOL: "CDK2",
                    NCBIGene: "1017"
                },
                semanticType: "Gene",
                curies: ['SYMBOL:CDK2', 'NCBIGene:1017']
            }]
        },
        "$output": {
            original: "CHEMBL.COMPOUND:CHEMBL744",
            obj: [{
                primaryID: 'CHEMBL.COMPOUND:CHEMBL744',
                label: "RILUZOLE",
                dbIDs: {
                    "CHEMBL.COMPOUND": "CHEMBL744",
                    "PUBCHEM": "1234",
                    "name": "RILUZOLE"
                },
                semanticType: "ChemicalSubstance",
                curies: ['CHEMBL.COMPOUND:CHEMBL744', 'PUBCHEM:1234', "name:RILUZOLE"]
            }]
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

    describe("Testing _createAttributes function", () => {
        test("test edge attribute provided_by and api are correctly found", () => {
            const kg = new KnowledgeGraph();
            const res = kg._createAttributes(record);
            expect(res.length).toBeGreaterThanOrEqual(2);
            expect(res[0]).toHaveProperty("name", "provided_by");
            expect(res[0]).toHaveProperty("type", "biolink:provided_by");
            expect(res[0]).toHaveProperty("value", "DGIdb");
            expect(res[1]).toHaveProperty("name", "api");
            expect(res[1]).toHaveProperty("type", "bts:api");
            expect(res[1]).toHaveProperty("value", "BioThings DGIDB API");
        })

        test("test edge attribute other than provided_by and api are correctly found", () => {
            const kg = new KnowledgeGraph();
            const res = kg._createAttributes(record);
            expect(res.length).toBeGreaterThan(2);
            expect(res[2]).toHaveProperty("name", "publications");
            expect(res[2]).toHaveProperty("type", "biolink:publications");
            expect(res[2]).toHaveProperty("value", ['PMID:123', 'PMID:1234']);
            expect(res[3]).toHaveProperty("name", "interactionType");
            expect(res[3]).toHaveProperty("type", "bts:interactionType");
            expect(res[3]).toHaveProperty("value", 'inhibitor');
        })
    })

    describe("Testing _createEdge function", () => {
        test("test edge attribute provided_by and api are correctly found", () => {
            const kg = new KnowledgeGraph();
            const res = kg._createAttributes(record);
            expect(res.length).toBeGreaterThanOrEqual(2);
            expect(res[0]).toHaveProperty("name", "provided_by");
            expect(res[0]).toHaveProperty("type", "biolink:provided_by");
            expect(res[0]).toHaveProperty("value", "DGIdb");
            expect(res[1]).toHaveProperty("name", "api");
            expect(res[1]).toHaveProperty("type", "bts:api");
            expect(res[1]).toHaveProperty("value", "BioThings DGIDB API");
        })

        test("test edge attribute other than provided_by and api are correctly found", () => {
            const kg = new KnowledgeGraph();
            const res = kg._createAttributes(record);
            expect(res.length).toBeGreaterThan(2);
            expect(res[2]).toHaveProperty("name", "publications");
            expect(res[2]).toHaveProperty("type", "biolink:publications");
            expect(res[2]).toHaveProperty("value", ['PMID:123', 'PMID:1234']);
            expect(res[3]).toHaveProperty("name", "interactionType");
            expect(res[3]).toHaveProperty("type", "bts:interactionType");
            expect(res[3]).toHaveProperty("value", 'inhibitor');
        })
    })

})