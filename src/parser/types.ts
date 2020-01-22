import { ConstantToken, VariableToken, VariableTokenKind } from "../tokenizer/tokens";

/** A single input of a production as it is given by the definition of the production */
export type ProductionParameter<G> = keyof G | ConstantToken | VariableTokenKind;

/** An array of inputs to a production as given by the definition of the production */
export type ProductionParameters<G> = Array<ProductionParameter<G>>;

/** A single input of a production as it is given to the rule function of the production */
export type ProductionArgument<G> = G[keyof G] | UnwrapArg<G, ProductionParameter<G>>;

/** A map from non-terminals to productions for those non-terminals  */
export type Grammar<G> = { [K in keyof G]: Production<G, K> };

/** An array of productions for a given non-terminal, K */
export type Production<G, K extends keyof G> = Array<ProductionDefinition<G, K, any[]>>;

/** A single production for a non-terminal K, given a set of inputs and a rule for how that production should be handled */
export interface ProductionDefinition<G, K extends keyof G, P extends ProductionParameters<G>> {
    parameters: P;
    rule: ProductionRule<G, K, P>;
}

/**
 * A function that takes the arguments of a production and produces the resulting type of the production as specified
 * by P[K].
 */
export interface ProductionRule<G, K extends keyof G, P extends ProductionParameters<G>> {
    (...args: UnwrapArgs<G, P>): G[K];
}

/** Converts an array of production parameters into production arguments */
type UnwrapArgs<G, I extends ProductionParameters<G>> = { [K in keyof I]: UnwrapArg<G, I[K]> };

/** Converts a single production parameter into a production argument */
type UnwrapArg<G, P> = UnwrapNonTerminal<G, P> | UnwrapConstantTerminal<P> | UnwrapVariableTerminal<P>;

type UnwrapNonTerminal<G, P> = P extends keyof G ? G[P] : never;
type UnwrapConstantTerminal<P> = P extends ConstantToken ? P : never;
type UnwrapVariableTerminal<P> = P extends VariableTokenKind ? Extract<VariableToken, { kind: P }> : never;
