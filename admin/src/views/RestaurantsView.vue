<template>
    <div>
        <div class="page-header">
            <h2>Restaurants</h2>
            <Button
                label="Add Restaurant"
                icon="pi pi-plus"
                @click="openCreate"
            />
        </div>

        <InputText
            v-model="searchInput"
            placeholder="Search by name or address..."
            aria-label="Search restaurants"
            class="search-input"
            @input="handleSearch"
        />

        <DataTable
            :value="restaurants"
            :loading="loading"
            striped-rows
            paginator
            :rows="10"
            sort-field="name"
            :sort-order="1"
            :row-hover="true"
        >
            <Column field="name" header="Name" sortable />
            <Column header="Address" sortable sort-field="address_line">
                <template #body="{ data }">
                    {{ data.address_line }}, {{ data.city }}, {{ data.state }} {{ data.zip }}
                </template>
            </Column>
            <Column field="item_count" header="Items" sortable :style="{ width: '6rem' }" />
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

        <RestaurantForm
            v-model:visible="formVisible"
            :restaurant="editingRestaurant"
            @saved="handleSaved"
        />

        <DeleteConfirm
            v-model:visible="deleteVisible"
            :name="deletingRestaurant?.name ?? ''"
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
import InputText from 'primevue/inputtext';
import { useToast } from 'primevue/usetoast';

import DeleteConfirm from '@/components/DeleteConfirm.vue';
import RestaurantForm from '@/components/RestaurantForm.vue';
import type { RestaurantWithCounts } from '@/composables/useRestaurants';
import { useRestaurants } from '@/composables/useRestaurants';
import { formatDate } from '@/lib/formatDate';

const toast = useToast();
const { restaurants, loading, fetchRestaurants, deleteRestaurant } = useRestaurants();

const searchInput = ref('');
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const formVisible = ref(false);
const editingRestaurant = ref<RestaurantWithCounts | null>(null);

const deleteVisible = ref(false);
const deletingRestaurant = ref<RestaurantWithCounts | null>(null);
const deleting = ref(false);

const deleteCascades = computed(() => {
    const count = deletingRestaurant.value?.item_count ?? 0;
    return count > 0 ? [{ label: 'items', count }] : undefined;
});

onMounted(() => {
    fetchRestaurants();
});

function handleSearch() {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        fetchRestaurants(searchInput.value || undefined);
    }, 300);
}

function openCreate() {
    editingRestaurant.value = null;
    formVisible.value = true;
}

function openEdit(restaurant: RestaurantWithCounts) {
    editingRestaurant.value = restaurant;
    formVisible.value = true;
}

function handleSaved() {
    fetchRestaurants(searchInput.value || undefined);
}

function openDelete(restaurant: RestaurantWithCounts) {
    deletingRestaurant.value = restaurant;
    deleteVisible.value = true;
}

async function handleDelete() {
    if (!deletingRestaurant.value) return;

    deleting.value = true;
    const { error } = await deleteRestaurant(deletingRestaurant.value.id);
    deleting.value = false;

    if (error) {
        toast.add({
            severity: 'error',
            summary: `Failed to delete restaurant: ${error}`,
            life: 5000,
        });
        return;
    }

    toast.add({
        severity: 'success',
        summary: 'Restaurant deleted successfully',
        life: 3000,
    });

    deleteVisible.value = false;
    deletingRestaurant.value = null;
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

.search-input {
    width: 100%;
    max-width: 24rem;
    margin-bottom: 1rem;
}

.action-buttons {
    display: flex;
    gap: 0.25rem;
}
</style>
