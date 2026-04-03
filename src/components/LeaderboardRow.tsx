import { Pressable, StyleSheet, Text, View } from 'react-native';

import theme from '@/src/constants/theme';
import useThemeColors from '@/src/hooks/useThemeColors';
import DistanceBadge from '@/src/components/DistanceBadge';
import ScoreDisplay, { toDisplayScore } from '@/src/components/ScoreDisplay';
import TagChip from '@/src/components/TagChip';

type Tag = {
    id: string;
    label: string;
};

type LeaderboardRowProps = {
    rank: number;
    itemName: string;
    restaurantName: string;
    score: number;
    ratingCount: number;
    tags?: Tag[];
    distanceMiles?: number | null;
    onPress: () => void;
};

const RANK_COLUMN_WIDTH = 44;
const TOP_RANK_THRESHOLD = 3;
const MAX_TAGS = 3;

export default function LeaderboardRow({
    rank,
    itemName,
    restaurantName,
    score,
    ratingCount,
    tags = [],
    distanceMiles = null,
    onPress,
}: LeaderboardRowProps) {
    const colors = useThemeColors();
    const isTopRank = rank <= TOP_RANK_THRESHOLD;
    const displayScore = toDisplayScore(score);
    const visibleTags = tags.slice(0, MAX_TAGS);

    const accessibilityLabel = [
        `Number ${rank}`,
        `${itemName} at ${restaurantName}`,
        `OakRank score ${displayScore}`,
        `${ratingCount} ${ratingCount === 1 ? 'rating' : 'ratings'}`,
    ].join(', ');

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.row,
                { backgroundColor: pressed ? colors.surface : colors.background },
            ]}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
        >
            <View style={styles.rankColumn}>
                <Text
                    style={[
                        styles.rankText,
                        { color: isTopRank ? colors.primary : colors.textTertiary },
                        isTopRank && styles.rankTextTop,
                    ]}
                >
                    {rank}
                </Text>
            </View>

            <View style={styles.content}>
                <Text
                    style={[styles.itemName, { color: colors.textPrimary }]}
                    numberOfLines={1}
                >
                    {itemName}
                </Text>
                <Text
                    style={[styles.restaurantName, { color: colors.textSecondary }]}
                    numberOfLines={1}
                >
                    {restaurantName}
                </Text>
                {visibleTags.length > 0 && (
                    <View style={styles.tagsRow}>
                        {visibleTags.map((tag) => (
                            <TagChip key={tag.id} label={tag.label} size="sm" />
                        ))}
                    </View>
                )}
            </View>

            <View style={styles.rightColumn}>
                <ScoreDisplay score={score} size="sm" ratingCount={ratingCount} />
                <DistanceBadge distanceMiles={distanceMiles ?? null} />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
        paddingRight: theme.spacing.lg,
        minHeight: 64,
    },
    rankColumn: {
        width: RANK_COLUMN_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rankText: {
        fontSize: theme.typography.body.fontSize,
        lineHeight: theme.typography.body.lineHeight,
        fontWeight: '600',
    },
    rankTextTop: {
        fontSize: theme.typography.h3.fontSize,
        lineHeight: theme.typography.h3.lineHeight,
        fontWeight: '700',
    },
    content: {
        flex: 1,
        gap: theme.spacing.xxs,
    },
    itemName: {
        fontSize: theme.typography.body.fontSize,
        lineHeight: theme.typography.body.lineHeight,
        fontWeight: '600',
    },
    restaurantName: {
        fontSize: theme.typography.bodySmall.fontSize,
        lineHeight: theme.typography.bodySmall.lineHeight,
        fontWeight: theme.typography.bodySmall.fontWeight,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.xs,
        marginTop: theme.spacing.xxs,
    },
    rightColumn: {
        alignItems: 'flex-end',
        marginLeft: theme.spacing.md,
        gap: theme.spacing.xs,
    },
});
