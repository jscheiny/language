import { Grammar, Production, ProductionParameters, ProductionRule } from "./types";

interface ProductionBuilderFactory<NonTerminals> {
    <Key extends keyof NonTerminals>(key: Key): ProductionBuilder<NonTerminals, Key>;
}

interface ProductionBuilder<NonTerminals, Key extends keyof NonTerminals> {
    given<P extends ProductionParameters<NonTerminals>>(...parameters: P): ProductionRuleBinder<NonTerminals, Key, P>;
    build(): Production<NonTerminals, Key>;
}

interface ProductionRuleBinder<
    NonTerminals,
    Key extends keyof NonTerminals,
    Params extends ProductionParameters<NonTerminals>
> {
    produce(rule: ProductionRule<NonTerminals, Key, Params>): ProductionBuilder<NonTerminals, Key>;
}

class ProductionBuilderImpl<NonTerminals, Key extends keyof NonTerminals>
    implements ProductionBuilder<NonTerminals, Key> {
    private production: Production<NonTerminals, Key> = [];

    public given<Params extends ProductionParameters<NonTerminals>>(
        ...parameters: Params
    ): ProductionRuleBinder<NonTerminals, Key, Params> {
        return {
            produce: rule => {
                // TODO Can we remove this cast somehow?
                this.production.push({ parameters, rule: rule as ProductionRule<NonTerminals, Key, any[]> });
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
