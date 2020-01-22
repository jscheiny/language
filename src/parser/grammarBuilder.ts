import { Grammar, Production, ProductionParameters, ProductionRule } from "./types";

interface ProductionBuilderFactory<G> {
    <K extends keyof G>(key: K): ProductionBuilder<G, K>;
}

interface ProductionBuilder<G, K extends keyof G> {
    given<P extends ProductionParameters<G>>(...parameters: P): ProductionRuleBinder<G, K, P>;
    build(): Production<G, K>;
}

interface ProductionRuleBinder<G, K extends keyof G, P extends ProductionParameters<G>> {
    produce(rule: ProductionRule<G, K, P>): ProductionBuilder<G, K>;
}

class ProductionBuilderImpl<G, K extends keyof G> implements ProductionBuilder<G, K> {
    private production: Production<G, K> = [];

    public given<P extends ProductionParameters<G>>(...parameters: P): ProductionRuleBinder<G, K, P> {
        return {
            produce: rule => {
                // TODO Can we remove this cast somehow?
                this.production.push({ parameters, rule: rule as ProductionRule<G, K, any[]> });
                return this;
            },
        };
    }

    public build() {
        return this.production;
    }
}

export function defineGrammar<G>(create: (define: ProductionBuilderFactory<G>) => Grammar<G>): Grammar<G> {
    return create(() => new ProductionBuilderImpl());
}
