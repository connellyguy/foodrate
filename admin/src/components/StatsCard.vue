<template>
    <div class="stats-card">
        <div class="value-row">
            <i v-if="icon" :class="['pi', icon]" class="icon" aria-hidden="true" />
            <span class="value">{{ value.toLocaleString() }}</span>
        </div>
        <span class="label">{{ label }}</span>
    </div>
</template>

<script setup lang="ts">
type StatsCardProps = {
    label: string;
    value: number;
    icon?: string;
};

defineProps<StatsCardProps>();
</script>

<style scoped>
.stats-card {
    background: var(--p-surface-0);
    border: 1px solid var(--p-surface-200);
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.value-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.icon {
    font-size: 1.25rem;
    color: var(--p-text-muted-color);
}

.value {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--p-text-color);
    line-height: 1.2;
}

.label {
    font-size: 0.875rem;
    color: var(--p-text-muted-color);
    line-height: 1.5;
}
</style>
