<template>
    <div>
        <div class="page-header">
            <h2>Items</h2>
            <div class="header-buttons">
                <Button
                    label="Batch Add"
                    icon="pi pi-list"
                    severity="secondary"
                    @click="openBatch"
                />
                <Button
                    label="Add Item"
                    icon="pi pi-plus"
                    @click="openCreate"
                />
            </div>
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
                @change="handleFilterChange"
            />
            <Select
                v-model="filterCategoryId"
                :options="categories"
                option-label="name"
                option-value="id"
                placeholder="All Categories"
                show-clear
                aria-label="Filter by category"
                class="filter-select"
                @change="handleFilterChange"
            />
        </div>

        <DataTable
            :value="items"
            :loading="loading"
            striped-rows
            paginator
            :rows="20"
            sort-field="name"
            :sort-order="1"
            :row-hover="true"
        >
            <Column field="name" header="Name" sortable />
            <Column field="restaurant_name" header="Restaurant" sortable />
            <Column field="category_name" header="Category" sortable />
            <Column field="oakrank_score" header="Score" :style="{ width: '6rem' }">
                <template #body="{ data }">
                    {{ data.oakrank_score ?? '-' }}
                </template>
            </Column>
            <Column field="rating_count" header="Ratings" :style="{ width: '6rem' }" />
            <Column field="created_at" header="Created" sortable :style="{ width: '10rem' }">
                <template #body="{ data }">
                    {{ formatDate(data.created_at) }}
                </template>
            </Column>
            <Column header="Actions" :style="{ width: '8rem' }">
                <template #body="{ data }">
                    <div class="action-buttons">
                        <Button
                            icon="pi pi-pencil"
                            severity="secondary"
                            text
                            rounded
                            :aria-label="`Edit ${data.name}`"
                            @click="openEdit(data)"
                        />
                        <Button
                            icon="pi pi-trash"
                            severity="danger"
                            text
                            rounded
                            :aria-label="`Delete ${data.name}`"
                            @click="openDelete(data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>

        <ItemForm
            v-model:visible="formVisible"
            :item="editingItem"
            :restaurants="restaurants"
            :categories="categories"
            @saved="handleSaved"
        />

        <ItemBatchForm
            v-model:visible="batchFormVisible"
            :restaurants="restaurants"
            :categories="categories"
            @saved="handleSaved"
        />

        <DeleteConfirm
            v-model:visible="deleteVisible"
            :name="deletingItem?.name ?? ''"
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
import { useToast } from 'primevue/usetoast';

import DeleteConfirm from '@/components/DeleteConfirm.vue';
import ItemBatchForm from '@/components/ItemBatchForm.vue';
import ItemForm from '@/components/ItemForm.vue';
import { useCategories } from '@/composables/useCategories';
import type { ItemWithJoins } from '@/composables/useItems';
import { useItems } from '@/composables/useItems';
import { useRestaurants } from '@/composables/useRestaurants';
import { formatDate } from '@/lib/formatDate';

const toast = useToast();
const { items, loading, fetchItems, deleteItem } = useItems();
const { restaurants, fetchRestaurants } = useRestaurants();
const { categories, fetchCategories } = useCategories();

const filterRestaurantId = ref<string | null>(null);
const filterCategoryId = ref<string | null>(null);
let filterTimeout: ReturnType<typeof setTimeout> | null = null;

const formVisible = ref(false);
const editingItem = ref<ItemWithJoins | null>(null);

const batchFormVisible = ref(false);

const deleteVisible = ref(false);
const deletingItem = ref<ItemWithJoins | null>(null);
const deleting = ref(false);

const deleteCascades = computed(() => {
    const count = deletingItem.value?.rating_count ?? 0;
    return count > 0 ? [{ label: 'ratings', count }] : undefined;
});

onMounted(() => {
    fetchItems();
    fetchRestaurants();
    fetchCategories();
});

function currentFilters() {
    return {
        restaurant_id: filterRestaurantId.value ?? undefined,
        category_id: filterCategoryId.value ?? undefined,
    };
}

function handleFilterChange() {
    if (filterTimeout) clearTimeout(filterTimeout);
    filterTimeout = setTimeout(() => {
        fetchItems(currentFilters());
    }, 300);
}

function openCreate() {
    editingItem.value = null;
    formVisible.value = true;
}

function openBatch() {
    batchFormVisible.value = true;
}

function openEdit(item: ItemWithJoins) {
    editingItem.value = item;
    formVisible.value = true;
}

function handleSaved() {
    fetchItems(currentFilters());
}

function openDelete(item: ItemWithJoins) {
    deletingItem.value = item;
    deleteVisible.value = true;
}

async function handleDelete() {
    if (!deletingItem.value) return;

    deleting.value = true;
    const { error } = await deleteItem(deletingItem.value.id);
    deleting.value = false;

    if (error) {
        toast.add({
            severity: 'error',
            summary: `Failed to delete item: ${error}`,
            life: 5000,
        });
        return;
    }

    toast.add({
        severity: 'success',
        summary: 'Item deleted successfully',
        life: 3000,
    });

    deleteVisible.value = false;
    deletingItem.value = null;
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

.header-buttons {
    display: flex;
    gap: 0.5rem;
}

.filter-row {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.filter-select {
    width: 16rem;
}

.action-buttons {
    display: flex;
    gap: 0.25rem;
}
</style>
