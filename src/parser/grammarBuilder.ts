import { Grammar, Production, ProductionParameters, ProductionRule } from "./types";

interface ProductionBuilderFactory<P> {
    <K extends keyof P>(key: K): ProductionBuilder<P, K>;
}

interface ProductionBuilder<P, K extends keyof P> {
    given<I extends ProductionParameters<P>>(...inputs: I): ProductionRuleBinder<P, K, I>;
    build(): Production<P, K>;
}

interface ProductionRuleBinder<P, K extends keyof P, I extends ProductionParameters<P>> {
    produce(rule: ProductionRule<P, K, I>): ProductionBuilder<P, K>;
}

class ProductionBuilderImpl<P, K extends keyof P> implements ProductionBuilder<P, K> {
    private production: Production<P, K> = [];

    public given<I extends ProductionParameters<P>>(...parameters: I): ProductionRuleBinder<P, K, I> {
        return {
            produce: rule => {
                // TODO Can we remove this cast somehow?
                this.production.push({ parameters, rule: rule as ProductionRule<P, K, any[]> });
                return this;
            },
        };
    }

    public build() {
        return this.production;
    }
}

export function defineGrammar<P>(create: (define: ProductionBuilderFactory<P>) => Grammar<P>): Grammar<P> {
    const defineProduction: ProductionBuilderFactory<P> = () => new ProductionBuilderImpl();
    return create(defineProduction);
}
