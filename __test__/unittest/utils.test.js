const utils = require("../../src/utils/common");

describe("Test utility functions", () => {
    describe("Test removeQuotesFromQuery function", () => {
        test("single quotes should be removed", () => {
            const input = "'kevin'";
            const res = utils.removeQuotesFromQuery(input);
            expect(res).toEqual('kevin');
        })

        test("double quotes should be removed", () => {
            const input = '"kevin"';
            const res = utils.removeQuotesFromQuery(input);
            expect(res).toEqual('kevin');
        })

        test("unquoted string should return itself", () => {
            const input = 'kevin';
            const res = utils.removeQuotesFromQuery(input);
            expect(res).toEqual('kevin');
        })

        test("string with only quotes in the middle should also return itself", () => {
            const input = 'ke"vin';
            const res = utils.removeQuotesFromQuery(input);
            expect(res).toEqual('ke"vin');
        })
    })
    describe("Test removeBioLinkPrefix function", () => {
        test("String input with biolink prefix should be removed", () => {
            const input = 'biolink:treats';
            const res = utils.removeBioLinkPrefix(input);
            expect(res).toEqual("treats");
        })

        test("String input without biolink prefix should be kept same", () => {
            const input = 'treats';
            const res = utils.removeBioLinkPrefix(input);
            expect(res).toEqual("treats");
        })

        test("non-string input should be kept same", () => {
            const input = ['biolink:treats'];
            const res = utils.removeBioLinkPrefix(input);
            expect(res).toEqual(['biolink:treats']);
        })
    })
})