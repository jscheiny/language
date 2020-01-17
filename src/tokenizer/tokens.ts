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

export interface KeywordToken {
    kind: "Keyword";
    keyword: Keyword;
}

export interface OperatorToken {
    kind: "Operator";
    operator: Operator;
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
    | WhitespaceToken
    | NumberLiteralToken
    | StringLiteralToken
    | BooleanLiteralToken
    | KeywordToken
    | OperatorToken
    | CommentToken
    | IdentifierToken;

export type TokenKind = Token["kind"];
export type TokenType<K extends TokenKind> = Extract<Token, { kind: K }>;
