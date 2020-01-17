import { BooleanLiteral, Keyword, Operator } from "../constants";

export interface WhitespaceToken {
    kind: "Whitespace";
}

export interface NumberLiteralToken {
    kind: "NumberLiteral";
    literal: string;
}

export interface StringLiteralToken {
    kind: "StringLiteral";
    literal: string;
}

export interface BooleanLiteralToken {
    kind: "BooleanLiteral";
    literal: BooleanLiteral;
}

// Implement this
export interface CommentToken {
    kind: "Comment";
    comment: string;
}

export interface IdentifierToken {
    kind: "Identifier";
    identifier: string;
}

export type Token =
    | Keyword
    | Operator
    | BooleanLiteral
    | WhitespaceToken
    | NumberLiteralToken
    | StringLiteralToken
    | CommentToken
    | IdentifierToken;

export type ConstantToken = Extract<Token, string>;
export type VariableToken = Exclude<Token, string>;
