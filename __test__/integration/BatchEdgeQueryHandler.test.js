const QNode = require("../../src/controllers/QueryGraphHandler/query_node");
const QEdge = require("../../src/controllers/QueryGraphHandler/query_edge");
const BatchEdgeQueryHandler = require("../../src/controllers/QueryGraphHandler/batch_edge_query");

describe("Testing BatchEdgeQueryHandler Module", () => {
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

    describe("Testing query function", () => {
        test("test with one query edge", async () => {
            const batchHandler = new BatchEdgeQueryHandler();
            batchHandler.setEdges([edge1]);
            const res = await batchHandler.query([edge1]);
            expect(res.length).toBeGreaterThan(1);
        })
    })


})