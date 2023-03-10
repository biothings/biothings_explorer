const assoc = require("../../../src/controllers/association");

describe("Test association module", () => {
    test("By default, should return all associations", async () => {
        const res = await assoc();
        expect(res.length).toBeGreaterThan(10);
        expect(res[0]).toHaveProperty("subject");
        expect(res[0]).toHaveProperty("api");
    })

    test("If sub specified, should only return associations related to the sub", async () => {
        const res = await assoc('Gene');
        const inputTypes = new Set(res.map(item => item.subject));
        expect(Array.from(inputTypes)).toHaveLength(1);
        expect(Array.from(inputTypes)).toEqual(['Gene'])
    })

    test("If invalid sub specified, should only empty list", async () => {
        const res = await assoc('Gene1');
        expect(res).toEqual([]);
    })

    test("If obj specified, should only return associations related to the obj", async () => {
        const res = await assoc(undefined, 'SmallMolecule');
        const outputTypes = new Set(res.map(item => item.object));
        const inputTypes = new Set(res.map(item => item.subject));
        expect(inputTypes.size).toBeGreaterThan(1);
        expect(Array.from(outputTypes)).toHaveLength(1);
        expect(Array.from(outputTypes)).toEqual(['SmallMolecule'])
    })

    test("If pred specified, should only return associations related to the pred", async () => {
        const res = await assoc(undefined, undefined, "treats");
        const preds = new Set(res.map(item => item.predicate));
        const inputTypes = new Set(res.map(item => item.subject));
        expect(inputTypes.size).toBeGreaterThan(1);
        expect(Array.from(preds)).toHaveLength(1);
        expect(Array.from(preds)).toEqual(['treats'])
    })

    test("If api specified, should only return associations related to the api", async () => {
        const res = await assoc(undefined, undefined, undefined, undefined, "MyGene.info API");
        const apis = new Set(res.map(item => item.api.name));
        const inputTypes = new Set(res.map(item => item.subject));
        expect(inputTypes.size).toBeGreaterThan(1);
        expect(Array.from(apis)).toHaveLength(1);
        expect(Array.from(apis)).toEqual(['MyGene.info API'])
    })

    test("If source specified, should only return associations related to the source", async () => {
        const res = await assoc(undefined, undefined, undefined, undefined, undefined, "infores:disgenet");
        const sources = new Set(res.map(item => item.provided_by));
        const inputTypes = new Set(res.map(item => item.subject));
        expect(inputTypes.size).toBeGreaterThan(1);
        expect(Array.from(sources)).toHaveLength(1);
        expect(Array.from(sources)).toEqual(['infores:disgenet'])
    })

    test("If both sub and obj specified, should only return associations related to both sub and obj", async () => {
        const res = await assoc('Gene', 'SmallMolecule');
        const outputTypes = new Set(res.map(item => item.object));
        const inputTypes = new Set(res.map(item => item.subject));
        expect(Array.from(inputTypes)).toHaveLength(1);
        expect(Array.from(outputTypes)).toHaveLength(1);
        expect(Array.from(inputTypes)).toEqual(['Gene']);
        expect(Array.from(outputTypes)).toEqual(['SmallMolecule']);
    })
})
