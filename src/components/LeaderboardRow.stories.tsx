import { View } from 'react-native';

import type { Meta, StoryObj } from '@storybook/react-native';

import LeaderboardRow from './LeaderboardRow';

const meta: Meta<typeof LeaderboardRow> = {
    title: 'LeaderboardRow',
    component: LeaderboardRow,
    args: {
        onPress: () => {},
    },
};

export default meta;

type Story = StoryObj<typeof LeaderboardRow>;

export const TopRanked: Story = {
    name: '#1 — All Data',
    args: {
        rank: 1,
        itemName: 'Smoked Brisket Plate',
        restaurantName: 'Sam Jones BBQ',
        score: 85,
        ratingCount: 312,
        tags: [
            { id: '1', label: 'Tender' },
            { id: '2', label: 'Smoky' },
            { id: '3', label: 'Great Sides' },
        ],
        distanceMiles: 1.2,
    },
};

export const MidRanked: Story = {
    name: '#12 — Fewer Tags',
    args: {
        rank: 12,
        itemName: 'Fish Tacos',
        restaurantName: 'Cabo Fish Taco',
        score: 30,
        ratingCount: 47,
        tags: [
            { id: '1', label: 'Fresh' },
        ],
        distanceMiles: 3.4,
    },
};

export const WithDistance: Story = {
    name: 'With Distance',
    args: {
        rank: 5,
        itemName: 'Nashville Hot Chicken',
        restaurantName: "Beasley's Chicken + Honey",
        score: 60,
        ratingCount: 89,
        tags: [
            { id: '1', label: 'Spicy' },
            { id: '2', label: 'Crispy' },
        ],
        distanceMiles: 0.8,
    },
};

export const WithoutDistance: Story = {
    name: 'Without Distance',
    args: {
        rank: 3,
        itemName: 'Pork Belly Bao Buns',
        restaurantName: 'Brewery Bhavana',
        score: 70,
        ratingCount: 156,
        tags: [
            { id: '1', label: 'Rich' },
            { id: '2', label: 'Savory' },
        ],
        distanceMiles: null,
    },
};

export const WithTags: Story = {
    name: 'With Tags (3)',
    args: {
        rank: 2,
        itemName: 'Pepperoni Pizza',
        restaurantName: "Lilly's Pizza",
        score: 75,
        ratingCount: 204,
        tags: [
            { id: '1', label: 'Cheesy' },
            { id: '2', label: 'Wood-Fired' },
            { id: '3', label: 'Crispy Crust' },
        ],
        distanceMiles: 2.1,
    },
};

export const WithoutTags: Story = {
    name: 'Without Tags',
    args: {
        rank: 8,
        itemName: 'Chicken and Waffles',
        restaurantName: 'Bida Manda',
        score: 45,
        ratingCount: 33,
        tags: [],
        distanceMiles: 5.6,
    },
};

export const LongNames: Story = {
    name: 'Long Names (Truncation)',
    args: {
        rank: 14,
        itemName: 'Wood-Fired Margherita Pizza with Fresh Mozzarella and San Marzano Tomatoes',
        restaurantName: 'The Fiction Kitchen — A Vegetarian and Vegan Restaurant in Downtown Raleigh',
        score: 55,
        ratingCount: 67,
        tags: [
            { id: '1', label: 'Fresh Ingredients' },
            { id: '2', label: 'Wood-Fired' },
        ],
        distanceMiles: 0.3,
    },
};

export const MultipleRows: Story = {
    name: 'List (Visual Rhythm)',
    render: () => (
        <View>
            <LeaderboardRow
                rank={1}
                itemName="Smoked Brisket Plate"
                restaurantName="Sam Jones BBQ"
                score={85}
                ratingCount={312}
                tags={[
                    { id: '1', label: 'Tender' },
                    { id: '2', label: 'Smoky' },
                ]}
                distanceMiles={1.2}
                onPress={() => {}}
            />
            <LeaderboardRow
                rank={2}
                itemName="Pepperoni Pizza"
                restaurantName="Lilly's Pizza"
                score={75}
                ratingCount={204}
                tags={[
                    { id: '1', label: 'Cheesy' },
                    { id: '2', label: 'Wood-Fired' },
                ]}
                distanceMiles={2.1}
                onPress={() => {}}
            />
            <LeaderboardRow
                rank={3}
                itemName="Pork Belly Bao Buns"
                restaurantName="Brewery Bhavana"
                score={70}
                ratingCount={156}
                tags={[
                    { id: '1', label: 'Rich' },
                ]}
                distanceMiles={null}
                onPress={() => {}}
            />
            <LeaderboardRow
                rank={4}
                itemName="Nashville Hot Chicken"
                restaurantName="Beasley's Chicken + Honey"
                score={60}
                ratingCount={89}
                tags={[
                    { id: '1', label: 'Spicy' },
                    { id: '2', label: 'Crispy' },
                ]}
                distanceMiles={0.8}
                onPress={() => {}}
            />
            <LeaderboardRow
                rank={5}
                itemName="Fish Tacos"
                restaurantName="Cabo Fish Taco"
                score={30}
                ratingCount={47}
                tags={[]}
                distanceMiles={3.4}
                onPress={() => {}}
            />
        </View>
    ),
};
