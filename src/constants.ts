export enum Keyword {
    // Declarations
    LET = "let",
    MUT = "mut",
    // Control flow
    IF = "if",
    ELSE = "else",
    FOR = "for",
    WHILE = "while",
    UNTIL = "until",
    UNLESS = "unless",
    CONTINUE = "continue",
    BREAK = "break",
}

export enum Operator {
    // Arithmetic
    ADD = "+",
    SUBTRACT = "-",
    MULTIPLY = "*",
    DIVIDE = "/",
    MODULO = "%",
    INCREMENT = "++",
    DECREMENT = "--",
    // Assignment
    COLON = ":",
    ASSIGN = "=",
    ADD_ASSIGN = "+=",
    SUBTRACT_ASSIGN = "-=",
    MULTIPLY_ASSIGN = "*=",
    DIVIDE_ASSIGN = "/=",
    EQUAL = "==",
    // Comparison
    NOT_EQUAL = "!=",
    LESS_THAN = "<",
    LESS_THAN_OR_EQUAL = "<=",
    GREATER_THAN_OR_EQUAL = ">=",
    GREATER_THAN = ">",
    // Logic
    LOGICAL_AND = "and",
    LOGICAL_OR = "or",
    LOGICAL_NOT = "not",
    // Function
    ARROW = "->",
    COMMA = ",",
    // General
    OPEN_BRACKET = "[",
    CLOSE_BRACKET = "]",
    OPEN_PAREN = "(",
    CLOSE_PAREN = ")",
    OPEN_CURLY = "{",
    CLOSE_CURLY = "}",
    STATEMENT_END = ";",
}

export enum BooleanLiteral {
    TRUE = "true",
    FALSE = "false",
}
