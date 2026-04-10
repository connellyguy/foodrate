import type { Database } from '@oakrank/db';

import { ref } from 'vue';

import { supabase } from '@/lib/supabase';

export type RestaurantRow = Database['public']['Tables']['restaurants']['Row'];
type RestaurantInsert = Database['public']['Tables']['restaurants']['Insert'];
type RestaurantUpdate = Database['public']['Tables']['restaurants']['Update'];

export type RestaurantWithCounts = RestaurantRow & {
    item_count: number;
};

type CreateRestaurantInput = Omit<RestaurantInsert, 'location' | 'fts'> & {
    lng: number;
    lat: number;
};

type UpdateRestaurantInput = Omit<RestaurantUpdate, 'location' | 'fts'> & {
    lng?: number;
    lat?: number;
};

const restaurants = ref<RestaurantWithCounts[]>([]);
const loading = ref(false);

function toPoint(lng: number, lat: number): string {
    return `POINT(${lng} ${lat})`;
}

async function fetchRestaurants(search?: string): Promise<void> {
    loading.value = true;

    try {
        let query = supabase
            .from('restaurants')
            .select('*, items(count)')
            .order('created_at', { ascending: false });

        if (search) {
            const safe = search.replace(/,/g, '');
            query = query.or(`name.ilike.%${safe}%,address_line.ilike.%${safe}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Failed to fetch restaurants:', error.message);
            return;
        }

        restaurants.value = (data ?? []).map(({ items, ...rest }) => ({
            ...rest,
            item_count: (items as { count: number }[])?.[0]?.count ?? 0,
        }));
    } finally {
        loading.value = false;
    }
}

async function createRestaurant(input: CreateRestaurantInput): Promise<{ error: string | null }> {
    const { lng, lat, ...rest } = input;

    const { error } = await supabase
        .from('restaurants')
        .insert({ ...rest, location: toPoint(lng, lat) });

    if (error) {
        console.error('Failed to create restaurant:', error.message);
        return { error: error.message };
    }

    await fetchRestaurants();
    return { error: null };
}

async function updateRestaurant(
    id: string,
    input: UpdateRestaurantInput,
): Promise<{ error: string | null }> {
    const { lng, lat, ...rest } = input;

    const updateData: RestaurantUpdate = { ...rest };
    if (lng !== undefined && lat !== undefined) {
        updateData.location = toPoint(lng, lat);
    }

    const { error } = await supabase
        .from('restaurants')
        .update(updateData)
        .eq('id', id);

    if (error) {
        console.error('Failed to update restaurant:', error.message);
        return { error: error.message };
    }

    await fetchRestaurants();
    return { error: null };
}

async function deleteRestaurant(id: string): Promise<{ error: string | null }> {
    const { error } = await supabase
        .from('restaurants')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Failed to delete restaurant:', error.message);
        return { error: error.message };
    }

    await fetchRestaurants();
    return { error: null };
}

export function useRestaurants() {
    return {
        restaurants,
        loading,
        fetchRestaurants,
        createRestaurant,
        updateRestaurant,
        deleteRestaurant,
    };
}
