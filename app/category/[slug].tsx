import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';

import theme from '@/src/constants/theme';
import useThemeColors from '@/src/hooks/useThemeColors';
import FallbackBanner from '@/src/components/FallbackBanner';
import LeaderboardRow from '@/src/components/LeaderboardRow';
import { useLeaderboard, type LeaderboardItem } from '@/src/queries/useLeaderboard';

export default function CategoryScreen() {
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const colors = useThemeColors();
    const { data, isLoading, isError, refetch } = useLeaderboard(slug);

    const [isRefreshing, setIsRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        refetch();
        setIsRefreshing(false);
    }, [refetch]);

    const refreshControl = (
        <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.textTertiary}
        />
    );

    function renderItem({ item, index }: { item: LeaderboardItem; index: number }) {
        return (
            <LeaderboardRow
                rank={index + 1}
                itemName={item.name}
                restaurantName={item.restaurant_name}
                score={item.oakrate_score}
                ratingCount={item.rating_count}
                onPress={() => router.push(`/item/${item.id}`)}
            />
        );
    }

    function ItemSeparator() {
        return <View style={[styles.separator, { backgroundColor: colors.divider }]} />;
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ title: slug ?? 'Category' }} />

            {isLoading && (
                <View style={styles.centered}>
                    <Text style={[styles.message, { color: colors.textSecondary }]}>Loading…</Text>
                </View>
            )}

            {isError && !isLoading && (
                <View style={styles.centered}>
                    <Text style={[styles.message, { color: colors.textSecondary }]}>
                        Couldn&apos;t load this category. Pull to refresh.
                    </Text>
                </View>
            )}

            {!isLoading && !isError && data && (
                <>
                    {data.source === 'fallback' && data.fallbackReason && (
                        <FallbackBanner reason={data.fallbackReason} />
                    )}
                    {data.items.length === 0 ? (
                        <View style={styles.centered}>
                            <Text style={[styles.message, { color: colors.textSecondary }]}>
                                Nothing to show here yet.
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={data.items}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            ItemSeparatorComponent={ItemSeparator}
                            refreshControl={refreshControl}
                            contentContainerStyle={styles.list}
                        />
                    )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.xl,
    },
    message: {
        fontSize: theme.typography.body.fontSize,
        lineHeight: theme.typography.body.lineHeight,
        textAlign: 'center',
    },
    list: {
        paddingVertical: theme.spacing.sm,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        marginLeft: theme.spacing.lg,
    },
});
