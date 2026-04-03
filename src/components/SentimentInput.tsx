import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { Frown, Heart, Smile, ThumbsDown } from 'lucide-react-native';

import theme, {
    sentimentBackgroundColor,
    sentimentColor,
    sentimentMeta,
} from '@/src/constants/theme';
import type { ColorSet, SentimentValue } from '@/src/constants/theme';
import useThemeColors from '@/src/hooks/useThemeColors';

const SENTIMENTS: SentimentValue[] = [-2, -1, 1, 2];

const SENTIMENT_ICONS = {
    '-2': ThumbsDown,
    '-1': Frown,
    1: Smile,
    2: Heart,
} as const;

type SentimentInputProps = {
    value?: SentimentValue | null;
    onChange: (value: SentimentValue | null) => void;
};

type SentimentButtonProps = {
    sentiment: SentimentValue;
    isSelected: boolean;
    onPress: (value: SentimentValue) => void;
    colors: ColorSet;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function SentimentButton({ sentiment, isSelected, onPress, colors }: SentimentButtonProps) {
    const scale = useSharedValue(1);
    const meta = sentimentMeta[sentiment];
    const Icon = SENTIMENT_ICONS[sentiment];
    const color = sentimentColor(sentiment, colors);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePress = useCallback(() => {
        scale.value = withSequence(
            withTiming(1.08, { duration: 100 }),
            withTiming(1, { duration: 100 }),
        );
        onPress(sentiment);
    }, [onPress, sentiment, scale]);

    const iconColor = isSelected ? colors.textInverse : colors.textTertiary;
    const textColor = isSelected ? colors.textInverse : colors.textSecondary;

    return (
        <AnimatedPressable
            style={[
                styles.button,
                {
                    borderColor: isSelected ? color : colors.border,
                    backgroundColor: isSelected ? color : 'transparent',
                },
                animatedStyle,
            ]}
            onPress={handlePress}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected }}
            accessibilityLabel={`${meta.label} \u2014 ${meta.description}`}
        >
            <Icon color={iconColor} size={22} />
            <Text
                style={[
                    styles.buttonLabel,
                    { color: textColor },
                ]}
                numberOfLines={1}
            >
                {meta.label}
            </Text>
        </AnimatedPressable>
    );
}

export default function SentimentInput({ value = null, onChange }: SentimentInputProps) {
    const colors = useThemeColors();

    const handlePress = useCallback((sentiment: SentimentValue) => {
        onChange(value === sentiment ? null : sentiment);
    }, [value, onChange]);

    const selectedMeta = value !== null ? sentimentMeta[value] : null;
    const selectedColor = value !== null ? sentimentColor(value, colors) : undefined;
    const selectedBg = value !== null ? sentimentBackgroundColor(value, colors) : undefined;

    return (
        <View
            accessibilityRole="radiogroup"
            accessibilityLabel="How was this dish?"
        >
            <View style={styles.row}>
                {SENTIMENTS.map((sentiment) => (
                    <SentimentButton
                        key={sentiment}
                        sentiment={sentiment}
                        isSelected={value === sentiment}
                        onPress={handlePress}
                        colors={colors}
                    />
                ))}
            </View>
            {selectedMeta && (
                <View
                    style={[
                        styles.descriptionContainer,
                        { backgroundColor: selectedBg },
                    ]}
                >
                    <Text
                        style={[
                            styles.descriptionText,
                            { color: selectedColor },
                        ]}
                    >
                        {selectedMeta.description}
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    button: {
        flex: 1,
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.xs,
        borderWidth: 1.5,
        borderRadius: theme.radii.lg,
        gap: theme.spacing.xs,
    },
    buttonLabel: {
        ...theme.typography.label,
        textAlign: 'center',
    },
    descriptionContainer: {
        marginTop: theme.spacing.sm,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.radii.md,
    },
    descriptionText: {
        ...theme.typography.bodySmall,
        textAlign: 'center',
    },
});
