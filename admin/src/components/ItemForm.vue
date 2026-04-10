<template>
    <Dialog
        :visible="visible"
        :header="item ? 'Edit Item' : 'Add Item'"
        modal
        :closable="!saving"
        :style="{ width: '32rem' }"
        @update:visible="$emit('update:visible', $event)"
    >
        <div class="field">
            <label for="if-name">Name</label>
            <InputText
                id="if-name"
                v-model="form.name"
                fluid
                :disabled="saving"
            />
        </div>

        <div class="field">
            <label for="if-restaurant">Restaurant</label>
            <Select
                id="if-restaurant"
                v-model="form.restaurant_id"
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
            <label for="if-category">Category</label>
            <Select
                id="if-category"
                v-model="form.category_id"
                :options="categories"
                option-label="name"
                option-value="id"
                placeholder="Select a category"
                fluid
                :disabled="saving"
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
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import { useToast } from 'primevue/usetoast';

import type { Category } from '@/composables/useCategories';
import type { ItemRow } from '@/composables/useItems';
import { useItems } from '@/composables/useItems';
import type { RestaurantRow } from '@/composables/useRestaurants';

type ItemFormProps = {
    visible: boolean;
    item?: ItemRow | null;
    restaurants: RestaurantRow[];
    categories: Category[];
};

type FormData = {
    name: string;
    restaurant_id: string;
    category_id: string;
};

const props = defineProps<ItemFormProps>();

const emit = defineEmits<{
    'update:visible': [value: boolean];
    'saved': [];
}>();

const toast = useToast();
const { createItem, updateItem } = useItems();

const saving = ref(false);

const emptyForm: FormData = {
    name: '',
    restaurant_id: '',
    category_id: '',
};

const form = ref<FormData>({ ...emptyForm });

const isValid = computed(() =>
    form.value.name.trim()
    && form.value.restaurant_id
    && form.value.category_id,
);

watch(() => props.visible, (open) => {
    if (!open) return;

    if (props.item) {
        form.value = {
            name: props.item.name,
            restaurant_id: props.item.restaurant_id,
            category_id: props.item.category_id,
        };
    } else {
        form.value = { ...emptyForm };
    }
});

async function handleSave() {
    saving.value = true;

    try {
        const payload = { ...form.value };

        const id = props.item?.id;
        const { error } = id
            ? await updateItem(id, payload)
            : await createItem(payload);

        if (error) {
            toast.add({
                severity: 'error',
                summary: `Failed to ${id ? 'update' : 'create'} item: ${error}`,
                life: 5000,
            });
            return;
        }

        toast.add({
            severity: 'success',
            summary: `Item ${id ? 'updated' : 'created'} successfully`,
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
</style>
