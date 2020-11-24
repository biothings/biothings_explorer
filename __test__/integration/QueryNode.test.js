const QNode = require("../../src/controllers/QueryGraphHandler/query_node");

describe("Testing QueryNode Module", () => {
    const node1_equivalent_ids = {
        "NCBIGene:1017": {
            db_ids: {
                NCBIGene: ["1017"],
                SYMBOL: ['CDK2']
            }
        }
    }

    describe("Testing hasInput function", () => {
        test("test node without curies specified should return false", () => {
            const gene_node = new QNode("n1", { category: "Gene" });
            const res = gene_node.hasInput();
            expect(res).toBeFalsy();
        })

        test("test node with curies specified should return true", () => {
            const gene_node = new QNode("n1", { category: "Gene", id: "NCBIGene:1017" });
            const res = gene_node.hasInput();
            expect(res).toBeTruthy();
        })
    })

    describe("Test hasEquivalentIDs function", () => {
        test("test node with equivalent identifiers set should return true", () => {
            const gene_node = new QNode("n1", { category: "Gene" });
            gene_node.setEquivalentIDs(node1_equivalent_ids);
            const res = gene_node.hasEquivalentIDs();
            expect(res).toBeTruthy();
        });

        test("test node with equivalent identifiers not set should return false", () => {
            const gene_node = new QNode("n1", { category: "Gene" });
            const res = gene_node.hasEquivalentIDs();
            expect(res).toBeFalsy();
        })
    })
})