import type { Database } from '@oakrank/db';

import { ref } from 'vue';

import { supabase } from '@/lib/supabase';

export type Category = Database['public']['Tables']['categories']['Row'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

export type CategoryWithCounts = Category & {
    item_count: number;
};

type CreateCategoryInput = Pick<CategoryInsert, 'name' | 'slug' | 'featured'>;
type UpdateCategoryInput = Pick<CategoryUpdate, 'name' | 'featured'>;

const categories = ref<Category[]>([]);
const categoriesWithCounts = ref<CategoryWithCounts[]>([]);
const loading = ref(false);

async function fetchCategories(): Promise<void> {
    loading.value = true;
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('sort_order');

        if (error) {
            console.error('Failed to fetch categories:', error.message);
            return;
        }

        categories.value = data;
    } finally {
        loading.value = false;
    }
}

async function fetchCategoriesWithCounts(): Promise<void> {
    loading.value = true;

    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*, items(count)')
            .order('sort_order');

        if (error) {
            console.error('Failed to fetch categories with counts:', error.message);
            return;
        }

        categoriesWithCounts.value = (data ?? []).map(({ items, ...rest }) => ({
            ...rest,
            item_count: (items as { count: number }[])?.[0]?.count ?? 0,
        }));
    } finally {
        loading.value = false;
    }
}

async function createCategory(input: CreateCategoryInput): Promise<{ error: string | null }> {
    const { error } = await supabase
        .from('categories')
        .insert(input);

    if (error) {
        console.error('Failed to create category:', error.message);
        return { error: error.message };
    }

    await Promise.all([fetchCategories(), fetchCategoriesWithCounts()]);
    return { error: null };
}

async function updateCategory(
    id: string,
    input: UpdateCategoryInput,
): Promise<{ error: string | null }> {
    const { error } = await supabase
        .from('categories')
        .update(input)
        .eq('id', id);

    if (error) {
        console.error('Failed to update category:', error.message);
        return { error: error.message };
    }

    await Promise.all([fetchCategories(), fetchCategoriesWithCounts()]);
    return { error: null };
}

export function useCategories() {
    return {
        categories,
        categoriesWithCounts,
        loading,
        fetchCategories,
        fetchCategoriesWithCounts,
        createCategory,
        updateCategory,
    };
}
