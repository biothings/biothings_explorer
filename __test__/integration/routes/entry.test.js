const app = require("../../../src/app");
const request = require('supertest');

describe("Test entry point", () => {
    test("query / should redirect to SmartAPI", async () => {
        await request(app)
            .get("/")
            .expect(302)
            .then((response) => {
                expect(response.headers.location).toEqual("https://smart-api.info/ui/dc91716f44207d2e1287c727f281d339");
            })
    })
})