import { Terminal } from "./grammarTypes";

export interface TerminalToken<T extends Terminal> {
    kind: "terminal";
    value: T;
}

export interface NonTerminalToken<N, K extends keyof N> {
    kind: "non-terminal";
    key: K;
    value: N[K];
}

export type ParseToken<N, T extends Terminal> = TerminalToken<T> | NonTerminalToken<N, keyof N>;

export type ParseTokens<N, T extends Terminal> = Array<ParseToken<N, T>>;
