const createServer = require("../server");
const request = require('supertest');

describe("Testing endpoints", () => {
    const app = createServer();

    test("GET /predicates", async () => {
        await request(app)
            .get("/predicates")
            .expect(200)
            .expect('Content-Type', /json/)
            .then((response) => {
                expect(response.body).toHaveProperty("gene");
                expect(response.body).toHaveProperty("gene1");
            })
    })
})