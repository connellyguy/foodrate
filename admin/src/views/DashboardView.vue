<template>
    <div>
        <h2 class="page-title">Dashboard</h2>

        <div v-if="loading" class="loading-container">
            <ProgressSpinner />
        </div>

        <template v-else>
            <div class="stats-row">
                <StatsCard label="Restaurants" :value="totalStats.restaurants" icon="pi-building" />
                <StatsCard label="Items" :value="totalStats.items" icon="pi-list" />
                <StatsCard label="Ratings" :value="totalStats.ratings" icon="pi-star" />
            </div>

            <DataTable
                :value="categoryBreakdown"
                striped-rows
                sort-field="category_name"
                :sort-order="1"
            >
                <Column field="category_name" header="Category" sortable />
                <Column field="restaurant_count" header="Restaurants" sortable />
                <Column field="item_count" header="Items" sortable />
                <Column field="rating_count" header="Ratings" sortable />
            </DataTable>

            <div class="attention-grid">
                <div class="attention-card">
                    <h3>Restaurants with no items</h3>
                    <ul v-if="needsAttention.restaurantsWithNoItems.length > 0">
                        <li
                            v-for="restaurant in needsAttention.restaurantsWithNoItems"
                            :key="restaurant.id"
                        >
                            {{ restaurant.name }}
                        </li>
                    </ul>
                    <p v-else class="muted">All restaurants have items</p>
                </div>

                <div class="attention-card">
                    <h3>Items with few ratings</h3>
                    <ul v-if="needsAttention.itemsWithFewRatings.length > 0">
                        <li
                            v-for="item in needsAttention.itemsWithFewRatings"
                            :key="item.id"
                            class="item-row"
                        >
                            <span>{{ item.name }}</span>
                            <span class="muted">{{ item.restaurant_name }}</span>
                            <span class="rating-count">{{ item.rating_count }}</span>
                        </li>
                    </ul>
                    <p v-else class="muted">All items have sufficient ratings</p>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import ProgressSpinner from 'primevue/progressspinner';

import StatsCard from '@/components/StatsCard.vue';
import { useDashboard } from '@/composables/useDashboard';

const { totalStats, categoryBreakdown, needsAttention, loading, fetchDashboardStats } = useDashboard();

onMounted(() => {
    fetchDashboardStats();
});
</script>

<style scoped>
.page-title {
    margin: 0 0 1rem;
    font-size: 1.5rem;
    color: var(--p-text-color);
}

.loading-container {
    display: flex;
    justify-content: center;
    padding: 3rem 0;
}

.stats-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.stats-row > * {
    flex: 1;
}

.attention-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-top: 1.5rem;
}

.attention-card {
    background: var(--p-surface-0);
    border: 1px solid var(--p-surface-200);
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
}

.attention-card h3 {
    margin: 0 0 0.75rem;
    font-size: 1rem;
    color: var(--p-text-color);
}

.attention-card ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.attention-card li {
    padding: 0.375rem 0;
    color: var(--p-text-color);
    border-bottom: 1px solid var(--p-surface-100);
}

.attention-card li:last-child {
    border-bottom: none;
}

.item-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.item-row > span:first-child {
    flex: 1;
}

.rating-count {
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    min-width: 1.5rem;
    text-align: right;
}

.muted {
    color: var(--p-text-muted-color);
    font-size: 0.875rem;
}
</style>
