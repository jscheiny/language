import {
    Grammar,
    GrammarProductions,
    Production,
    ProductionParameters,
    ProductionRule,
    Terminal,
} from "./grammarTypes";

interface ProductionBuilderFactory<N, T extends Terminal> {
    <K extends keyof N>(key: K): ProductionBuilder<N, T, K>;
}

interface ProductionBuilder<N, T extends Terminal, K extends keyof N> {
    given<P extends ProductionParameters<N, T>>(...parameters: P): ProductionRuleBinder<N, T, K, P>;
    build(): Production<N, T, K>;
}

interface ProductionRuleBinder<N, T extends Terminal, K extends keyof N, P extends ProductionParameters<N, T>> {
    produce(rule: ProductionRule<N, T, K, P>): ProductionBuilder<N, T, K>;
}

class ProductionBuilderImpl<N, T extends Terminal, K extends keyof N> implements ProductionBuilder<N, T, K> {
    private production: Production<N, T, K> = [];

    constructor(private key: K) {}

    public given<P extends ProductionParameters<N, T>>(...parameters: P): ProductionRuleBinder<N, T, K, P> {
        return {
            produce: rule => {
                // TODO Can we remove this cast somehow?
                this.production.push({
                    key: this.key,
                    parameters,
                    rule: rule as ProductionRule<N, T, K, ProductionParameters<N, T>>,
                });
                return this;
            },
        };
    }

    public build() {
        return this.production;
    }
}

export function defineGrammar<N, T extends Terminal>(
    start: keyof N,
    getProductions: (define: ProductionBuilderFactory<N, T>) => GrammarProductions<N, T>,
): Grammar<N, T> {
    return {
        start,
        productions: getProductions(key => new ProductionBuilderImpl(key)),
    };
}
