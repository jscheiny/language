export function argMax<T, K>(values: T[], keyFn: (value: T) => K): T {
    let maxValue = values[0];
    let maxKey = keyFn(maxValue);
    for (let index = 1; index < values.length; index++) {
        const value = values[index];
        const key = keyFn(value);
        if (key > maxKey) {
            maxValue = value;
            maxKey = key;
        }
    }
    return maxValue;
}

export function isPresent<T>(value: T | undefined): value is T {
    return value !== undefined;
}
