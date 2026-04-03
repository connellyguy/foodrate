import type { Meta, StoryObj } from '@storybook/react-native';

import SentimentDistribution from './SentimentDistribution';

const meta: Meta<typeof SentimentDistribution> = {
    title: 'SentimentDistribution',
    component: SentimentDistribution,
};

export default meta;

type Story = StoryObj<typeof SentimentDistribution>;

export const SkewedPositive: Story = {
    args: {
        distribution: { loved: 80, liked: 15, disliked: 3, hated: 2 },
        totalCount: 100,
    },
};

export const EvenSplit: Story = {
    args: {
        distribution: { loved: 25, liked: 25, disliked: 25, hated: 25 },
        totalCount: 100,
    },
};

export const SkewedNegative: Story = {
    args: {
        distribution: { loved: 2, liked: 5, disliked: 18, hated: 75 },
        totalCount: 100,
    },
};

export const SingleRating: Story = {
    args: {
        distribution: { loved: 1, liked: 0, disliked: 0, hated: 0 },
        totalCount: 1,
    },
};

export const HighVolume: Story = {
    args: {
        distribution: { loved: 612, liked: 289, disliked: 74, hated: 25 },
        totalCount: 1000,
    },
};

export const LowVolume: Story = {
    args: {
        distribution: { loved: 2, liked: 1, disliked: 0, hated: 0 },
        totalCount: 3,
    },
};
