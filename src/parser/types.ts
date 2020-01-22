import { ConstantToken, VariableToken } from "../tokenizer/tokens";

// Inputs

type VariableTokenType = VariableToken["kind"];
export type InputType<P> = keyof P | ConstantToken | VariableTokenType;

// Productions

export type Grammar<P> = { [K in keyof P]: Production<P, K> };

export type Production<P, K extends keyof P> = Array<ProductionDefinition<P, K, any[]>>;

export interface ProductionDefinition<P, K extends keyof P, I extends Array<InputType<P>>> {
    inputs: I;
    rule: ProductionRule<P, K, I>;
}

export interface ProductionRule<P, K extends keyof P, I extends Array<InputType<P>>> {
    (...inputs: UnwrapInputs<P, I>): P[K];
}

type UnwrapInputs<P, I extends Array<InputType<P>>> = { [K in keyof I]: UnwrapInput<P, I[K]> };

type UnwrapInput<P, I> = UnwrapNonTerminal<P, I> | UnwrapConstantTerminal<I> | UnwrapVariableTerminal<I>;

type UnwrapNonTerminal<P, I> = I extends keyof P ? P[I] : never;
type UnwrapConstantTerminal<I> = I extends ConstantToken ? I : never;
type UnwrapVariableTerminal<I> = I extends VariableTokenType ? Extract<VariableToken, { kind: I }> : never;
