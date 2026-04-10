import type { Database } from '@oakrank/db';

import { ref } from 'vue';

import { supabase } from '@/lib/supabase';

export type ItemRow = Database['public']['Tables']['items']['Row'];
type ItemInsert = Database['public']['Tables']['items']['Insert'];
type ItemUpdate = Database['public']['Tables']['items']['Update'];

export type ItemWithJoins = ItemRow & {
    restaurant_name: string;
    category_name: string;
};

type ItemFilters = {
    restaurant_id?: string;
    category_id?: string;
};

type CreateItemInput = Pick<ItemInsert, 'name' | 'restaurant_id' | 'category_id'>;

const items = ref<ItemWithJoins[]>([]);
const loading = ref(false);

async function fetchItems(filters?: ItemFilters): Promise<void> {
    loading.value = true;

    try {
        let query = supabase
            .from('items')
            .select('*, restaurants(name), categories(name)')
            .order('created_at', { ascending: false });

        if (filters?.restaurant_id) {
            query = query.eq('restaurant_id', filters.restaurant_id);
        }

        if (filters?.category_id) {
            query = query.eq('category_id', filters.category_id);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Failed to fetch items:', error.message);
            return;
        }

        items.value = (data ?? []).map(({ restaurants, categories, ...rest }) => ({
            ...rest,
            restaurant_name: (restaurants as { name: string } | null)?.name ?? '',
            category_name: (categories as { name: string } | null)?.name ?? '',
        }));
    } finally {
        loading.value = false;
    }
}

async function createItem(input: CreateItemInput): Promise<{ error: string | null }> {
    const { error } = await supabase
        .from('items')
        .insert(input);

    if (error) {
        console.error('Failed to create item:', error.message);
        return { error: error.message };
    }

    await fetchItems();
    return { error: null };
}

async function batchCreateItems(inputs: CreateItemInput[]): Promise<{ error: string | null }> {
    const { error } = await supabase
        .from('items')
        .insert(inputs);

    if (error) {
        console.error('Failed to batch create items:', error.message);
        return { error: error.message };
    }

    await fetchItems();
    return { error: null };
}

async function updateItem(
    id: string,
    input: ItemUpdate,
): Promise<{ error: string | null }> {
    const { error } = await supabase
        .from('items')
        .update(input)
        .eq('id', id);

    if (error) {
        console.error('Failed to update item:', error.message);
        return { error: error.message };
    }

    await fetchItems();
    return { error: null };
}

async function deleteItem(id: string): Promise<{ error: string | null }> {
    const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Failed to delete item:', error.message);
        return { error: error.message };
    }

    await fetchItems();
    return { error: null };
}

export function useItems() {
    return {
        items,
        loading,
        fetchItems,
        createItem,
        batchCreateItems,
        updateItem,
        deleteItem,
    };
}
