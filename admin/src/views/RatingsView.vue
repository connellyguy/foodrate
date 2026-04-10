<template>
    <div>
        <div class="page-header">
            <h2>Ratings</h2>
            <Button
                label="Seed Rating"
                icon="pi pi-plus"
                @click="openCreate"
            />
        </div>

        <div class="filter-row">
            <Select
                v-model="filterRestaurantId"
                :options="restaurants"
                option-label="name"
                option-value="id"
                placeholder="All Restaurants"
                filter
                show-clear
                aria-label="Filter by restaurant"
                class="filter-select"
                @change="handleRestaurantFilterChange"
            />
            <Select
                v-model="filterItemId"
                :options="items"
                option-label="name"
                option-value="id"
                placeholder="All Items"
                filter
                show-clear
                aria-label="Filter by item"
                class="filter-select"
                @change="handleItemFilterChange"
            />
            <Select
                v-model="filterModerationStatus"
                :options="moderationStatusOptions"
                option-label="label"
                option-value="value"
                placeholder="All Statuses"
                show-clear
                aria-label="Filter by moderation status"
                class="filter-select"
                @change="handleModerationFilterChange"
            />
        </div>

        <ModerationActions
            mode="bulk"
            :selected-ids="selectedIds"
            :loading="moderating"
            @bulk-status-change="handleBulkStatusChange"
        />

        <DataTable
            v-model:selection="selectedRatings"
            :value="ratings"
            :loading="loading"
            data-key="id"
            striped-rows
            paginator
            :rows="20"
            sort-field="item_name"
            :sort-order="1"
            :row-hover="true"
        >
            <Column selection-mode="multiple" :style="{ width: '3rem' }" />
            <Column field="item_name" header="Item" sortable />
            <Column field="restaurant_name" header="Restaurant" sortable />
            <Column field="user_display_name" header="User" />
            <Column field="sentiment" header="Sentiment" :style="{ width: '8rem' }">
                <template #body="{ data }">
                    <Tag
                        :value="SENTIMENT_LABELS[data.sentiment] ?? String(data.sentiment)"
                        :severity="sentimentSeverity(data.sentiment)"
                    />
                </template>
            </Column>
            <Column header="Status" :style="{ width: '9rem' }">
                <template #body="{ data }">
                    <ModerationActions
                        mode="inline"
                        :status="data.moderation_status"
                        :rating-id="data.id"
                        :loading="moderating"
                        @status-change="handleStatusChange"
                    />
                </template>
            </Column>
            <Column field="tags" header="Tags">
                <template #body="{ data }">
                    {{ data.tags.join(', ') }}
                </template>
            </Column>
            <Column field="created_at" header="Created" sortable :style="{ width: '10rem' }">
                <template #body="{ data }">
                    {{ formatDate(data.created_at) }}
                </template>
            </Column>
            <Column header="Actions" :style="{ width: '5rem' }">
                <template #body="{ data }">
                    <Button
                        icon="pi pi-trash"
                        severity="danger"
                        text
                        rounded
                        :aria-label="`Delete rating on ${data.item_name}`"
                        @click="openDelete(data)"
                    />
                </template>
            </Column>
        </DataTable>

        <RatingForm
            v-model:visible="formVisible"
            :items="items"
            @saved="handleSaved"
        />

        <DeleteConfirm
            v-model:visible="deleteVisible"
            :name="deletingRatingLabel"
            :cascades="deleteCascades"
            :loading="deleting"
            @confirm="handleDelete"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Select from 'primevue/select';
import Tag from 'primevue/tag';
import { useToast } from 'primevue/usetoast';

import DeleteConfirm from '@/components/DeleteConfirm.vue';
import ModerationActions from '@/components/ModerationActions.vue';
import RatingForm from '@/components/RatingForm.vue';
import type { RatingWithJoins } from '@/composables/useRatings';
import { MODERATION_STATUSES, type ModerationStatus, SENTIMENT_LABELS, useRatings } from '@/composables/useRatings';
import { useItems } from '@/composables/useItems';
import { useRestaurants } from '@/composables/useRestaurants';
import { formatDate } from '@/lib/formatDate';

