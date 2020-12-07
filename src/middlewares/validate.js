const swaggerValidation = require('openapi-validator-middleware');
const inputValidationOptions = {
    formats: [
        { name: 'double', pattern: /\d+(\.\d+)?/ },
        { name: 'int64', pattern: /^\d{1,19}$/ },
        { name: 'int32', pattern: /^\d{1,10}$/ },
        {
            name: 'file',
            validate: () => {
                return true;
            }
        }
    ],
    beautifyErrors: true,
    //firstError: true,
    expectFormFieldsInBody: true
};
swaggerValidation.init("docs/smartapi.yaml", inputValidationOptions);

module.exports = swaggerValidation;