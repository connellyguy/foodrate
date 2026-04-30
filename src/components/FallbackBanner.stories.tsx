import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import FallbackBanner from './FallbackBanner';

const meta: Meta<typeof FallbackBanner> = {
    title: 'FallbackBanner',
    component: FallbackBanner,
    argTypes: {
        reason: {
            control: { type: 'select' },
            options: ['sparse-category', 'no-results', 'no-rated-nearby'],
        },
    },
};

export default meta;

type Story = StoryObj<typeof FallbackBanner>;

export const SparseCategory: Story = {
    name: 'Sparse Category',
    args: {
        reason: 'sparse-category',
    },
};

export const NoResults: Story = {
    name: 'No Results',
    args: {
        reason: 'no-results',
    },
};

export const NoRatedNearby: Story = {
    name: 'No Rated Nearby',
    args: {
        reason: 'no-rated-nearby',
    },
};

export const AllReasons: Story = {
    name: 'All Reasons (stacked)',
    render: () => (
        <View style={{ gap: 8 }}>
            <FallbackBanner reason="sparse-category" />
            <FallbackBanner reason="no-results" />
            <FallbackBanner reason="no-rated-nearby" />
        </View>
    ),
};
