<template>
    <Dialog
        :visible="visible"
        header="Batch Create Items"
        modal
        :closable="!saving"
        :style="{ width: '36rem' }"
        @update:visible="$emit('update:visible', $event)"
    >
        <div class="field">
            <label for="ibf-restaurant">Restaurant</label>
            <Select
                id="ibf-restaurant"
                v-model="restaurantId"
                :options="restaurants"
                option-label="name"
                option-value="id"
                placeholder="Select a restaurant"
                filter
                fluid
                :disabled="saving"
            />
        </div>

        <div class="field">
            <SelectButton
                v-model="mode"
                :options="modeOptions"
                :disabled="saving"
                aria-label="Input mode"
            />
        </div>

        <template v-if="mode === 'Rapid-fire'">
            <div class="field">
                <label for="ibf-category">Category</label>
                <Select
                    id="ibf-category"
                    v-model="categoryId"
                    :options="categories"
                    option-label="name"
                    option-value="id"
                    placeholder="Select a category"
                    fluid
                    :disabled="saving"
                />
            </div>

            <div class="field">
                <label for="ibf-name">Item name</label>
                <div class="rapid-input-row">
                    <InputText
                        id="ibf-name"
                        ref="nameInputRef"
                        v-model="rapidName"
                        fluid
                        :disabled="saving"
                        placeholder="Type name and press Enter"
                        @keydown.enter.prevent="addRapidItem"
                    />
                    <Button
                        icon="pi pi-plus"
                        :disabled="saving || !rapidName.trim()"
                        aria-label="Add item"
                        @click="addRapidItem"
                    />
                </div>
            </div>

            <ul v-if="rapidItems.length" class="rapid-list">
                <li v-for="(item, index) in rapidItems" :key="index" class="rapid-item">
                    <span class="rapid-item-name">{{ item }}</span>
                    <Button
                        icon="pi pi-times"
                        severity="danger"
                        text
                        rounded
                        size="small"
                        :aria-label="`Remove ${item}`"
                        :disabled="saving"
                        @click="removeRapidItem(index)"
                    />
                </li>
            </ul>
        </template>

        <template v-else>
            <div class="field">
                <label for="ibf-paste">Items (one per line: name | category)</label>
                <Textarea
                    id="ibf-paste"
                    v-model="pasteText"
                    fluid
                    rows="8"
                    :disabled="saving"
                    placeholder="Pepperoni Pizza | Pizza&#10;Buffalo Wings | Wings&#10;Spicy Tuna Roll | Sushi"
                />
                <small class="field-hint">
                    Use <code>|</code> to separate name and category
                    ({{ categoryNames }})
                </small>
            </div>
        </template>

        <template #footer>
            <Button
                label="Cancel"
                severity="secondary"
                text
                :disabled="saving"
                @click="$emit('update:visible', false)"
            />
            <Button
                v-if="mode === 'Rapid-fire'"
                label="Save All"
                :loading="saving"
                :disabled="!canSaveRapid"
                @click="handleSaveRapid"
            />
            <Button
                v-else
                label="Create All"
                :loading="saving"
                :disabled="!canSavePaste"
                @click="handleSavePaste"
            />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';

import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import SelectButton from 'primevue/selectbutton';
import Textarea from 'primevue/textarea';
import { useToast } from 'primevue/usetoast';

import type { Category } from '@/composables/useCategories';
import { useItems } from '@/composables/useItems';
import type { RestaurantRow } from '@/composables/useRestaurants';

type ParsedItem = {
    name: string;
    category_id: string;
    category_name: string;
};

type ItemBatchFormProps = {
    visible: boolean;
    restaurants: RestaurantRow[];
    categories: Category[];
};

const props = defineProps<ItemBatchFormProps>();

const emit = defineEmits<{
    'update:visible': [value: boolean];
    'saved': [];
}>();

const toast = useToast();
const { batchCreateItems } = useItems();

const modeOptions = ['Rapid-fire', 'Paste'];
const mode = ref('Rapid-fire');
const saving = ref(false);

const restaurantId = ref('');
const categoryId = ref('');

const rapidName = ref('');
const rapidItems = ref<string[]>([]);
const nameInputRef = ref<{ $el: HTMLElement } | null>(null);

