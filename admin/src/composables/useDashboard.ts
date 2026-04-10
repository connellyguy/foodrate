import { ref } from 'vue';

import { supabase } from '@/lib/supabase';

type TotalStats = {
    restaurants: number;
    items: number;
    ratings: number;
};

type CategoryBreakdown = {
    category_name: string;
    restaurant_count: number;
    item_count: number;
    rating_count: number;
};

type NeedsAttention = {
    restaurantsWithNoItems: { id: string; name: string }[];
    itemsWithFewRatings: { id: string; name: string; restaurant_name: string; rating_count: number }[];
};

const totalStats = ref<TotalStats>({ restaurants: 0, items: 0, ratings: 0 });
const categoryBreakdown = ref<CategoryBreakdown[]>([]);
const needsAttention = ref<NeedsAttention>({ restaurantsWithNoItems: [], itemsWithFewRatings: [] });
const loading = ref(false);

async function fetchDashboardStats(): Promise<void> {
    loading.value = true;

    try {
        const [
            restaurantCount,
            itemCount,
            ratingCount,
            categoriesResult,
            allItems,
            restaurantsWithItems,
            lowRatingItems,
        ] = await Promise.all([
            supabase.from('restaurants').select('*', { count: 'exact', head: true }),
            supabase.from('items').select('*', { count: 'exact', head: true }),
            supabase.from('ratings').select('*', { count: 'exact', head: true }),
            supabase
                .from('categories')
                .select('id, name')
                .order('sort_order'),
            supabase
                .from('items')
                .select('category_id, restaurant_id, rating_count'),
            supabase
                .from('restaurants')
                .select('id, name, items(count)'),
            supabase
                .from('items')
                .select('id, name, rating_count, restaurants(name)')
                .lt('rating_count', 5)
                .order('rating_count', { ascending: true })
                .limit(10),
        ]);

        totalStats.value = {
            restaurants: restaurantCount.count ?? 0,
            items: itemCount.count ?? 0,
            ratings: ratingCount.count ?? 0,
        };

        const items = allItems.data ?? [];

        categoryBreakdown.value = (categoriesResult.data ?? []).map((cat) => {
            const catItems = items.filter((i) => i.category_id === cat.id);
            const uniqueRestaurants = new Set(catItems.map((i) => i.restaurant_id));
            return {
                category_name: cat.name,
                restaurant_count: uniqueRestaurants.size,
                item_count: catItems.length,
                rating_count: catItems.reduce((sum, i) => sum + i.rating_count, 0),
            };
        });

        type RestaurantWithItemCount = { id: string; name: string; items: { count: number }[] };

        needsAttention.value = {
            restaurantsWithNoItems: ((restaurantsWithItems.data ?? []) as RestaurantWithItemCount[])
                .filter((r) => (r.items[0]?.count ?? 0) === 0)
                .slice(0, 10)
                .map(({ id, name }) => ({ id, name })),
            itemsWithFewRatings: (lowRatingItems.data ?? []).map((item) => ({
                id: item.id,
                name: item.name,
                restaurant_name: (item.restaurants as { name: string } | null)?.name ?? '',
                rating_count: item.rating_count,
            })),
        };
    } finally {
        loading.value = false;
    }
}

export function useDashboard() {
    return {
        totalStats,
        categoryBreakdown,
        needsAttention,
        loading,
        fetchDashboardStats,
    };
}
