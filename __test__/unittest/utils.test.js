const { expectCt } = require("helmet");
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
})