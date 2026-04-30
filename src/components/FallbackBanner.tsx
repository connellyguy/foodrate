import { Info } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import theme from '@/src/constants/theme';
import useThemeColors from '@/src/hooks/useThemeColors';
import type { ListResult } from '@/src/lib/queries/types';

type FallbackReason = NonNullable<ListResult<unknown>['fallbackReason']>;

type FallbackBannerProps = {
    reason: FallbackReason;
};

const COPY: Record<FallbackReason, string> = {
    'sparse-category': 'This category is light here — also try these popular spots nearby.',
    'no-results': "No matches — here's what's trending nearby.",
    'no-rated-nearby': 'Nothing rated nearby yet — showing top-rated across Raleigh.',
};

export default function FallbackBanner({ reason }: FallbackBannerProps) {
    const colors = useThemeColors();
    const message = COPY[reason];

    return (
        <View
            style={[styles.container, { backgroundColor: colors.warningBackground }]}
            accessibilityRole="alert"
            accessibilityLabel={message}
        >
            <Info size={16} color={colors.textTertiary} />
            <Text style={[styles.text, { color: colors.textSecondary }]}>
                {message}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        gap: theme.spacing.sm,
    },
    text: {
        flex: 1,
        fontSize: theme.typography.bodySmall.fontSize,
        lineHeight: theme.typography.bodySmall.lineHeight,
        fontWeight: theme.typography.bodySmall.fontWeight,
        letterSpacing: theme.typography.bodySmall.letterSpacing,
    },
});
