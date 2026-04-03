import type { Meta, StoryObj } from '@storybook/react-native';

import TagChip from './TagChip';

const meta: Meta<typeof TagChip> = {
    title: 'TagChip',
    component: TagChip,
    argTypes: {
        size: {
            control: { type: 'select' },
            options: ['sm', 'md'],
        },
        selected: {
            control: { type: 'boolean' },
        },
        disabled: {
            control: { type: 'boolean' },
        },
    },
};

export default meta;

type Story = StoryObj<typeof TagChip>;

export const DisplayOnlySm: Story = {
    name: 'Display Only — sm',
    args: {
        label: 'Crispy',
        size: 'sm',
    },
};

export const DisplayOnlyMd: Story = {
    name: 'Display Only — md',
    args: {
        label: 'Crispy',
        size: 'md',
    },
};

export const UnselectedInteractive: Story = {
    name: 'Unselected Interactive',
    args: {
        label: 'Crispy',
        selected: false,
        onPress: () => {},
    },
};

export const SelectedInteractive: Story = {
    name: 'Selected Interactive',
    args: {
        label: 'Crispy',
        selected: true,
        onPress: () => {},
    },
};

export const Disabled: Story = {
    name: 'Disabled',
    args: {
        label: 'Crispy',
        selected: false,
        disabled: true,
        onPress: () => {},
    },
};

export const LongLabel: Story = {
    name: 'Long Label',
    args: {
        label: 'Perfectly seasoned with just the right amount of spice',
        onPress: () => {},
    },
};
