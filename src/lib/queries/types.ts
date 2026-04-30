export type ListResult<T> = {
    items: T[];
    source: 'primary' | 'fallback';
    fallbackReason?: 'sparse-category' | 'no-results' | 'no-rated-nearby';
};

export type DetailResult<T, S = never> = {
    data: T;
    confidence: 'high' | 'early';
    supplementary?: S;
};
