import type { Database } from '@oakrank/db';

import { ref } from 'vue';

import { supabase } from '@/lib/supabase';

type RatingRow = Database['public']['Tables']['ratings']['Row'];

export const MODERATION_STATUSES = ['active', 'hidden', 'uncounted'] as const;
export type ModerationStatus = typeof MODERATION_STATUSES[number];

export type RatingWithJoins = RatingRow & {
    item_name: string;
    restaurant_name: string;
    user_display_name: string;
    tags: string[];
};

type RatingFilters = {
    restaurant_id?: string;
    item_id?: string;
    moderation_status?: ModerationStatus;
};

type CreateSeedRatingInput = {
    item_id: string;
    sentiment: number;
    user_id: string;
    attribute_tag_ids: string[];
};

export const SENTIMENT_LABELS: Record<number, string> = {
    2: 'Love it',
    1: 'Like it',
    '-1': 'Meh',
    '-2': 'Dislike',
};

const ratings = ref<RatingWithJoins[]>([]);
const loading = ref(false);

async function fetchRatings(filters?: RatingFilters): Promise<void> {
    loading.value = true;

    try {
        let query = supabase
            .from('ratings')
            .select('*, items(name, restaurant_id, restaurants(name)), profiles(display_name), rating_attributes(attribute_tags(label))')
            .order('created_at', { ascending: false });

        if (filters?.item_id) {
            query = query.eq('item_id', filters.item_id);
        }

        if (filters?.moderation_status) {
            query = query.eq('moderation_status', filters.moderation_status);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Failed to fetch ratings:', error.message);
            return;
        }

        type JoinedItem = { name: string; restaurant_id: string; restaurants: { name: string } | null } | null;

        const rows = data ?? [];
        const filtered = filters?.restaurant_id
            ? rows.filter((r) => (r.items as JoinedItem)?.restaurant_id === filters.restaurant_id)
            : rows;

        ratings.value = filtered.map(({ items, profiles, rating_attributes, ...rest }) => ({
            ...rest,
            item_name: (items as JoinedItem)?.name ?? '',
            restaurant_name: (items as JoinedItem)?.restaurants?.name ?? '',
            user_display_name: (profiles as { display_name: string | null } | null)?.display_name ?? '',
            tags: ((rating_attributes as { attribute_tags: { label: string } | null }[] | null) ?? [])
                .map((ra) => (ra.attribute_tags as { label: string } | null)?.label)
                .filter((label): label is string => label != null),
        }));
    } finally {
        loading.value = false;
    }
}

async function createSeedRating(input: CreateSeedRatingInput): Promise<{ error: string | null }> {
    const { data, error: insertError } = await supabase
        .from('ratings')
        .insert({
            item_id: input.item_id,
            sentiment: input.sentiment,
            user_id: input.user_id,
        })
        .select('id')
        .single();

    if (insertError) {
        console.error('Failed to create rating:', insertError.message);
        return { error: insertError.message };
    }

    if (input.attribute_tag_ids.length > 0) {
        const rows = input.attribute_tag_ids.map((attribute_tag_id) => ({
            rating_id: data.id,
            attribute_tag_id,
        }));

        const { error: tagError } = await supabase
            .from('rating_attributes')
            .insert(rows);

        if (tagError) {
            console.error('Failed to insert rating attributes:', tagError.message);
            await supabase.from('ratings').delete().eq('id', data.id);
            return { error: tagError.message };
        }
    }

    await fetchRatings();
    return { error: null };
}

async function deleteRating(id: string): Promise<{ error: string | null }> {
    const { error } = await supabase
        .from('ratings')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Failed to delete rating:', error.message);
        return { error: error.message };
    }

    await fetchRatings();
    return { error: null };
}

async function updateModerationStatus(id: string, status: ModerationStatus): Promise<{ error: string | null }> {
    const { error } = await supabase
        .from('ratings')
        .update({ moderation_status: status })
        .eq('id', id);

    if (error) {
        console.error('Failed to update moderation status:', error.message);
        return { error: error.message };
    }

    await fetchRatings();
    return { error: null };
}

async function bulkUpdateModerationStatus(ids: string[], status: ModerationStatus): Promise<{ error: string | null }> {
    const { error } = await supabase
        .from('ratings')
        .update({ moderation_status: status })
        .in('id', ids);

    if (error) {
        console.error('Failed to bulk update moderation status:', error.message);
        return { error: error.message };
    }

    await fetchRatings();
    return { error: null };
}

export function useRatings() {
    return {
        ratings,
        loading,
        fetchRatings,
        createSeedRating,
        deleteRating,
        updateModerationStatus,
        bulkUpdateModerationStatus,
    };
}
