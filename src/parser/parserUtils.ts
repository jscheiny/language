import {
    ProductionArguments,
    ProductionDefinition,
    ProductionParameter,
    ProductionParameters,
    Terminal,
    VariableTerminal,
} from "./grammarTypes";
import { NonTerminalToken, ParseToken, ParseTokens, TerminalToken } from "./parserTypes";

export function createTerminalToken<T extends Terminal>(value: T): TerminalToken<T> {
    return {
        kind: "terminal",
        value,
    };
}

export function createNonTerminalToken<N, K extends keyof N>(key: K, value: N[K]): NonTerminalToken<N, K> {
    return {
        kind: "non-terminal",
        key,
        value,
    };
}

export function isMatchingProduction<N, T extends Terminal, K extends keyof N, P extends ProductionParameters<N, T>>(
    production: ProductionDefinition<N, T, K, P>,
    tokens: ParseTokens<N, T>,
    tokenOffset: number,
) {
    return production.parameters.every((parameter, index) => {
        const token = tokens[index + tokenOffset];
        return isMatchingToken(token, parameter);
    });
}

export function isMatchingToken<N, T extends Terminal>(
    token: ParseToken<N, T>,
    parameter: ProductionParameter<N, T>,
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
    return (value as VariableTerminal<T>).kind === parameter;
}

export function applyProduction<N, T extends Terminal, K extends keyof N, P extends ProductionParameters<N, T>>(
    key: K,
    production: ProductionDefinition<N, T, K, P>,
    tokens: ParseTokens<N, T>,
    tokenOffset: number,
): NonTerminalToken<N, K> {
    const args: ProductionArguments<N, T> = production.parameters.map(
        (_param, index) => tokens[index + tokenOffset].value,
    );

    return createNonTerminalToken(key, production.rule(...(args as any)));
}
