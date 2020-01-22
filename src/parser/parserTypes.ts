import { BaseTerminal } from "./grammarTypes";

export interface TerminalToken<Terminal extends BaseTerminal> {
    kind: "terminal";
    value: Terminal;
}

export interface NonTerminalToken<NonTerminal, Key extends keyof NonTerminal> {
    kind: "non-terminal";
    key: Key;
    value: NonTerminal[Key];
}

export type ParseToken<NonTerminal, Terminal extends BaseTerminal> =
    | TerminalToken<Terminal>
    | NonTerminalToken<NonTerminal, keyof NonTerminal>;

export type ParseTokens<NonTerminal, Terminal extends BaseTerminal> = Array<ParseToken<NonTerminal, Terminal>>;
