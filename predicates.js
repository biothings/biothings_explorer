const meta_kg = require("@biothings-explorer/smartapi-kg");
const kg = new meta_kg();
kg.constructMetaKGSync();
const snakeCase = require("snake-case");


module.exports = () => {
    let predicates = {};
    kg.ops.map(op => {
        let input = snakeCase.snakeCase(op.association.input_type);
        let output = snakeCase.snakeCase(op.association.output_type);
        let pred = snakeCase.snakeCase(op.association.predicate);
        if (!(input in predicates)) {
            predicates[input] = {};
        }
        if (!(output in predicates[input])) {
            predicates[input][output] = [];
        }
        if (!(predicates[input][output].includes(pred))) {
            predicates[input][output].push(pred);
        }
    })
    return predicates;
}