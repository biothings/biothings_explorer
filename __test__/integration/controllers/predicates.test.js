const pred = require("../../../src/controllers/predicates");

describe("Test Predicates Module", () => {
    describe("Test _loadMetaKG function", () => {
        test("If only smartAPI ID is provided, should return spec for that SmartAPI id", async () => {
            const handler = new pred();
            const res = await handler._loadMetaKG('59dce17363dce279d389100834e43648');
            const api = Array.from(new Set(res.ops.map(item => item.association.api_name)));
            expect(api).toHaveLength(1);
            expect(api[0]).toEqual('MyGene.info API');
        })

        test("If invalid smartAPI ID is provided, should raise an error", async () => {
            const handler = new pred();
            await expect(handler._loadMetaKG('9dce17363dce279d389100834e43648')).rejects.toThrow('Failed to Load MetaKG');
        })

        test("If both smartAPI ID and team are provided, SmartAPI id should take precedence", async () => {
            const handler = new pred();
            const res = await handler._loadMetaKG('59dce17363dce279d389100834e43648', 'Multiomics Provider');
            const api = Array.from(new Set(res.ops.map(item => item.association.api_name)));
            expect(api).toHaveLength(1);
            expect(api[0]).toEqual('MyGene.info API');
        })

        test("If team is provided, should return metakg for all that team", async () => {
            const handler = new pred();
            const res = await handler._loadMetaKG(undefined, 'Multiomics Provider');
            const apis = Array.from(new Set(res.ops.map(item => item.association["x-translator"].team).reduce((accumulator, currentValue) => {
                return [...accumulator, ...currentValue]
            }, [])));
            expect(apis).toHaveLength(2);
            expect(apis).toContain('Multiomics Provider');
            expect(apis).toContain('Service Provider');
        })

        test("If invalid team name is provided, should return an empty list", async () => {
            const handler = new pred();
            await expect(handler._loadMetaKG(undefined, 'Multiomics Provider1')).rejects.toThrow('Failed to Load MetaKG');
        })

        test("By default, should return all ops", async () => {
            const handler = new pred();
            const res = await handler._loadMetaKG();
            const api = Array.from(new Set(res.ops.map(item => item.association.api_name)));
            expect(api.length).toBeGreaterThan(5);
            expect(res.ops.length).toBeGreaterThan(20);
        })
    })

    describe("Test _modifyCategory function", () => {
        test("Captitalized and biolink prefixed category should return itself", () => {
            const handler = new pred();
            const res = handler._modifyCategory('biolink:Disease');
            expect(res).toEqual('biolink:Disease')
        })

        test("biolink prefixed, but not capitalized category should return the capitalized form", () => {
            const handler = new pred();
            const res = handler._modifyCategory('biolink:disease');
            expect(res).toEqual('biolink:Disease')
        })

        test("not biolink prefixed, and not capitalized category should return biolink prefixed and capitalized form", () => {
            const handler = new pred();
            const res = handler._modifyCategory('disease');
            expect(res).toEqual('biolink:Disease')
        })

        test("not biolink prefixed, but capitalized category should return biolink prefixed and capitalized form", () => {
            const handler = new pred();
            const res = handler._modifyCategory('Disease');
            expect(res).toEqual('biolink:Disease')
        })
    })

    describe("Test _modifyPredicate function", () => {
        test("snakecased and biolink prefixed prefix should return itself", () => {
            const handler = new pred();
            const res = handler._modifyPredicate('biolink:treated_by');
            expect(res).toEqual('biolink:treated_by')
        })

        test("biolink prefixed, but not snakecased prefix should return the snakecased form", () => {
            const handler = new pred();
            const res = handler._modifyPredicate('biolink:treated by');
            expect(res).toEqual('biolink:treated_by')
        })

        test("not biolink prefixed, and not snakecased predicatte should return biolink prefixed and snakecased form", () => {
            const handler = new pred();
            const res = handler._modifyPredicate('treated by');
            expect(res).toEqual('biolink:treated_by')
        })

        test("not biolink prefixed, but snakecased predicate should return biolink prefixed and snakecased form", () => {
            const handler = new pred();
            const res = handler._modifyPredicate('treated_by');
            expect(res).toEqual('biolink:treated_by')
        })
    })

    describe("Test getPredicates function", () => {
        test("Default should render correctly", async () => {
            const handler = new pred();
            const res = await handler.getPredicates();
            expect(res).toHaveProperty("biolink:Gene");
        })

        test("If smartapi ID provided, should render predicates only related to the smartapi", async () => {
            const handler = new pred('59dce17363dce279d389100834e43648');
            const res = await handler.getPredicates();
            expect(res).toHaveProperty("biolink:Gene");
        })

        test("If team name provided, should render predicates only related to the smartapi", async () => {
            const handler = new pred(undefined, "Service Provider");
            const res = await handler.getPredicates();
            expect(res).toHaveProperty("biolink:Gene");
        })
    })
})
