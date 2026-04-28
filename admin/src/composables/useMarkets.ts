import type { Database } from '@oakrate/db';

import { ref } from 'vue';

import { supabase } from '@/lib/supabase';

type Market = Database['public']['Tables']['markets']['Row'];

const markets = ref<Market[]>([]);
const loading = ref(false);

async function fetchMarkets(): Promise<void> {
    loading.value = true;
    const { data, error } = await supabase
        .from('markets')
        .select('*')
        .order('name');

    if (error) {
        console.error('Failed to fetch markets:', error.message);
    } else {
        markets.value = data;
    }
    loading.value = false;
}

export function useMarkets() {
    return {
        markets,
        loading,
        fetchMarkets,
    };
}
