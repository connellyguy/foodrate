import { StyleSheet, Text, View } from 'react-native';

import theme from '@/src/constants/theme';
import useThemeColors from '@/src/hooks/useThemeColors';

type SentimentBucket = 'loved' | 'liked' | 'disliked' | 'hated';

type SentimentDistributionProps = {
    distribution: { loved: number; liked: number; disliked: number; hated: number };
    totalCount: number;
};

const buckets: { key: SentimentBucket; label: string }[] = [
    { key: 'loved', label: 'Loved it' },
    { key: 'liked', label: 'Liked it' },
    { key: 'disliked', label: "Didn't like it" },
    { key: 'hated', label: 'Hated it' },
];

export default function SentimentDistribution({ distribution, totalCount }: SentimentDistributionProps) {
    const colors = useThemeColors();

    return (
        <View accessibilityLabel="Sentiment breakdown" style={styles.container}>
            {buckets.map(({ key, label }) => {
                const count = distribution[key];
                const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;

                return (
                    <View
                        key={key}
                        accessibilityLabel={`${label}: ${count} ratings, ${percentage} percent`}
                        style={styles.row}
                    >
                        <Text
                            style={[
                                styles.label,
                                { color: colors.textSecondary },
                            ]}
                            numberOfLines={1}
                        >
                            {label}
                        </Text>
                        <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
                            <View
                                style={[
                                    styles.barFill,
                                    {
                                        backgroundColor: colors[key],
                                        width: `${percentage}%`,
                                    },
                                ]}
                            />
                        </View>
                        <Text
                            style={[
                                styles.stat,
                                { color: colors.textPrimary },
                            ]}
                            numberOfLines={1}
                        >
                            {percentage}% ({count})
                        </Text>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: theme.spacing.sm,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    label: {
        width: 88,
        ...theme.typography.bodySmall,
    },
    barTrack: {
        flex: 1,
        height: 10,
        borderRadius: theme.radii.full,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: theme.radii.full,
        minWidth: 0,
    },
    stat: {
        width: 72,
        textAlign: 'right',
        ...theme.typography.caption,
    },
});
