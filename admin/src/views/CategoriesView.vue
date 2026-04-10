<template>
    <div>
        <div class="page-header">
            <h2>Categories</h2>
            <Button
                label="Add Category"
                icon="pi pi-plus"
                @click="openCreate"
            />
        </div>

        <DataTable
            :value="categoriesWithCounts"
            :loading="loading"
            striped-rows
            paginator
            :rows="10"
            sort-field="name"
            :sort-order="1"
            :row-hover="true"
        >
            <Column field="name" header="Name" sortable />
            <Column field="slug" header="Slug" />
            <Column field="featured" header="Featured" :style="{ width: '8rem' }">
                <template #body="{ data }">
                    <Tag
                        :value="data.featured ? 'Yes' : 'No'"
                        :severity="data.featured ? 'success' : 'secondary'"
                    />
                </template>
            </Column>
            <Column field="sort_order" header="Sort Order" sortable :style="{ width: '8rem' }" />
            <Column field="item_count" header="Items" :style="{ width: '6rem' }" />
            <Column field="created_at" header="Created" sortable :style="{ width: '10rem' }">
                <template #body="{ data }">
                    {{ formatDate(data.created_at) }}
                </template>
            </Column>
            <Column header="Actions" :style="{ width: '6rem' }">
                <template #body="{ data }">
                    <Button
                        icon="pi pi-pencil"
                        severity="secondary"
                        text
                        rounded
                        :aria-label="`Edit ${data.name}`"
                        @click="openEdit(data)"
                    />
                </template>
            </Column>
        </DataTable>

        <CategoryForm
            v-model:visible="formVisible"
            :category="editingCategory"
            @saved="handleSaved"
        />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Tag from 'primevue/tag';

import CategoryForm from '@/components/CategoryForm.vue';
import type { CategoryWithCounts } from '@/composables/useCategories';
import { useCategories } from '@/composables/useCategories';
import { formatDate } from '@/lib/formatDate';

const { categoriesWithCounts, loading, fetchCategoriesWithCounts } = useCategories();

const formVisible = ref(false);
const editingCategory = ref<CategoryWithCounts | null>(null);

onMounted(() => {
    fetchCategoriesWithCounts();
});

function openCreate() {
    editingCategory.value = null;
    formVisible.value = true;
}

function openEdit(category: CategoryWithCounts) {
    editingCategory.value = category;
    formVisible.value = true;
}

function handleSaved() {
    fetchCategoriesWithCounts();
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
</style>
