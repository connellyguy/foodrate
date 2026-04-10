<template>
    <Dialog
        :visible="visible"
        :header="category ? 'Edit Category' : 'Add Category'"
        modal
        :closable="!saving"
        :style="{ width: '32rem' }"
        @update:visible="$emit('update:visible', $event)"
    >
        <div class="field">
            <label for="cf-name">Name</label>
            <InputText
                id="cf-name"
                v-model="form.name"
                fluid
                :disabled="saving"
            />
            <small v-if="!category && form.name.trim()" class="slug-hint">
                Slug: {{ slugify(form.name) }}
            </small>
        </div>

        <div v-if="category" class="field">
            <label>Slug</label>
            <p class="slug-readonly">{{ category.slug }}</p>
        </div>

        <div class="field field-toggle">
            <ToggleSwitch
                v-model="form.featured"
                input-id="cf-featured"
                :disabled="saving"
            />
            <label for="cf-featured">Featured</label>
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
import ToggleSwitch from 'primevue/toggleswitch';
import { useToast } from 'primevue/usetoast';

import type { Category } from '@/composables/useCategories';
import { useCategories } from '@/composables/useCategories';

type CategoryFormProps = {
    visible: boolean;
    category?: Category | null;
};

type FormData = {
    name: string;
    featured: boolean;
};

const props = defineProps<CategoryFormProps>();

const emit = defineEmits<{
    'update:visible': [value: boolean];
    'saved': [];
}>();

const toast = useToast();
const { createCategory, updateCategory } = useCategories();

const saving = ref(false);

const emptyForm: FormData = {
    name: '',
    featured: false,
};

const form = ref<FormData>({ ...emptyForm });

const isValid = computed(() => form.value.name.trim().length > 0);

function slugify(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

watch(() => props.visible, (open) => {
    if (!open) return;

    if (props.category) {
        form.value = {
            name: props.category.name,
            featured: props.category.featured,
        };
    } else {
        form.value = { ...emptyForm };
    }
});

async function handleSave() {
    saving.value = true;

    try {
        const id = props.category?.id;
        const { error } = id
            ? await updateCategory(id, {
                name: form.value.name,
                featured: form.value.featured,
            })
            : await createCategory({
                name: form.value.name,
                slug: slugify(form.value.name),
                featured: form.value.featured,
            });

        if (error) {
            toast.add({
                severity: 'error',
                summary: `Failed to ${id ? 'update' : 'create'} category: ${error}`,
                life: 5000,
            });
            return;
        }

        toast.add({
            severity: 'success',
            summary: `Category ${id ? 'updated' : 'created'} successfully`,
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

.field-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.field-toggle label {
    margin-bottom: 0;
}

.slug-hint {
    display: block;
    margin-top: 0.25rem;
    color: var(--p-text-muted-color);
}

.slug-readonly {
    margin: 0;
    color: var(--p-text-muted-color);
    font-family: monospace;
}
</style>
