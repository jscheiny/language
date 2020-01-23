import {
    BaseTerminal,
    Grammar,
    GrammarProductions,
    Production,
    ProductionParameters,
    ProductionRule,
} from "./grammarTypes";

interface ProductionBuilderFactory<NonTerminal, Terminal extends BaseTerminal> {
    <Key extends keyof NonTerminal>(key: Key): ProductionBuilder<NonTerminal, Terminal, Key>;
}

interface ProductionBuilder<NonTerminal, Terminal extends BaseTerminal, Key extends keyof NonTerminal> {
    given<Params extends ProductionParameters<NonTerminal, Terminal>>(
        ...parameters: Params
    ): ProductionRuleBinder<NonTerminal, Terminal, Key, Params>;
    build(): Production<NonTerminal, Terminal, Key>;
}

interface ProductionRuleBinder<
    NonTerminal,
    Terminal extends BaseTerminal,
    Key extends keyof NonTerminal,
    Params extends ProductionParameters<NonTerminal, Terminal>
> {
    produce(rule: ProductionRule<NonTerminal, Terminal, Key, Params>): ProductionBuilder<NonTerminal, Terminal, Key>;
}

class ProductionBuilderImpl<NonTerminal, Terminal extends BaseTerminal, Key extends keyof NonTerminal>
    implements ProductionBuilder<NonTerminal, Terminal, Key> {
    private production: Production<NonTerminal, Terminal, Key> = [];

    constructor(private key: Key) {}

    public given<Params extends ProductionParameters<NonTerminal, Terminal>>(
        ...parameters: Params
    ): ProductionRuleBinder<NonTerminal, Terminal, Key, Params> {
        return {
            produce: rule => {
                // TODO Can we remove this cast somehow?
                this.production.push({
                    key: this.key,
                    parameters,
                    rule: rule as ProductionRule<
                        NonTerminal,
                        Terminal,
                        Key,
                        ProductionParameters<NonTerminal, Terminal>
                    >,
                });
                return this;
            },
        };
    }

    public build() {
        return this.production;
    }
}

export function defineGrammar<NonTerminal, Terminal extends BaseTerminal>(
    start: keyof NonTerminal,
    getProductions: (
        define: ProductionBuilderFactory<NonTerminal, Terminal>,
    ) => GrammarProductions<NonTerminal, Terminal>,
): Grammar<NonTerminal, Terminal> {
    return {
        start,
        productions: getProductions(key => new ProductionBuilderImpl(key)),
    };
}
