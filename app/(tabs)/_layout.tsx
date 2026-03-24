import React from 'react';
import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme].tint,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Browse',
                    tabBarIcon: ({ color }) => (
                        <SymbolView
                            name={{ ios: 'fork.knife', android: 'restaurant', web: 'restaurant' }}
                            tintColor={color}
                            size={28}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => (
                        <SymbolView
                            name={{ ios: 'person.fill', android: 'person', web: 'person' }}
                            tintColor={color}
                            size={28}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="rate"
                options={{
                    title: 'Rate',
                    tabBarIcon: ({ color }) => (
                        <SymbolView
                            name={{ ios: 'plus.circle.fill', android: 'add_circle', web: 'add_circle' }}
                            tintColor={color}
                            size={28}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color }) => (
                        <SymbolView
                            name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
                            tintColor={color}
                            size={28}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
