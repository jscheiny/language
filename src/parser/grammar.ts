import { Operator } from "../constants";
import { createGrammar } from "./types";

interface Expression {
    left: Expression | number;
    operator: Operator;
    right: Expression | number;
}

interface Productions {
    LiteralExpression: Expression;
    ParenthesizedExpression: Expression;
    BinaryOpExpression: Expression;
    Expression: Expression;
}

export const GRAMMAR = createGrammar<Productions>(define => ({
    LiteralExpression: define("LiteralExpression")
        .given("NumberLiteral")
        .derive(value => ({ left: parseFloat(value.literal), operator: Operator.ADD, right: 0 })),
    ParenthesizedExpression: define("ParenthesizedExpression")
        .given(Operator.OPEN_PAREN, "Expression", Operator.CLOSE_PAREN)
        .derive((_open, expression, _close) => expression),
    BinaryOpExpression: define("BinaryOpExpression")
        .given("Expression", Operator.ADD, "Expression")
        .derive((left, operator, right) => ({ left, operator: operator, right })),
    Expression: define("Expression")
        .given("LiteralExpression", "ParenthesizedExpression", "BinaryOpExpression")
        .union(expression => expression),
}));