const pasteText = ref('');

const categoryNames = computed(() =>
    props.categories.map(c => c.name).join(', '),
);

const canSaveRapid = computed(() =>
    restaurantId.value && categoryId.value
    && (rapidItems.value.length > 0 || rapidName.value.trim().length > 0),
);

const canSavePaste = computed(() =>
    restaurantId.value && pasteText.value.trim().length > 0,
);

watch(() => props.visible, (open) => {
    if (!open) return;

    mode.value = 'Rapid-fire';
    rapidName.value = '';
    rapidItems.value = [];
    pasteText.value = '';

    nextTick(() => {
        focusNameInput();
    });
});

function focusNameInput() {
    nameInputRef.value?.$el?.focus();
}

function matchCategory(input: string): Category | null {
    const lower = input.toLowerCase();
    return props.categories.find(c => c.name.toLowerCase() === lower) ?? null;
}

function parseLine(line: string): ParsedItem | null {
    const parts = line.split('|');
    if (parts.length < 2) return null;

    const name = parts[0].trim();
    const categoryInput = parts.slice(1).join('|').trim();
    if (!name || !categoryInput) return null;

    const category = matchCategory(categoryInput);
    if (!category) return null;

    return { name, category_id: category.id, category_name: category.name };
}

function addRapidItem() {
    const trimmed = rapidName.value.trim();
    if (!trimmed) return;

    rapidItems.value.push(trimmed);
    rapidName.value = '';
    focusNameInput();
}

function removeRapidItem(index: number) {
    rapidItems.value.splice(index, 1);
}

async function submitBatch(items: ParsedItem[]) {
    saving.value = true;

    try {
        const inputs = items.map(item => ({
            name: item.name,
            restaurant_id: restaurantId.value,
            category_id: item.category_id,
        }));

        const { error } = await batchCreateItems(inputs);

        if (error) {
            toast.add({
                severity: 'error',
                summary: `Failed to create items: ${error}`,
                life: 5000,
            });
            return;
        }

        toast.add({
            severity: 'success',
            summary: `Created ${items.length} item${items.length === 1 ? '' : 's'} successfully`,
            life: 3000,
        });

        rapidItems.value = [];
        rapidName.value = '';
        pasteText.value = '';

        emit('saved');
        emit('update:visible', false);
    } finally {
        saving.value = false;
    }
}

async function handleSaveRapid() {
    addRapidItem();
    const items = rapidItems.value.map(name => ({
        name,
        category_id: categoryId.value,
        category_name: '',
    }));
    if (items.length === 0) return;
    await submitBatch(items);
}

async function handleSavePaste() {
    const lines = pasteText.value
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);

    if (lines.length === 0) return;

    const parsed: ParsedItem[] = [];
    const errors: string[] = [];

    for (const line of lines) {
        const item = parseLine(line);
        if (item) {
            parsed.push(item);
        } else {
            errors.push(line);
        }
    }

    if (errors.length > 0) {
        toast.add({
            severity: 'warn',
            summary: `${errors.length} line${errors.length === 1 ? '' : 's'} skipped (bad format or unknown category)`,
            detail: errors.slice(0, 3).join(', '),
            life: 5000,
        });
    }

    if (parsed.length === 0) return;

    await submitBatch(parsed);
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

.field-hint {
    display: block;
    margin-top: 0.375rem;
    font-size: 0.75rem;
    color: var(--p-text-muted-color);
}

.field-hint code {
    padding: 0.125rem 0.25rem;
    background: var(--p-content-hover-background);
    border-radius: 0.25rem;
    font-size: 0.75rem;
}

.rapid-input-row {
    display: flex;
    gap: 0.5rem;
}

.rapid-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.rapid-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.375rem 0.5rem;
    border-bottom: 1px solid var(--p-content-border-color);
}

.rapid-item:last-child {
    border-bottom: none;
}

.rapid-item-name {
    font-size: 0.875rem;
    color: var(--p-text-color);
}

.rapid-item-category {
    margin-left: 0.5rem;
    font-size: 0.75rem;
    color: var(--p-text-muted-color);
}
</style>
