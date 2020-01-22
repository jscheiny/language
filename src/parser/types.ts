import { ConstantToken, VariableToken, VariableTokenKind } from "../tokenizer/tokens";

/** A single input of a production as it is given by the definition of the production */
export type ProductionParameter<P> = keyof P | ConstantToken | VariableTokenKind;

/** An array of inputs to a production as given by the definition of the production */
export type ProductionParameters<P> = Array<ProductionParameter<P>>;

/** A single input of a production as it is given to the rule function of the production */
export type ProductionArgument<P> = P[keyof P] | UnwrapArg<P, ProductionParameter<P>>;

/** A map from non-terminals to productions for those non-terminals  */
export type Grammar<P> = { [K in keyof P]: Production<P, K> };

/** An array of productions for a given non-terminal, K */
export type Production<P, K extends keyof P> = Array<ProductionDefinition<P, K, any[]>>;

/** A single production for a non-terminal K, given a set of inputs and a rule for how that production should be handled */
export interface ProductionDefinition<P, K extends keyof P, I extends ProductionParameters<P>> {
    parameters: I;
    rule: ProductionRule<P, K, I>;
}

/**
 * A function that takes the arguments of a production and produces the resulting type of the production as specified
 * by P[K].
 */
export interface ProductionRule<P, K extends keyof P, I extends ProductionParameters<P>> {
    (...args: UnwrapArgs<P, I>): P[K];
}

/** Converts an array of production parameters into production arguments */
type UnwrapArgs<P, I extends ProductionParameters<P>> = { [K in keyof I]: UnwrapArg<P, I[K]> };

/** Converts a single production parameter into a production argument */
type UnwrapArg<P, I> = UnwrapNonTerminal<P, I> | UnwrapConstantTerminal<I> | UnwrapVariableTerminal<I>;

type UnwrapNonTerminal<P, I> = I extends keyof P ? P[I] : never;
type UnwrapConstantTerminal<I> = I extends ConstantToken ? I : never;
type UnwrapVariableTerminal<I> = I extends VariableTokenKind ? Extract<VariableToken, { kind: I }> : never;
