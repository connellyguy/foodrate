import type { Meta, StoryObj } from '@storybook/react-native';

import DistanceBadge from './DistanceBadge';

const meta: Meta<typeof DistanceBadge> = {
    title: 'DistanceBadge',
    component: DistanceBadge,
};

export default meta;

type Story = StoryObj<typeof DistanceBadge>;

export const Close: Story = {
    name: 'Close (Nearby)',
    args: {
        distanceMiles: 0.05,
    },
};

export const Medium: Story = {
    name: 'Medium (2.3 mi)',
    args: {
        distanceMiles: 2.3,
    },
};

export const Far: Story = {
    name: 'Far (16 mi)',
    args: {
        distanceMiles: 15.7,
    },
};

export const Null: Story = {
    name: 'Null (renders nothing)',
    args: {
        distanceMiles: null,
    },
};
