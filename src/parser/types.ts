/** A map from non-terminals to productions for those non-terminals  */
export type Grammar<NonTerminal, Terminal extends BaseTerminal> = {
    productions: GrammarProductions<NonTerminal, Terminal>;
    start: keyof NonTerminal;
};

export type GrammarProductions<NonTerminal, Terminal extends BaseTerminal> = {
    [Key in keyof NonTerminal]: Production<NonTerminal, Terminal, Key>
};

/** An array of productions for a given non-terminal */
export type Production<NonTerminal, Terminal extends BaseTerminal, Key extends keyof NonTerminal> = Array<
    ProductionDefinition<NonTerminal, Terminal, Key, any[]>
>;

/** A single production for a non-terminal, given a set of inputs and a rule for how that production should be handled */
export interface ProductionDefinition<
    NonTerminal,
    Terminal extends BaseTerminal,
    Key extends keyof NonTerminal,
    Params extends ProductionParameters<NonTerminal, Terminal>
> {
    parameters: Params;
    rule: ProductionRule<NonTerminal, Terminal, Key, Params>;
}

/** A function that takes the arguments of a production and produces the resulting type of the non-terminal */
export interface ProductionRule<
    NonTerminal,
    Terminal extends BaseTerminal,
    Key extends keyof NonTerminal,
    Params extends ProductionParameters<NonTerminal, Terminal>
> {
    (...args: UnwrapArgs<NonTerminal, Terminal, Params>): NonTerminal[Key];
}

/** A single input of a production as it is given by the definition of the production */
export type ProductionParameter<NonTerminal, Terminal extends BaseTerminal> =
    | keyof NonTerminal
    | ConstantTerminal<Terminal>
    | VariableTerminalKind<Terminal>;

/** An array of inputs to a production as given by the definition of the production */
export type ProductionParameters<NonTerminal, Terminal extends BaseTerminal> = Array<
    ProductionParameter<NonTerminal, Terminal>
>;

/** A single input of a production as it is passed into the rule function of the production */
export type ProductionArgument<NonTerminal, Terminal extends BaseTerminal> = NonTerminal[keyof NonTerminal] | Terminal;

/** Converts an array of production parameters into production arguments */
type UnwrapArgs<
    NonTerminal,
    Terminal extends BaseTerminal,
    Params extends ProductionParameters<NonTerminal, Terminal>
> = { [I in keyof Params]: UnwrapArg<NonTerminal, Terminal, Params[I]> };

/** Converts a single production parameter into a production argument */
type UnwrapArg<NonTerminal, Terminal extends BaseTerminal, Param> =
    | UnwrapNonTerminal<NonTerminal, Param>
    | UnwrapConstantTerminal<Terminal, Param>
    | UnwrapVariableTerminal<Terminal, Param>;

type UnwrapNonTerminal<NonTerminal, Param> = Param extends keyof NonTerminal ? NonTerminal[Param] : never;

type UnwrapConstantTerminal<Terminal extends BaseTerminal, Param> = Param extends ConstantTerminal<Terminal>
    ? Param
    : never;

type UnwrapVariableTerminal<Terminal extends BaseTerminal, Param> = Param extends VariableTerminalKind<Terminal>
    ? Extract<VariableTerminal<Terminal>, { kind: Param }>
    : never;

/** The base type of a terminal token. This can be either a constant string or a variable token which has a specific kind. */
export type BaseTerminal = string | { kind: string };
export type ConstantTerminal<Terminal extends BaseTerminal> = Extract<Terminal, string>;
export type VariableTerminal<Terminal extends BaseTerminal> = Exclude<Terminal, string>;
type VariableTerminalKind<Terminal extends BaseTerminal> = VariableTerminal<Terminal>["kind"];
