import { useState } from 'react';
import { View, useColorScheme } from 'react-native';

import type { Meta, StoryObj } from '@storybook/react-native';

import SentimentInput from './SentimentInput';
import theme from '@/src/constants/theme';
import type { SentimentValue } from '@/src/constants/theme';

function StoryWrapper({ initialValue = null }: { initialValue?: SentimentValue | null }) {
    const [value, setValue] = useState<SentimentValue | null>(initialValue);
    const colorScheme = useColorScheme();
    const colors = theme[colorScheme === 'dark' ? 'dark' : 'light'].colors;

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 16, backgroundColor: colors.background }}>
            <SentimentInput value={value} onChange={setValue} />
        </View>
    );
}

const meta: Meta<typeof SentimentInput> = {
    title: 'SentimentInput',
    component: SentimentInput,
};

export default meta;

type Story = StoryObj<typeof SentimentInput>;

export const Default: Story = {
    render: () => <StoryWrapper />,
};

export const HatedIt: Story = {
    render: () => <StoryWrapper initialValue={-2} />,
};

export const DidntLikeIt: Story = {
    render: () => <StoryWrapper initialValue={-1} />,
};

export const LikedIt: Story = {
    render: () => <StoryWrapper initialValue={1} />,
};

export const LovedIt: Story = {
    render: () => <StoryWrapper initialValue={2} />,
};

export const DarkMode: Story = {
    render: () => <StoryWrapper />,
    parameters: {
        backgrounds: { default: 'dark' },
    },
};
