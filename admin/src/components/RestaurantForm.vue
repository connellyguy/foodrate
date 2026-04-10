<template>
    <Dialog
        :visible="visible"
        :header="restaurant ? 'Edit Restaurant' : 'Add Restaurant'"
        modal
        :closable="!saving"
        :style="{ width: '32rem' }"
        @update:visible="$emit('update:visible', $event)"
    >
        <div class="field">
            <label for="rf-name">Name</label>
            <InputText
                id="rf-name"
                v-model="form.name"
                fluid
                :disabled="saving"
            />
        </div>

        <div class="field">
            <label for="rf-address">Address Line</label>
            <InputText
                id="rf-address"
                v-model="form.address_line"
                fluid
                :disabled="saving"
            />
        </div>

        <div class="field-row">
            <div class="field field-grow">
                <label for="rf-city">City</label>
                <InputText
                    id="rf-city"
                    v-model="form.city"
                    fluid
                    :disabled="saving"
                />
            </div>
            <div class="field field-sm">
                <label for="rf-state">State</label>
                <InputText
                    id="rf-state"
                    v-model="form.state"
                    fluid
                    :disabled="saving"
                />
            </div>
            <div class="field field-sm">
                <label for="rf-zip">ZIP</label>
                <InputText
                    id="rf-zip"
                    v-model="form.zip"
                    fluid
                    :disabled="saving"
                />
            </div>
        </div>

        <div class="field">
            <label for="rf-market">Market</label>
            <Select
                id="rf-market"
                v-model="form.market_id"
                :options="markets"
                option-label="name"
                option-value="id"
                placeholder="Select a market"
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

import type { RestaurantRow } from '@/composables/useRestaurants';
import { useRestaurants } from '@/composables/useRestaurants';
import { useMarkets } from '@/composables/useMarkets';
import { geocode } from '@/lib/geocode';

type RestaurantFormProps = {
    visible: boolean;
    restaurant?: RestaurantRow | null;
};

type FormData = {
    name: string;
    address_line: string;
    city: string;
    state: string;
    zip: string;
    market_id: string;
};

const props = defineProps<RestaurantFormProps>();

const emit = defineEmits<{
    'update:visible': [value: boolean];
    'saved': [];
}>();

const toast = useToast();
const { createRestaurant, updateRestaurant } = useRestaurants();
const { markets, fetchMarkets } = useMarkets();

type AddressFields = {
    address_line: string;
    city: string;
    state: string;
    zip: string;
};

const saving = ref(false);
const originalAddress = ref<AddressFields | null>(null);

const emptyForm: FormData = {
    name: '',
    address_line: '',
    city: 'Raleigh',
    state: 'NC',
    zip: '',
    market_id: '',
};

const form = ref<FormData>({ ...emptyForm });

const isValid = computed(() =>
    form.value.name.trim()
    && form.value.address_line.trim()
    && form.value.city.trim()
    && form.value.state.trim()
    && form.value.zip.trim()
    && form.value.market_id,
);

watch(() => props.visible, async (open) => {
    if (!open) return;

    await fetchMarkets();

    if (props.restaurant) {
        form.value = {
            name: props.restaurant.name,
            address_line: props.restaurant.address_line,
            city: props.restaurant.city,
            state: props.restaurant.state,
            zip: props.restaurant.zip,
            market_id: props.restaurant.market_id,
        };
        originalAddress.value = {
            address_line: props.restaurant.address_line,
            city: props.restaurant.city,
            state: props.restaurant.state,
            zip: props.restaurant.zip,
        };
    } else {
        form.value = { ...emptyForm };
        originalAddress.value = null;
        const raleigh = markets.value.find(m =>
            m.slug === 'raleigh' || m.name.toLowerCase().includes('raleigh'),
        );
        if (raleigh) form.value.market_id = raleigh.id;
    }
});

function addressChanged(): boolean {
    if (!originalAddress.value) return true;
    return (
        form.value.address_line !== originalAddress.value.address_line
        || form.value.city !== originalAddress.value.city
        || form.value.state !== originalAddress.value.state
        || form.value.zip !== originalAddress.value.zip
    );
}

async function handleSave() {
    saving.value = true;

    try {
        const isEdit = !!props.restaurant?.id;
        const needsGeocode = !isEdit || addressChanged();

        let coords: { lat: number; lng: number } | null = null;

        if (needsGeocode) {
            const fullAddress = `${form.value.address_line}, ${form.value.city}, ${form.value.state} ${form.value.zip}`;
            coords = await geocode(fullAddress);

            if (!coords) {
                toast.add({
                    severity: 'error',
                    summary: 'Could not geocode address. Please verify and try again.',
                    life: 5000,
                });
                saving.value = false;
                return;
            }
        }

        const id = props.restaurant?.id;
        const { error } = id
            ? await updateRestaurant(id, coords
                ? { ...form.value, lat: coords.lat, lng: coords.lng }
                : { ...form.value })
            : await createRestaurant({ ...form.value, lat: coords!.lat, lng: coords!.lng });

        if (error) {
            toast.add({
                severity: 'error',
                summary: `Failed to ${id ? 'update' : 'create'} restaurant: ${error}`,
                life: 5000,
            });
            return;
        }

        toast.add({
            severity: 'success',
            summary: `Restaurant ${id ? 'updated' : 'created'} successfully`,
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

.field-row {
    display: flex;
    gap: 0.75rem;
}

.field-grow {
    flex: 1;
}

.field-sm {
    width: 6rem;
}
</style>
