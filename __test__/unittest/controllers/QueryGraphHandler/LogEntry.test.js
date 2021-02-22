const logEntry = require("../../../../src/controllers/QueryGraphHandler/log_entry");

describe("test log entry module", () => {
    test("if no optional param passed, should return default value", () => {
        const log = new logEntry().getLog();
        expect(log.code).toEqual(null);
        expect(log.level).toEqual("DEBUG");
        expect(log.message).toEqual(null);
        expect(log).toHaveProperty("timestamp");
    })

    test("if code is correctly set", () => {
        const log = new logEntry("DEBUG", 404).getLog();
        expect(log.code).toEqual(404);
        expect(log.level).toEqual("DEBUG");
        expect(log.message).toEqual(null);
        expect(log).toHaveProperty("timestamp");
    })

    test("if message is correctly set", () => {
        const log = new logEntry("DEBUG", null, "yes").getLog();
        expect(log.code).toEqual(null);
        expect(log.level).toEqual("DEBUG");
        expect(log.message).toEqual("yes");
        expect(log).toHaveProperty("timestamp");
    })
})