const toast = useToast();
const { ratings, loading, fetchRatings, deleteRating, updateModerationStatus, bulkUpdateModerationStatus } = useRatings();
const { restaurants, fetchRestaurants } = useRestaurants();
const { items, fetchItems } = useItems();

const filterRestaurantId = ref<string | null>(null);
const filterItemId = ref<string | null>(null);
const filterModerationStatus = ref<ModerationStatus | null>(null);
let filterTimeout: ReturnType<typeof setTimeout> | null = null;

const selectedRatings = ref<RatingWithJoins[]>([]);
const selectedIds = computed(() => selectedRatings.value.map((r) => r.id));
const moderating = ref(false);

const moderationStatusOptions = MODERATION_STATUSES.map((s) => ({
    label: s.charAt(0).toUpperCase() + s.slice(1),
    value: s,
}));

const formVisible = ref(false);

const deleteVisible = ref(false);
const deletingRating = ref<RatingWithJoins | null>(null);
const deleting = ref(false);

const deletingRatingLabel = computed(() => {
    if (!deletingRating.value) return '';
    return `rating on ${deletingRating.value.item_name}`;
});

const deleteCascades = computed(() => {
    const count = deletingRating.value?.tags.length ?? 0;
    return count > 0 ? [{ label: 'attribute tags', count }] : undefined;
});

onMounted(() => {
    fetchRatings();
    fetchRestaurants();
    fetchItems();
});

function currentFilters() {
    return {
        restaurant_id: filterRestaurantId.value ?? undefined,
        item_id: filterItemId.value ?? undefined,
        moderation_status: filterModerationStatus.value ?? undefined,
    };
}

function handleRestaurantFilterChange() {
    filterItemId.value = null;

    if (filterTimeout) clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
        fetchItems(
            filterRestaurantId.value
                ? { restaurant_id: filterRestaurantId.value }
                : undefined,
        );
        fetchRatings(currentFilters());
    }, 300);
}

function handleItemFilterChange() {
    if (filterTimeout) clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
        fetchRatings(currentFilters());
    }, 300);
}

function handleModerationFilterChange() {
    if (filterTimeout) clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
        fetchRatings(currentFilters());
    }, 300);
}

function sentimentSeverity(sentiment: number): 'success' | 'info' | 'warn' | 'danger' | undefined {
    const map: Record<number, 'success' | 'info' | 'warn' | 'danger'> = {
        2: 'success',
        1: 'info',
        '-1': 'warn',
        '-2': 'danger',
    };
    return map[sentiment];
}

function openCreate() {
    formVisible.value = true;
}

function handleSaved() {
    fetchRatings(currentFilters());
}

async function handleStatusChange(id: string, status: ModerationStatus) {
    moderating.value = true;
    const { error } = await updateModerationStatus(id, status);
    moderating.value = false;
    if (error) {
        toast.add({ severity: 'error', summary: `Failed: ${error}`, life: 5000 });
        return;
    }
    fetchRatings(currentFilters());
}

async function handleBulkStatusChange(ids: string[], status: ModerationStatus) {
    moderating.value = true;
    const { error } = await bulkUpdateModerationStatus(ids, status);
    moderating.value = false;
    if (error) {
        toast.add({ severity: 'error', summary: `Failed: ${error}`, life: 5000 });
        return;
    }
    selectedRatings.value = [];
    fetchRatings(currentFilters());
}

function openDelete(rating: RatingWithJoins) {
    deletingRating.value = rating;
    deleteVisible.value = true;
}

async function handleDelete() {
    if (!deletingRating.value) return;

    deleting.value = true;
    const { error } = await deleteRating(deletingRating.value.id);
    deleting.value = false;

    if (error) {
        toast.add({
            severity: 'error',
            summary: `Failed to delete rating: ${error}`,
            life: 5000,
        });
        return;
    }

    toast.add({
        severity: 'success',
        summary: 'Rating deleted successfully',
        life: 3000,
    });

    deleteVisible.value = false;
    deletingRating.value = null;
}
</script>

<style scoped>
.page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.page-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--p-text-color);
}

.filter-row {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.filter-select {
    width: 16rem;
}
</style>
