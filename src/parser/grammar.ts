import { Operator } from "../constants";
import { Token } from "../tokenizer/tokens";
import { defineGrammar } from "./grammarBuilder";

export interface Expression {
    left: Expression | number;
    operator: Operator;
    right: Expression | number;
}

interface NonTerminal {
    Expression: Expression;
}

export const GRAMMAR = defineGrammar<NonTerminal, Token>(define => ({
    Expression: define("Expression")
        // Expression -> NumberLiteral
        .given("NumberLiteral")
        .produce(value => ({ left: parseFloat(value.literal), operator: Operator.ADD, right: 0 }))
        // Expression -> ( Expression )
        .given(Operator.OPEN_PAREN, "Expression", Operator.CLOSE_PAREN)
        .produce((_open, expression, _close) => expression)
        // Expression -> Expression * Expression
        .given("Expression", Operator.MULTIPLY, "Expression")
        .produce((left, operator, right) => ({ left, operator: operator, right }))
        // Expression -> Expression + Expression
        .given("Expression", Operator.ADD, "Expression")
        .produce((left, operator, right) => ({ left, operator: operator, right }))
        .build(),
}));
