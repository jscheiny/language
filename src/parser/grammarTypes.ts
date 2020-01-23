// Using the following convention for generic type parameters:
// N (NonTerminals) - an object mapping from the non terminal symbol names to the types they should produce when building the AST
// T (Terminals) - a type representing the possible terminal tokens available, constant and variable
// K (Key) - which production are we refering to in the non-terminals object
// P (Parameters) - the inputs to a production

/** A map from non-terminals to productions for those non-terminals  */
export interface Grammar<N, T extends Terminal> {
    productions: GrammarProductions<N, T>;
    start: keyof N;
}

export type GrammarProductions<N, T extends Terminal> = { [K in keyof N]: Production<N, T, K> };

/** An array of productions for a given non-terminal */
export type Production<N, T extends Terminal, K extends keyof N> = Array<
    ProductionDefinition<N, T, K, ProductionParameters<N, T>>
>;

/** A single production for a non-terminal, given a set of inputs and a rule for how that production should be handled */
export interface ProductionDefinition<N, T extends Terminal, K extends keyof N, P extends ProductionParameters<N, T>> {
    key: K;
    parameters: P;
    rule: ProductionRule<N, T, K, P>;
}

/** A function that takes the arguments of a production and produces the resulting type of the non-terminal */
export interface ProductionRule<N, T extends Terminal, K extends keyof N, P extends ProductionParameters<N, T>> {
    (...args: UnwrapArgs<N, T, P>): N[K];
}

/** A single input of a production as it is given by the definition of the production */
export type ProductionParameter<N, T extends Terminal> = keyof N | ConstantTerminal<T> | VariableTerminalKind<T>;

/** An array of inputs to a production as given by the definition of the production */
export type ProductionParameters<N, T extends Terminal> = Array<ProductionParameter<N, T>>;

/** A single input of a production as it is passed into the rule function of the production */
export type ProductionArgument<N, T extends Terminal> = N[keyof N] | T;

/** An array of inputs to a production as they are passed into the rule function of the production */
export type ProductionArguments<N, T extends Terminal> = Array<ProductionArgument<N, T>>;

/** Converts an array of production parameters into production arguments */
type UnwrapArgs<N, T extends Terminal, P extends ProductionParameters<N, T>> = {
    [I in keyof P]: UnwrapArg<N, T, P[I]>
};

/** Converts a single production parameter into a production argument */
type UnwrapArg<N, T extends Terminal, P> =
    | UnwrapNonTerminal<N, P>
    | UnwrapConstantTerminal<T, P>
    | UnwrapVariableTerminal<T, P>;

type UnwrapNonTerminal<N, P> = P extends keyof N ? N[P] : never;

type UnwrapConstantTerminal<T extends Terminal, P> = P extends ConstantTerminal<T> ? P : never;

type UnwrapVariableTerminal<T extends Terminal, P> = P extends VariableTerminalKind<T>
    ? Extract<VariableTerminal<T>, { kind: P }>
    : never;

/** The base type of a terminal token. This can be either a constant string or a variable token which has a specific kind. */
export type Terminal = string | { kind: string };
export type ConstantTerminal<T extends Terminal> = Extract<T, string>;
export type VariableTerminal<T extends Terminal> = Exclude<T, string>;
type VariableTerminalKind<T extends Terminal> = VariableTerminal<T>["kind"];
