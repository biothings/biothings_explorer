const Reverse = require("../../src/controllers/QueryGraphHandler/reverse");

describe("Test EdgeReverse class", () => {
    test("test reverse with correct predicate", () => {
        const handler = new Reverse();
        const res = handler.reverse('treats');
        expect(res).toBe("treated by");
    })
})
