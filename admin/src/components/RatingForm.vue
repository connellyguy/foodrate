<template>
    <Dialog
        :visible="visible"
        header="Add Seed Rating"
        modal
        :closable="!saving"
        :style="{ width: '32rem' }"
        @update:visible="$emit('update:visible', $event)"
    >
        <div class="field">
            <label for="rf-item">Item</label>
            <Select
                id="rf-item"
                v-model="form.item_id"
                :options="items"
                option-label="name"
                option-value="id"
                placeholder="Select an item"
                filter
                fluid
                :disabled="saving"
            >
                <template #option="{ option }">
                    {{ option.name }} &mdash; {{ option.restaurant_name }}
                </template>
            </Select>
        </div>

        <div class="field">
            <label>Sentiment</label>
            <div class="sentiment-picker">
                <Button
                    v-for="opt in sentimentOptions"
                    :key="opt.value"
                    :label="opt.label"
                    :severity="opt.severity"
                    :outlined="form.sentiment !== opt.value"
                    :aria-pressed="form.sentiment === opt.value"
                    :disabled="saving"
                    @click="form.sentiment = opt.value"
                />
            </div>
        </div>

        <div class="field">
            <label for="rf-tags">Attribute Tags</label>
            <MultiSelect
                id="rf-tags"
                v-model="form.attribute_tag_ids"
                :options="attributeTags"
                option-label="label"
                option-value="id"
                placeholder="Select tags"
                fluid
                :disabled="saving || !form.item_id"
                :loading="loadingTags"
            />
        </div>

        <template #footer>
            <Button
                label="Cancel"
                severity="secondary"
                text
                :disabled="saving"
                @click="$emit('update:visible', false)"
            />
            <Button
                label="Save"
                :loading="saving"
                :disabled="!isValid"
                @click="handleSave"
            />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import MultiSelect from 'primevue/multiselect';
import Select from 'primevue/select';
import { useToast } from 'primevue/usetoast';

import type { Database } from '@oakrank/db';

import { useAuth } from '@/composables/useAuth';
import type { ItemWithJoins } from '@/composables/useItems';
import { useRatings } from '@/composables/useRatings';
import { supabase } from '@/lib/supabase';

type AttributeTagRow = Database['public']['Tables']['attribute_tags']['Row'];

type RatingFormProps = {
    visible: boolean;
    items: ItemWithJoins[];
};

type FormData = {
    item_id: string;
    sentiment: number | null;
    attribute_tag_ids: string[];
};

const sentimentOptions = [
    { value: -2, label: 'Dislike', severity: 'danger' as const },
    { value: -1, label: 'Meh', severity: 'warn' as const },
    { value: 1, label: 'Like it', severity: 'info' as const },
    { value: 2, label: 'Love it', severity: 'success' as const },
];

const props = defineProps<RatingFormProps>();

const emit = defineEmits<{
    'update:visible': [value: boolean];
    'saved': [];
}>();

const toast = useToast();
const { user } = useAuth();
const { createSeedRating } = useRatings();

const saving = ref(false);
const loadingTags = ref(false);
const attributeTags = ref<AttributeTagRow[]>([]);

const emptyForm: FormData = {
    item_id: '',
    sentiment: null,
    attribute_tag_ids: [],
};

const form = ref<FormData>({ ...emptyForm });

const isValid = computed(() =>
    form.value.item_id
    && form.value.sentiment !== null,
);

watch(() => props.visible, (open) => {
    if (!open) return;
    form.value = { ...emptyForm };
    attributeTags.value = [];
});

watch(() => form.value.item_id, async (itemId) => {
    form.value.attribute_tag_ids = [];
    attributeTags.value = [];

    if (!itemId) return;

    const selectedItem = props.items.find((i) => i.id === itemId);
    if (!selectedItem) return;

    loadingTags.value = true;
    const expectedItemId = itemId;

    try {
        const { data, error } = await supabase
            .from('attribute_tags')
            .select('*')
            .eq('category_id', selectedItem.category_id)
            .order('sort_order');

        if (form.value.item_id !== expectedItemId) return;

        if (error) {
            console.error('Failed to fetch attribute tags:', error.message);
            return;
        }

        attributeTags.value = data ?? [];
    } finally {
        if (form.value.item_id === expectedItemId) {
            loadingTags.value = false;
        }
    }
});

async function handleSave() {
    saving.value = true;

    try {
        if (!form.value.sentiment || !user.value) return;

        const { error } = await createSeedRating({
            item_id: form.value.item_id,
            sentiment: form.value.sentiment,
            user_id: user.value.id,
            attribute_tag_ids: form.value.attribute_tag_ids,
        });

        if (error) {
            toast.add({
                severity: 'error',
                summary: `Failed to create rating: ${error}`,
                life: 5000,
            });
            return;
        }

        toast.add({
            severity: 'success',
            summary: 'Rating created successfully',
            life: 3000,
        });

        emit('saved');
        emit('update:visible', false);
    } finally {
        saving.value = false;
    }
}
</script>

<style scoped>
.field {
    margin-bottom: 1rem;
}

.field label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--p-text-color);
}

.sentiment-picker {
    display: flex;
    gap: 0.5rem;
}
</style>
