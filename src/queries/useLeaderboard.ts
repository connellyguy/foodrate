import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/src/lib/supabase';
import type { ListResult } from '@/src/lib/queries/types';

export type LeaderboardItem = {
    id: string;
    name: string;
    oakrate_score: number;
    rating_count: number;
    restaurant_name: string;
};

type LeaderboardResult = {
    data: ListResult<LeaderboardItem> | undefined;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
    refetch: () => void;
};

const SPARSE_THRESHOLD = 5;
const MIN_RATING_COUNT = 3;
const PRIMARY_LIMIT = 50;
const FALLBACK_LIMIT = 20;

type ItemRow = {
    id: string;
    name: string;
    oakrate_score: number;
    rating_count: number;
    restaurants: { id: string; name: string; market_id: string } | null;
};

function toLeaderboardItem(row: ItemRow): LeaderboardItem {
    return {
        id: row.id,
        name: row.name,
        oakrate_score: row.oakrate_score,
        rating_count: row.rating_count,
        restaurant_name: row.restaurants?.name ?? '',
    };
}

async function fetchMarketId(): Promise<string> {
    const { data, error } = await supabase
        .from('markets')
        .select('id')
        .eq('slug', 'raleigh-nc')
        .single();

    if (error) throw error;
    return data.id;
}

async function fetchPrimary(categorySlug: string, marketId: string): Promise<LeaderboardItem[]> {
    const { data, error } = await supabase
        .from('items')
        .select(`
            id,
            name,
            oakrate_score,
            rating_count,
            restaurants!inner ( id, name, market_id ),
            categories!inner ( id, slug )
        `)
        .eq('categories.slug', categorySlug)
        .eq('restaurants.market_id', marketId)
        .gte('rating_count', MIN_RATING_COUNT)
        .order('oakrate_score', { ascending: false })
        .limit(PRIMARY_LIMIT);

    if (error) throw error;
    return (data as unknown as ItemRow[]).map(toLeaderboardItem);
}

async function fetchFallback(marketId: string): Promise<LeaderboardItem[]> {
    const { data, error } = await supabase
        .from('items')
        .select(`
            id,
            name,
            oakrate_score,
            rating_count,
            restaurants!inner ( id, name, market_id ),
            categories!inner ( id, slug, featured )
        `)
        .eq('restaurants.market_id', marketId)
        .eq('categories.featured', true)
        .gte('rating_count', MIN_RATING_COUNT)
        .order('oakrate_score', { ascending: false })
        .limit(FALLBACK_LIMIT);

    if (error) throw error;
    return (data as unknown as ItemRow[]).map(toLeaderboardItem);
}

export function useLeaderboard(categorySlug: string): LeaderboardResult {
    const market = useQuery({
        queryKey: ['market', 'raleigh-nc'],
        queryFn: fetchMarketId,
        staleTime: Infinity,
    });

    const marketId = market.data;

    const primary = useQuery({
        queryKey: ['leaderboard', categorySlug, marketId],
        queryFn: () => fetchPrimary(categorySlug, marketId!),
        enabled: !!marketId,
    });

    const isSparse = (primary.data?.length ?? 0) < SPARSE_THRESHOLD;

    const fallback = useQuery({
        queryKey: ['leaderboard-fallback', marketId],
        queryFn: () => fetchFallback(marketId!),
        enabled: !!marketId && primary.isSuccess && isSparse,
    });

    const isLoading =
        market.isLoading
        || primary.isLoading
        || (primary.isSuccess && isSparse && fallback.isLoading && !fallback.isFetched);

    const isError = market.isError || primary.isError;
    const error = market.error ?? primary.error ?? null;

    let data: ListResult<LeaderboardItem> | undefined;
    if (!primary.isSuccess) {
        data = undefined;
    } else if (!isSparse) {
        data = { items: primary.data, source: 'primary' };
    } else if (fallback.isSuccess && fallback.data.length > 0) {
        data = {
            items: fallback.data,
            source: 'fallback',
            fallbackReason: 'sparse-category',
        };
    } else if (!fallback.isFetched && !fallback.isError) {
        data = undefined;
    } else {
        data = { items: primary.data, source: 'primary' };
    }

    function refetch() {
        market.refetch();
        primary.refetch();
        fallback.refetch();
    }

    return {
        data,
        isLoading,
        isError,
        error,
        refetch,
    };
}
