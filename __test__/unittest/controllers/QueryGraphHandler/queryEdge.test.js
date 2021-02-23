const qEdge = require("../../../../src/controllers/QueryGraphHandler/query_edge");
const reverse = require("../../../../src/controllers/QueryGraphHandler/reverse");
const utils = require("../../../../src/utils/common");

jest.mock("../../../../src/controllers/QueryGraphHandler/reverse");

describe("Test QEdge class", () => {
    describe("Test getPredicate function", () => {
        test("Non reversed edge should return predicates itself", () => {
            const edge = new qEdge('e01', {
                predicate: 'biolink:treats',
                object: {
                    getCurie() {
                        return undefined;
                    }
                },
                subject: {
                    getCurie() {
                        return 'uye'
                    }
                }
            })
            const res = edge.getPredicate();
            expect(res).toEqual(['treats']);
        })

        test("Undefined predicate should return itself", () => {
            const edge = new qEdge('e01', {
            })
            const res = edge.getPredicate();
            expect(res).toBeUndefined;
        })

        test("An array of non-undefined predicates should return itself", () => {
            const edge = new qEdge('e01', {
                predicate: ['biolink:treats', 'biolink:targets'],
                object: {
                    getCurie() {
                        return undefined
                    }
                },
                subject: {
                    getCurie() {
                        return 'yes';
                    }
                }
            })
            const res = edge.getPredicate();
            expect(res).toEqual(['treats', 'targets']);
        })

        test("An array of non-undefined predicates with reverse edge should exclude return value if undefined", () => {
            reverse.reverse.mockReturnValueOnce('hello').mockReturnValueOnce(undefined);
            const edge = new qEdge('e01', {
                predicate: ['biolink:treats', 'biolink:targets'],
                object: {
                    getCurie() {
                        return 'yes'
                    }
                },
                subject: {
                    getCurie() {
                        return undefined;
                    }
                }
            })
            const res = edge.getPredicate();
            expect(res).toEqual(['hello']);
        })

        test("An array of non-undefined predicates with reverse edge should return reversed predicates if not undefined", () => {
            reverse.reverse.mockReturnValueOnce('hello').mockReturnValueOnce('kevin');
            const edge = new qEdge('e01', {
                predicate: ['biolink:treats', 'biolink:targets'],
                object: {
                    getCurie() {
                        return 'yes'
                    }
                },
                subject: {
                    getCurie() {
                        return undefined;
                    }
                }
            })
            const res = edge.getPredicate();
            expect(res).toEqual(['hello', 'kevin']);
        })
    })
})