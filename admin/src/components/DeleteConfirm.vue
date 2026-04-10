<template>
    <Dialog
        :visible="visible"
        header="Confirm deletion"
        modal
        :closable="!loading"
        :style="{ width: '28rem' }"
        @update:visible="$emit('update:visible', $event)"
    >
        <p class="message">
            Are you sure you want to delete <strong>{{ name }}</strong>?
        </p>

        <p v-if="cascades?.length" class="cascades">
            This will also delete
            {{ cascades.map(c => `${c.count} ${c.label}`).join(' and ') }}
        </p>

        <template #footer>
            <Button
                label="Cancel"
                severity="secondary"
                text
                :disabled="loading"
                @click="$emit('update:visible', false)"
            />
            <Button
                label="Delete"
                severity="danger"
                :loading="loading"
                @click="$emit('confirm')"
            />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

type CascadeItem = {
    label: string;
    count: number;
};

type DeleteConfirmProps = {
    visible: boolean;
    name: string;
    cascades?: CascadeItem[];
    loading?: boolean;
};

defineProps<DeleteConfirmProps>();

defineEmits<{
    'update:visible': [value: boolean];
    'confirm': [];
}>();
</script>

<style scoped>
.message {
    margin: 0;
    font-size: 1rem;
    color: var(--p-text-color);
    line-height: 1.5;
}

.cascades {
    margin: 0.75rem 0 0;
    font-size: 0.875rem;
    color: var(--p-text-muted-color);
    line-height: 1.5;
}
</style>
