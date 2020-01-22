import {
    BaseTerminal,
    ProductionArguments,
    ProductionDefinition,
    ProductionParameter,
    ProductionParameters,
    VariableTerminal,
} from "./grammarTypes";
import { NonTerminalToken, ParseToken, ParseTokens, TerminalToken } from "./parserTypes";

export function createTerminalToken<Terminal extends BaseTerminal>(value: Terminal): TerminalToken<Terminal> {
    return {
        kind: "terminal",
        value,
    };
}

export function createNonTerminalToken<NonTerminal, Key extends keyof NonTerminal>(
    key: Key,
    value: NonTerminal[Key],
): NonTerminalToken<NonTerminal, Key> {
    return {
        kind: "non-terminal",
        key,
        value,
    };
}

export function isMatchingProduction<
    NonTerminal,
    Terminal extends BaseTerminal,
    Key extends keyof NonTerminal,
    Params extends ProductionParameters<NonTerminal, Terminal>
>(
    production: ProductionDefinition<NonTerminal, Terminal, Key, Params>,
    tokens: Array<ParseToken<NonTerminal, Terminal>>,
    tokenOffset: number,
) {
    return production.parameters.every((parameter, index) => {
        const token = tokens[index + tokenOffset];
        return isMatchingToken(token, parameter);
    });
}

function isMatchingToken<NonTerminal, Terminal extends BaseTerminal>(
    token: ParseToken<NonTerminal, Terminal>,
    parameter: ProductionParameter<NonTerminal, Terminal>,
): boolean {
    if (token.kind === "non-terminal") {
        return token.key === parameter;
    }

    const { value } = token;
    // If the terminal is constant, simply check equality
    if (typeof value === "string") {
        return value === parameter;
    }
    // If the terminal is variable, check the kind
    return (value as VariableTerminal<Terminal>).kind === parameter;
}

export function applyProduction<
    NonTerminal,
    Terminal extends BaseTerminal,
    Key extends keyof NonTerminal,
    Params extends ProductionParameters<NonTerminal, Terminal>
>(
    key: Key,
    production: ProductionDefinition<NonTerminal, Terminal, Key, Params>,
    tokens: ParseTokens<NonTerminal, Terminal>,
    tokenOffset: number,
): NonTerminalToken<NonTerminal, Key> {
    const args: ProductionArguments<NonTerminal, Terminal> = production.parameters.map(
        (_param, index) => tokens[index + tokenOffset].value,
    );

    return createNonTerminalToken(key, production.rule(...(args as any)));
}
