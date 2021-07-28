const { expectCt } = require("helmet");
const utils = require("../../src/utils/common");
const WorkflowError = require("../../src/utils/errors/workflow_error");

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

    describe("Test workflow validator", () => {
        test("undefined workflow", () => {
            let workflow; 
            expect(utils.validateWorkflow(workflow)).toEqual(undefined);
        })
        
        test("Workflow not in right shape", () => {
            const workflow = {}; 
            expect(() => utils.validateWorkflow(workflow)).toThrow(WorkflowError);
        })

        test("Workflow wrong legnth", () => {
            let workflow = []; 
            expect(() => utils.validateWorkflow(workflow)).toThrow(WorkflowError);
            workflow = [{id: 'lookup'}, {id: 'lookup'}]; 
            expect(() => utils.validateWorkflow(workflow)).toThrow(WorkflowError);
        })

        test("Workflow unsupported value", () => {
            let workflow = [{id: 'abcde'}]; 
            expect(() => utils.validateWorkflow(workflow)).toThrow(WorkflowError);
            workflow = ["abcde"]; 
            expect(() => utils.validateWorkflow(workflow)).toThrow(WorkflowError);
        })

        test("No error when value is id:lookup", () => {
            const workflow = [{id: 'lookup'}]; 
            expect(utils.validateWorkflow(workflow)).toEqual(undefined);
        })
    })
})