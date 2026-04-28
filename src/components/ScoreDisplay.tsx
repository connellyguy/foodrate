import { StyleSheet, Text, View } from 'react-native';

import theme from '@/src/constants/theme';
import type { ColorSet } from '@/src/constants/theme';
import useThemeColors from '@/src/hooks/useThemeColors';

type ScoreDisplaySize = 'sm' | 'md' | 'lg';

type ScoreDisplayProps = {
    score: number;
    size?: ScoreDisplaySize;
    showLabel?: boolean;
    ratingCount?: number;
};

const MIN_RATINGS_THRESHOLD = 3;

export function toDisplayScore(raw: number): number {
    return Math.round((raw + 100) / 2);
}

function getScoreColor(displayScore: number, colors: ColorSet): string {
    if (displayScore >= 80) return colors.loved;
    if (displayScore >= 60) return colors.liked;
    if (displayScore >= 40) return colors.disliked;
    return colors.hated;
}

function buildAccessibilityLabel(
    displayScore: number,
    isNew: boolean,
    ratingCount?: number,
): string {
    if (isNew) {
        return 'OakRate score not yet available, new item';
    }

    const base = `OakRate score ${displayScore} out of 100`;
    if (ratingCount !== undefined) {
        return `${base}, based on ${ratingCount} ${ratingCount === 1 ? 'rating' : 'ratings'}`;
    }
    return base;
}

export default function ScoreDisplay({
    score,
    size = 'md',
    showLabel = false,
    ratingCount,
}: ScoreDisplayProps) {
    const colors = useThemeColors();
    const displayScore = toDisplayScore(score);
    const isNew = ratingCount !== undefined && ratingCount < MIN_RATINGS_THRESHOLD;

    const scoreColor = isNew ? colors.textTertiary : getScoreColor(displayScore, colors);
    const scoreText = isNew ? 'New' : String(displayScore);

    const sizeStyles = scoreSizeStyles[size];

    return (
        <View
            style={styles.container}
            accessibilityLabel={buildAccessibilityLabel(displayScore, isNew, ratingCount)}
            accessibilityRole="text"
        >
            <View style={styles.scoreRow}>
                <Text
                    style={[
                        sizeStyles.score,
                        { color: scoreColor },
                    ]}
                >
                    {scoreText}
                </Text>
                {ratingCount !== undefined && (
                    <Text style={[sizeStyles.ratingCount, { color: colors.textSecondary }]}>
                        ({ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'})
                    </Text>
                )}
            </View>
            {showLabel && (
                <Text style={[sizeStyles.label, { color: colors.textTertiary }]}>
                    OakRate Score
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: theme.spacing.xs,
    },
});

const scoreSizeStyles = {
    sm: StyleSheet.create({
        score: {
            fontSize: theme.typography.body.fontSize,
            lineHeight: theme.typography.body.lineHeight,
            fontWeight: '700',
        },
        ratingCount: {
            fontSize: theme.typography.caption.fontSize,
            lineHeight: theme.typography.caption.lineHeight,
            fontWeight: theme.typography.caption.fontWeight,
        },
        label: {
            fontSize: theme.typography.caption.fontSize,
            lineHeight: theme.typography.caption.lineHeight,
            fontWeight: theme.typography.caption.fontWeight,
            marginTop: theme.spacing.xxs,
        },
    }),
    md: StyleSheet.create({
        score: {
            fontSize: theme.typography.h2.fontSize,
            lineHeight: theme.typography.h2.lineHeight,
            fontWeight: '700',
        },
        ratingCount: {
            fontSize: theme.typography.bodySmall.fontSize,
            lineHeight: theme.typography.bodySmall.lineHeight,
            fontWeight: theme.typography.bodySmall.fontWeight,
        },
        label: {
            fontSize: theme.typography.bodySmall.fontSize,
            lineHeight: theme.typography.bodySmall.lineHeight,
            fontWeight: theme.typography.bodySmall.fontWeight,
            marginTop: theme.spacing.xxs,
        },
    }),
    lg: StyleSheet.create({
        score: {
            fontSize: theme.typography.display.fontSize,
            lineHeight: theme.typography.display.lineHeight,
            fontWeight: '700',
            letterSpacing: theme.typography.display.letterSpacing,
        },
        ratingCount: {
            fontSize: theme.typography.body.fontSize,
            lineHeight: theme.typography.body.lineHeight,
            fontWeight: theme.typography.body.fontWeight,
        },
        label: {
            fontSize: theme.typography.body.fontSize,
            lineHeight: theme.typography.body.lineHeight,
            fontWeight: theme.typography.body.fontWeight,
            marginTop: theme.spacing.xs,
        },
    }),
} as const;
