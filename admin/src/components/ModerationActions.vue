<template>
    <Tag
        v-if="mode === 'inline'"
        :value="statusLabel"
        :severity="statusSeverity"
        class="status-tag"
        :class="{ 'status-tag--loading': loading }"
        role="button"
        tabindex="0"
        :aria-label="`Status: ${statusLabel}. Click to change`"
        @click="cycleStatus"
        @keydown.enter="cycleStatus"
        @keydown.space.prevent="cycleStatus"
    />

    <div v-else-if="mode === 'bulk' && selectedIds?.length" class="bulk-bar">
        <span class="bulk-bar__count">{{ selectedIds.length }} selected</span>
        <Button
            label="Set Active"
            severity="success"
            size="small"
            :loading="loading"
            :disabled="loading"
            @click="$emit('bulk-status-change', selectedIds, 'active')"
        />
        <Button
            label="Set Hidden"
            severity="warn"
            size="small"
            :loading="loading"
            :disabled="loading"
            @click="$emit('bulk-status-change', selectedIds, 'hidden')"
        />
        <Button
            label="Set Uncounted"
            severity="danger"
            size="small"
            :loading="loading"
            :disabled="loading"
            @click="$emit('bulk-status-change', selectedIds, 'uncounted')"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import Button from 'primevue/button';
import Tag from 'primevue/tag';

import { MODERATION_STATUSES, type ModerationStatus } from '@/composables/useRatings';

type ModerationActionsProps = {
    mode: 'inline' | 'bulk';
    status?: ModerationStatus;
    ratingId?: string;
    selectedIds?: string[];
    loading?: boolean;
};

const props = defineProps<ModerationActionsProps>();

const emit = defineEmits<{
    'status-change': [id: string, status: ModerationStatus];
    'bulk-status-change': [ids: string[], status: ModerationStatus];
}>();

const severityMap: Record<ModerationStatus, string> = {
    active: 'success',
    hidden: 'warn',
    uncounted: 'danger',
};

const labelMap: Record<ModerationStatus, string> = {
    active: 'Active',
    hidden: 'Hidden',
    uncounted: 'Uncounted',
};

const statusSeverity = computed(() =>
    props.status ? severityMap[props.status] : 'info',
);

const statusLabel = computed(() =>
    props.status ? labelMap[props.status] : '',
);

function cycleStatus() {
    if (props.loading || !props.ratingId || !props.status) return;

    const currentIndex = MODERATION_STATUSES.indexOf(props.status);
    const nextIndex = (currentIndex + 1) % MODERATION_STATUSES.length;
    emit('status-change', props.ratingId, MODERATION_STATUSES[nextIndex]);
}
</script>

<style scoped>
.status-tag {
    cursor: pointer;
    user-select: none;
}

.status-tag--loading {
    opacity: 0.5;
    pointer-events: none;
}

.bulk-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: var(--p-surface-100);
    border-radius: var(--p-border-radius);
}

.bulk-bar__count {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--p-text-color);
    margin-right: 0.25rem;
}
</style>
