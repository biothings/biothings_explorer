const reverse = require("../../src/controllers/QueryGraphHandler/reverse");

describe("Test EdgeReverse class", () => {
    test("test reverse with correct predicate", () => {
        const res = reverse.reverse('treats');
        expect(res).toBe("treated_by");
    })

    test("test reverse with correct predicate if it contains underscore", () => {
        const res = reverse.reverse('treated_by');
        expect(res).toBe("treats");
    })

    test("test reverse with predicate having symmetric equal to true", () => {
        const res = reverse.reverse('correlated_with');
        expect(res).toBe("correlated_with");
    })

    test("test predicate with no inverse property and symmetric not equal to true", () => {
        const res = reverse.reverse('has_phenotype');
        expect(res).toBeUndefined();
    })

    test("test predicate not exist in biolink model", () => {
        const res = reverse.reverse('haha');
        expect(res).toBeUndefined();
    })
})
