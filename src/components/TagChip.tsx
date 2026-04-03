import { Pressable, StyleSheet, Text, View } from 'react-native';

import theme from '@/src/constants/theme';
import useThemeColors from '@/src/hooks/useThemeColors';

type TagChipSize = 'sm' | 'md';

type TagChipProps = {
    label: string;
    selected?: boolean;
    disabled?: boolean;
    onPress?: () => void;
    size?: TagChipSize;
};

const DISABLED_OPACITY = 0.4;

export default function TagChip({
    label,
    selected = false,
    disabled = false,
    onPress,
    size = 'md',
}: TagChipProps) {
    const colors = useThemeColors();
    const isInteractive = onPress !== undefined;

    const containerStyle = [
        styles.base,
        sizeStyles[size].container,
        isInteractive
            ? selected
                ? { backgroundColor: colors.primary, borderColor: colors.primary }
                : { backgroundColor: 'transparent', borderColor: colors.border }
            : { backgroundColor: colors.surface, borderColor: 'transparent' },
    ];

    const textStyle = [
        sizeStyles[size].text,
        {
            color: isInteractive
                ? selected
                    ? colors.textInverse
                    : colors.textSecondary
                : colors.textTertiary,
        },
    ];

    if (!isInteractive) {
        return (
            <View
                style={containerStyle}
                accessibilityLabel={label}
                accessibilityRole="text"
            >
                <Text style={textStyle}>{label}</Text>
            </View>
        );
    }

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={[containerStyle, disabled && { opacity: DISABLED_OPACITY }]}
            accessibilityLabel={label}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: selected, disabled }}
            hitSlop={size === 'sm' ? { top: 6, bottom: 6 } : undefined}
        >
            <Text style={textStyle}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: theme.radii.full,
        borderWidth: 1,
        alignSelf: 'flex-start',
    },
});

const sizeStyles = {
    sm: StyleSheet.create({
        container: {
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.xs,
            minHeight: 28,
        },
        text: {
            fontSize: theme.typography.caption.fontSize,
            lineHeight: theme.typography.caption.lineHeight,
            fontWeight: theme.typography.caption.fontWeight,
            letterSpacing: theme.typography.caption.letterSpacing,
        },
    }),
    md: StyleSheet.create({
        container: {
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            minHeight: 36,
        },
        text: {
            fontSize: theme.typography.label.fontSize,
            lineHeight: theme.typography.label.lineHeight,
            fontWeight: theme.typography.label.fontWeight,
            letterSpacing: theme.typography.label.letterSpacing,
        },
    }),
} as const;
