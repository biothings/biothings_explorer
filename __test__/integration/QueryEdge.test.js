const QNode = require("../../src/controllers/QueryGraphHandler/query_node");
const QEdge = require("../../src/controllers/QueryGraphHandler/query_edge");

describe("Testing QueryEdge Module", () => {
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
    const edge5 = new QEdge('e06', { object: gene_node1_with_id_annotated, subject: chemical_node1 });
    const invalid_edge = new QEdge("e03", { subject: invalid_node, object: chemical_node1 })

    describe("Testing isReversed function", () => {
        test("test if only the object of the edge has curie defined, should return true", () => {
            const res = edge4.isReversed();
            expect(res).toBeTruthy();
        });

        test("test if the subject of the edge has curie defined, should return false", () => {
            const res = edge1.isReversed();
            expect(res).toBeFalsy();
        });

        test("test if both subject and object curie not defined, should return false", () => {
            const node1 = new QNode("n1", { category: "Gene" });
            const node2 = new QNode("n2", { category: "ChemicalSubstance" });
            const edge = new QEdge("e01", { subject: node1, object: node2 });
            expect(edge.isReversed()).toBeFalsy();
        });

    })

    describe("Testing getInputCurie function", () => {
        test("test return an array of one curie if subject has only one curie specified", () => {
            const res = edge1.getInputCurie();
            expect(res).toEqual(['NCBIGene:1017']);
        });

        test("test return an array of two curie if subject has only an array of two curies specified", () => {
            const res = edge3.getInputCurie();
            expect(res).toEqual(['NCBIGene:1017', 'NCBIGene:1018']);
        });

        test("test return an array of two curies if edge is reversed and object has two curies specified", () => {
            const res = edge4.getInputCurie();
            expect(res).toEqual(['NCBIGene:1017', 'NCBIGene:1018']);
        });

    })

    describe("Testing hasInput function", () => {
        test("test return true if subject has only one curie specified", () => {
            const res = edge1.hasInput();
            expect(res).toBeTruthy();
        });

        test("test return true if subject has only an array of two curies specified", () => {
            const res = edge3.hasInput();
            expect(res).toBeTruthy();
        });

        test("test return true if subject has no curies specified but object does", () => {
            const res = edge4.hasInput();
            expect(res).toBeTruthy();
        });

        test("test return false if both subject and object has no curies specified", () => {
            const node1 = new QNode("n1", { category: "Gene" });
            const node2 = new QNode("n2", { category: "ChemicalSubstance" });
            const edge = new QEdge("e01", { subject: node1, object: node2 });
            expect(edge.hasInput()).toBeFalsy();
        });

    })

    describe("Testing hasInputResolved function", () => {
        test("test return true if subject has input resolved", () => {
            const res = edge2.hasInputResolved();
            expect(res).toBeTruthy();
        });

        test("test return false if both subject and object do not have input resolved", () => {
            const res = edge1.hasInputResolved();
            expect(res).toBeFalsy();
        });

        test("test return true if subject doesn't have input resolved, but object does", () => {
            const res = edge5.hasInputResolved();
            expect(res).toBeTruthy();
        });

    })

})