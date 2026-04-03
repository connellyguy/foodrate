import type { Meta, StoryObj } from '@storybook/react-native';

import ScoreDisplay from './ScoreDisplay';

const meta: Meta<typeof ScoreDisplay> = {
    title: 'ScoreDisplay',
    component: ScoreDisplay,
    argTypes: {
        size: {
            control: { type: 'select' },
            options: ['sm', 'md', 'lg'],
        },
        showLabel: {
            control: { type: 'boolean' },
        },
    },
};

export default meta;

type Story = StoryObj<typeof ScoreDisplay>;

export const HighScoreSm: Story = {
    name: 'High Score — sm',
    args: {
        score: 80,
        size: 'sm',
        ratingCount: 124,
    },
};

export const HighScoreMd: Story = {
    name: 'High Score — md',
    args: {
        score: 80,
        size: 'md',
        ratingCount: 124,
    },
};

export const HighScoreLg: Story = {
    name: 'High Score — lg',
    args: {
        score: 80,
        size: 'lg',
        ratingCount: 124,
    },
};

export const MidScore: Story = {
    name: 'Mid Score (55)',
    args: {
        score: 10,
        size: 'md',
        ratingCount: 47,
    },
};

export const LowScore: Story = {
    name: 'Low Score (25)',
    args: {
        score: -50,
        size: 'md',
        ratingCount: 18,
    },
};

export const NewItem: Story = {
    name: 'New (< 3 ratings)',
    args: {
        score: 60,
        size: 'md',
        ratingCount: 2,
    },
};

export const WithRatingCount: Story = {
    name: 'With Rating Count',
    args: {
        score: 40,
        size: 'md',
        ratingCount: 42,
    },
};

export const WithLabel: Story = {
    name: 'With Label',
    args: {
        score: 80,
        size: 'md',
        showLabel: true,
        ratingCount: 89,
    },
};
