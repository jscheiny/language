import { BooleanLiteral, Keyword, Operator } from "../constants";
import { argMax, isPresent } from "../utils/utils";
import { Token } from "./tokens";

interface TokenMatch {
    token: Token;
    length: number;
}

type MatchFinder = (text: string) => TokenMatch | undefined;

export function tokenize(text: string): Token[] | undefined {
    const tokens: Token[] = [];
    while (text.length !== 0) {
        const match = findTokenMatches(text);
        if (match === undefined) {
            return undefined;
        }

        const { token, length } = match;
        tokens.push(token);
        text = text.substr(length);
    }
    return tokens;
}

const findWhitespaceMatch = createRegexMatchFinder(/^\s+/, () => ({ kind: "Whitespace" }));
const findIdentifierMatch = createRegexMatchFinder(/^[\w_][\w\d]*/i, matches => ({
    kind: "Identifier",
    identifier: matches[0],
}));
const findStringLiteralMatch = createRegexMatchFinder(/^"(.*?)"/, matches => ({
    kind: "StringLiteral",
    literal: matches[1],
}));
const findNumberLiteralMatch = createRegexMatchFinder(/^\d+(\.\d*)?/, matches => ({
    kind: "NumberLiteral",
    literal: matches[0],
}));
const findBooleanLiteralMatch = createEnumMatchFinder(BooleanLiteral, literal => ({ kind: "BooleanLiteral", literal }));
const findOperatorMatch = createEnumMatchFinder(Operator, operator => ({ kind: "Operator", operator }));
const findKeywordMatch = createEnumMatchFinder(Keyword, keyword => ({ kind: "Keyword", keyword }));

const matchers = [
    findWhitespaceMatch,
    findStringLiteralMatch,
    findNumberLiteralMatch,
    findBooleanLiteralMatch,
    findKeywordMatch,
    findOperatorMatch,
    findIdentifierMatch,
];

function findTokenMatches(text: string) {
    const matches = matchers.map(matcher => matcher(text)).filter(isPresent);
    if (matches.length === 0) {
        return undefined;
    }

    return argMax(matches, match => match.length);
}

function createRegexMatchFinder(regex: RegExp, getToken: (matches: RegExpMatchArray) => Token): MatchFinder {
    return text => {
        const match = text.match(regex);
        if (match === null) {
            return undefined;
        }

        return {
            token: getToken(match),
            length: match[0].length,
        };
    };
}

function createEnumMatchFinder<T extends string>(
    type: { [index: string]: T },
    getToken: (value: T) => Token,
): MatchFinder {
    const values = Object.values(type);
    values.sort((a, b) => b.length - a.length);

    return text => {
        for (const value of values) {
            if (!text.startsWith(value)) {
                continue;
            }

            return {
                token: getToken(value),
                length: value.length,
            };
        }

        return undefined;
    };
}
