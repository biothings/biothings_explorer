const QNode = require("../../src/controllers/QueryGraphHandler/query_node");
const QEdge = require("../../src/controllers/QueryGraphHandler/query_edge");
const NodeUpdateHandler = require("../../src/controllers/QueryGraphHandler/update_nodes");

describe("Testing NodeUpdateHandler Module", () => {
    const gene_node1 = new QNode("n1", { category: "Gene", id: "NCBIGene:1017" });
    const node1_equivalent_ids = {
        "NCBIGene:1017": {
            db_ids: {
                NCBIGene: ["1017"],
                SYMBOL: ['CDK2']
            }
        }
    }
    //gene_node1.setEquivalentIDs(node1_equivalent_ids);
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
    const gene_node2 = new QNode("n2", { category: "Gene", id: ["NCBIGene:1017", "NCBIGene:1018"] });
    const gene_node1_with_id_annotated = new QNode("n1", { category: "Gene", id: "NCBIGene:1017" });
    gene_node1_with_id_annotated.setEquivalentIDs(node1_equivalent_ids);
    //gene_node2.setEquivalentIDs(node2_equivalent_ids);
    const invalid_node = new QNode("n3", { category: "INVALID", curie: ["NCBIGene:1017", "NCBIGene:1018"] })
    const chemical_node1 = new QNode("n3", { category: "ChemicalSubstance" });
    const chemical_node2 = new QNode("n4", { category: "ChemicalSubstance", curie: "CHEMBL.COMPUND:CHEMBL744" });
    const edge1 = new QEdge("e01", { subject: gene_node1, object: chemical_node1 });
    const edge2 = new QEdge("e02", { subject: gene_node1_with_id_annotated, object: chemical_node1 });
    const edge3 = new QEdge('e04', { subject: gene_node2, object: chemical_node1 });
    const edge4 = new QEdge('e05', { object: gene_node2, subject: chemical_node1 });
    const invalid_edge = new QEdge("e03", { subject: invalid_node, object: chemical_node1 })

    describe("Testing _getCuries function", () => {
        test("test edge with one curie input return an array of one", () => {
            const nodeUpdater = new NodeUpdateHandler([edge1]);
            const res = nodeUpdater._getCuries([edge1]);
            expect(res).toHaveProperty("Gene", ["NCBIGene:1017"]);
        })

        test("test edge with multiple curie input return an array with multiple items", () => {
            const nodeUpdater = new NodeUpdateHandler([edge3]);
            const res = nodeUpdater._getCuries([edge3]);
            expect(res.Gene.length).toEqual(2);
        })

        test("test edge with input node annotated should return an empty array", () => {
            const nodeUpdater = new NodeUpdateHandler([edge2]);
            const res = nodeUpdater._getCuries([edge2]);
            expect(res).toEqual({});
        })

        test("test edge with input on object end should be handled", () => {
            const nodeUpdater = new NodeUpdateHandler([edge4]);
            const res = nodeUpdater._getCuries([edge4]);
            expect(res.Gene.length).toEqual(2);
        })
    })

    describe("Testing _getEquivalentIDs function", () => {
        test("test edge with one curie input return an object with one key", async () => {
            const nodeUpdater = new NodeUpdateHandler([edge1]);
            const res = await nodeUpdater._getEquivalentIDs({ "Gene": ["NCBIGene:1017"] })
            expect(res).toHaveProperty("NCBIGene:1017");
        })

        test("test edge with multiple curie input return an object with multiple key", async () => {
            const nodeUpdater = new NodeUpdateHandler([edge1]);
            const res = await nodeUpdater._getEquivalentIDs({ "Gene": ["NCBIGene:1017", "NCBIGene:1018"], "ChemicalSubstance": ["PUBCHEM:5070"] })
            expect(res).toHaveProperty("NCBIGene:1017");
            expect(res).toHaveProperty("NCBIGene:1018");
            expect(res).toHaveProperty("PUBCHEM:5070");
        })
    })

    describe("Testing setEquivalentIDs function", () => {
        test("test edge with one curie input should be annotated", async () => {
            const node = new QNode("n1", { category: "Gene", id: "NCBIGene:1017" });
            const edge = new QEdge("e01", { subject: node, object: chemical_node1 });
            const nodeUpdater = new NodeUpdateHandler([edge]);
            expect(node.hasEquivalentIDs()).toBeFalsy();
            const res = await nodeUpdater.setEquivalentIDs([edge]);
            expect(node.hasEquivalentIDs()).toBeTruthy();
        })

        test("test edge with multiple curie input should be annotated", async () => {
            const node = new QNode("n1", { category: "Gene", id: ["NCBIGene:1017", "NCBIGene:1018"] });
            const edge = new QEdge("e01", { subject: node, object: chemical_node1 });
            const nodeUpdater = new NodeUpdateHandler([edge]);
            expect(node.hasEquivalentIDs()).toBeFalsy();
            const res = await nodeUpdater.setEquivalentIDs([edge]);
            expect(node.hasEquivalentIDs()).toBeTruthy();
            expect(node.getEquivalentIDs()).toHaveProperty("NCBIGene:1017");
            expect(node.getEquivalentIDs()).toHaveProperty("NCBIGene:1018");
        })

        test("test edge with one curie input on object end return an array of one", async () => {
            const node = new QNode("n1", { category: "Gene", id: "NCBIGene:1017" });
            const edge = new QEdge("e01", { object: node, subject: chemical_node1 });
            const nodeUpdater = new NodeUpdateHandler([edge]);
            expect(node.hasEquivalentIDs()).toBeFalsy();
            const res = await nodeUpdater.setEquivalentIDs([edge]);
            expect(node.hasEquivalentIDs()).toBeTruthy();
            expect(node.getEquivalentIDs()).toHaveProperty("NCBIGene:1017");
            expect(chemical_node1.hasEquivalentIDs()).toBeFalsy();
        })

    })
})