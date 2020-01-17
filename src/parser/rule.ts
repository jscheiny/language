import { Operator } from "../constants";
import { ConstantToken, VariableToken } from "../tokenizer/tokens";

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

type VariableTokenType = VariableToken["kind"];
type InputType<P> = keyof P | ConstantToken | VariableTokenType;

interface ProductionFactory<P, K extends keyof P> {
    given: <I extends InputType<P>[]>(...inputs: I) => ProductionDefinitionBinder<P, K, I>;
}

interface ProductionDefinitionBinder<P, K extends keyof P, I extends InputType<P>[]> {
    derive: (rule: ProductionDerivedRule<P, K, I>) => ProductionDerivedDefinition<P, K, I>;
    union: (rule: ProductionUnionRule<P, K, I>) => ProductionUnionDefinition<P, K, I>;
}

interface ProductionDerivedRule<P, K extends keyof P, I extends InputType<P>[]> {
    (...inputs: UnwrapInputs<P, I>): P[K];
}

interface ProductionUnionRule<P, K extends keyof P, I extends InputType<P>[]> {
    (input: UnwrapInput<P, I[number]>): P[K];
}

interface ProductionDerivedDefinition<P, K extends keyof P, I extends InputType<P>[]> {
    kind: "derived";
    inputs: I;
    rule: ProductionDerivedRule<P, K, I>;
}

interface ProductionUnionDefinition<P, K extends keyof P, I extends InputType<P>[]> {
    kind: "union";
    inputs: I;
    rule: ProductionUnionRule<P, K, I>;
}

type ProductionDefinition<P, K extends keyof P, I extends InputType<P>[]> =
    | ProductionDerivedDefinition<P, K, I>
    | ProductionUnionDefinition<P, K, I>;

type UnwrapInputs<P, I extends InputType<P>[]> = { [K in keyof I]: UnwrapInput<P, I[K]> };

type UnwrapInput<P, I> = I extends keyof P
    ? P[I]
    : I extends ConstantToken ? I : I extends VariableTokenType ? Extract<VariableToken, { kind: I }> : never;

type Grammar<P> = { [K in keyof P]: ProductionDefinition<P, K, any[]> };

function createProductionFactory<P>() {
    return <K extends keyof P>(_key: K): ProductionFactory<P, K> => ({
        given: <I extends InputType<P>[]>(...inputs: I) => ({
            derive: rule => ({ kind: "derived", inputs, rule }),
            union: rule => ({ kind: "union", inputs, rule }),
        }),
    });
}

const define = createProductionFactory<ProductionResults>();

const Grammar: Grammar<ProductionResults> = {
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
};
