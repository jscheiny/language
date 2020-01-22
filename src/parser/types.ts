import { ConstantToken, VariableToken, VariableTokenKind } from "../tokenizer/tokens";

/** A single input of a production as it is given by the definition of the production */
export type ProductionParameter<NonTerminals> = keyof NonTerminals | ConstantToken | VariableTokenKind;

/** An array of inputs to a production as given by the definition of the production */
export type ProductionParameters<NonTerminals> = Array<ProductionParameter<NonTerminals>>;

/** A single input of a production as it is passed into the rule function of the production */
export type ProductionArgument<NonTerminals> =
    | NonTerminals[keyof NonTerminals]
    | UnwrapArg<NonTerminals, ProductionParameter<NonTerminals>>;

/** A map from non-terminals to productions for those non-terminals  */
export type Grammar<NonTerminals> = { [Key in keyof NonTerminals]: Production<NonTerminals, Key> };

/** An array of productions for a given non-terminal */
export type Production<NonTerminals, Key extends keyof NonTerminals> = Array<
    ProductionDefinition<NonTerminals, Key, any[]>
>;

/** A single production for a non-terminal, given a set of inputs and a rule for how that production should be handled */
export interface ProductionDefinition<
    NonTerminals,
    Key extends keyof NonTerminals,
    Params extends ProductionParameters<NonTerminals>
> {
    parameters: Params;
    rule: ProductionRule<NonTerminals, Key, Params>;
}

/** A function that takes the arguments of a production and produces the resulting type of the non-terminal */
export interface ProductionRule<
    NonTerminals,
    Key extends keyof NonTerminals,
    Params extends ProductionParameters<NonTerminals>
> {
    (...args: UnwrapArgs<NonTerminals, Params>): NonTerminals[Key];
}

/** Converts an array of production parameters into production arguments */
type UnwrapArgs<NonTerminals, Params extends ProductionParameters<NonTerminals>> = {
    [I in keyof Params]: UnwrapArg<NonTerminals, Params[I]>
};

/** Converts a single production parameter into a production argument */
type UnwrapArg<NonTerminals, Param> =
    | UnwrapNonTerminal<NonTerminals, Param>
    | UnwrapConstantTerminal<Param>
    | UnwrapVariableTerminal<Param>;

type UnwrapNonTerminal<NonTerminals, Param> = Param extends keyof NonTerminals ? NonTerminals[Param] : never;
type UnwrapConstantTerminal<Param> = Param extends ConstantToken ? Param : never;
type UnwrapVariableTerminal<Param> = Param extends VariableTokenKind ? Extract<VariableToken, { kind: Param }> : never;
