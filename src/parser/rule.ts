import { Operator } from "../constants";
import { TokenKind, TokenType } from "../tokenizer/tokens";

interface Expression {
    left: Expression | number;
    operator: Operator;
    right: Expression | number;
}

interface ProductionResults {
    LiteralExpression: Expression;
    ParenthesizedExpression: Expression;
    BinaryOpExpression: Expression;
    Expression: Expression;
}

interface TokenProductionType<K extends TokenKind> {
    token: K;
    matcher?: (token: TokenType<K>) => boolean;
}

type ProductionType = keyof ProductionResults;
type InputType = ProductionType | TokenProductionType<any>;

interface ProductionFactory<P extends ProductionType> {
    given: <I extends InputType[]>(...inputs: I) => ProductionDefinitionBinder<P, I>;
}

interface ProductionDefinitionBinder<P extends ProductionType, I extends InputType[]> {
    derive: (rule: ProductionDerivedRule<P, I>) => ProductionDerivedDefinition<P, I>;
    union: (rule: ProductionUnionRule<P, I>) => ProductionUnionDefinition<P, I>;
}

interface ProductionDerivedRule<P extends ProductionType, I extends InputType[]> {
    (...inputs: UnwrapInputs<I>): ProductionResults[P];
}

interface ProductionUnionRule<P extends ProductionType, I extends InputType[]> {
    (input: UnwrapInput<I[number]>): ProductionResults[P];
}

interface ProductionDerivedDefinition<P extends ProductionType, I extends InputType[]> {
    kind: "derived";
    inputs: I;
    rule: ProductionDerivedRule<P, I>;
}

interface ProductionUnionDefinition<P extends ProductionType, I extends InputType[]> {
    kind: "union";
    inputs: I;
    rule: ProductionUnionRule<P, I>;
}

type ProductionDefinition<P extends ProductionType, I extends InputType[]> =
    | ProductionDerivedDefinition<P, I>
    | ProductionUnionDefinition<P, I>;

type UnwrapInputs<Inputs extends InputType[]> = { [K in keyof Inputs]: UnwrapInput<Inputs[K]> };

type UnwrapInput<I> = I extends ProductionType
    ? ProductionResults[I]
    : I extends TokenProductionType<infer K> ? TokenType<K> : never;

function defineProduction<K extends keyof ProductionResults>(_production: K): ProductionFactory<K> {
    return {
        given: <I extends InputType[]>(...inputs: I) => ({
            derive: rule => ({ kind: "derived", inputs, rule }),
            union: rule => ({ kind: "union", inputs, rule }),
        }),
    };
}

type ProductionDefinitions = { [P in keyof ProductionResults]: ProductionDefinition<P, any[]> };

function token<K extends TokenKind>(token: K, _matcher?: (token: TokenType<K>) => boolean): TokenProductionType<K> {
    return { token };
}

const ProductionDefinitions: ProductionDefinitions = {
    LiteralExpression: defineProduction("LiteralExpression")
        .given(token("NumberLiteral"))
        .derive(value => ({ left: parseFloat(value.literal), operator: Operator.ADD, right: 0 })),
    ParenthesizedExpression: defineProduction("ParenthesizedExpression")
        .given(
            token("Operator", tok => tok.operator === Operator.OPEN_PAREN),
            "Expression",
            token("Operator", tok => tok.operator === Operator.CLOSE_PAREN),
        )
        .derive((_open, expression, _close) => expression),
    BinaryOpExpression: defineProduction("BinaryOpExpression")
        .given("Expression", token("Operator", tok => tok.operator === Operator.ADD), "Expression")
        .derive((left, operator, right) => ({ left, operator: operator.operator, right })),
    Expression: defineProduction("Expression")
        .given("LiteralExpression", "ParenthesizedExpression", "BinaryOpExpression")
        .union(expression => expression),
};
