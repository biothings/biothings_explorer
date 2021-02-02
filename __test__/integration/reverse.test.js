const Reverse = require("../../src/controllers/QueryGraphHandler/reverse");

describe("Test EdgeReverse class", () => {
    test("test reverse with correct predicate", () => {
        const handler = new Reverse();
        const res = handler.reverse('treats');
        expect(res).toBe("treated_by");
    })

    test("test reverse with correct predicate if it contains underscore", () => {
        const handler = new Reverse();
        const res = handler.reverse('treated_by');
        expect(res).toBe("treats");
    })

    test("test reverse with predicate having symmetric equal to true", () => {
        const handler = new Reverse();
        const res = handler.reverse('correlated_with');
        expect(res).toBe("correlated_with");
    })

    test("test predicate with no inverse property and symmetric not equal to true", () => {
        const handler = new Reverse();
        const res = handler.reverse('has_phenotype');
        expect(res).toBeUndefined();
    })

    test("test predicate not exist in biolink model", () => {
        const handler = new Reverse();
        const res = handler.reverse('haha');
        expect(res).toBeUndefined();
    })
})
