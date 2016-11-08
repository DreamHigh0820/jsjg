'use strict';

var Parsimmon = require('parsimmon');

var lexemes = require('./lexemes.js');
var AST = require('../ast/');

var valueLiterals = Parsimmon.alt(
    valueLiteral('string', lexemes.quote
        .then(lexemes.notAQuote)
        .chain(function captureString(str) {
            return lexemes.quote
                .map(function toString(quote) {
                    return quote + str + quote;
                });
        })),
    valueLiteral('number', lexemes.number),
    valueLiteral('null', lexemes.nullWord),
    valueLiteral('undefined', lexemes.undefinedWord),
    valueLiteral('true', lexemes.trueWord),
    valueLiteral('false', lexemes.falseWord)
);

module.exports = valueLiterals;

function valueLiteral(name, parser) {
    return parser.map(function toValue(value) {
        return AST.value(value, name);
    });
}
