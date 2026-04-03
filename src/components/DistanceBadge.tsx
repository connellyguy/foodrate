import { StyleSheet, Text, View } from 'react-native';

import theme from '@/src/constants/theme';
import useThemeColors from '@/src/hooks/useThemeColors';

type DistanceBadgeProps = {
    distanceMiles: number | null;
};

function formatDistance(miles: number): string {
    if (miles < 0.1) return 'Nearby';
    if (miles < 10) return `${miles.toFixed(1)} mi`;
    return `${Math.round(miles)} mi`;
}

function buildAccessibilityLabel(miles: number): string {
    if (miles < 0.1) return 'Nearby';
    return `${formatDistance(miles)} away`;
}

export default function DistanceBadge({ distanceMiles }: DistanceBadgeProps) {
    const colors = useThemeColors();

    if (distanceMiles === null) return null;

    return (
        <View
            style={[styles.pill, {
                backgroundColor: colors.surface,
                borderColor: colors.textTertiary,
            }]}
            accessibilityLabel={buildAccessibilityLabel(distanceMiles)}
            accessibilityRole="text"
        >
            <Text style={[styles.text, { color: colors.textSecondary }]}>
                {formatDistance(distanceMiles)}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    pill: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xxs,
        borderRadius: theme.radii.full,
        borderWidth: StyleSheet.hairlineWidth,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: theme.typography.caption.fontSize,
        lineHeight: theme.typography.caption.lineHeight,
        fontWeight: theme.typography.caption.fontWeight,
        letterSpacing: theme.typography.caption.letterSpacing,
    },
});
