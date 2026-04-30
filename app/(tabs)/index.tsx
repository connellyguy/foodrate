import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import theme from '@/src/constants/theme';
import useThemeColors from '@/src/hooks/useThemeColors';

const DEV_CATEGORIES = ['pizza', 'wings', 'tacos', 'ramen', 'sushi', 'ice-cream', 'bbq'] as const;

export default function HomeScreen() {
    const colors = useThemeColors();

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.content}
        >
            <Text style={[styles.title, { color: colors.textPrimary }]}>Explore</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Discover top-rated dishes nearby
            </Text>

            <Text style={[styles.devLabel, { color: colors.textTertiary }]}>
                Dev: Open category
            </Text>
            <View style={[styles.devList, { borderColor: colors.border }]}>
                {DEV_CATEGORIES.map((slug, index) => (
                    <Pressable
                        key={slug}
                        onPress={() => router.push(`/category/${slug}`)}
                        accessibilityRole="button"
                        accessibilityLabel={`Open ${slug} leaderboard`}
                        style={({ pressed }) => [
                            styles.devRow,
                            index > 0 && {
                                borderTopColor: colors.divider,
                                borderTopWidth: StyleSheet.hairlineWidth,
                            },
                            { backgroundColor: pressed ? colors.surface : colors.background },
                        ]}
                    >
                        <Text style={[styles.devRowText, { color: colors.textPrimary }]}>{slug}</Text>
                    </Pressable>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: theme.spacing.xl,
        gap: theme.spacing.md,
    },
    title: {
        fontSize: theme.typography.h1.fontSize,
        lineHeight: theme.typography.h1.lineHeight,
        fontWeight: theme.typography.h1.fontWeight,
        letterSpacing: theme.typography.h1.letterSpacing,
    },
    subtitle: {
        fontSize: theme.typography.body.fontSize,
        lineHeight: theme.typography.body.lineHeight,
    },
    devLabel: {
        marginTop: theme.spacing.xl,
        fontSize: theme.typography.label.fontSize,
        lineHeight: theme.typography.label.lineHeight,
        fontWeight: theme.typography.label.fontWeight,
        letterSpacing: theme.typography.label.letterSpacing,
        textTransform: 'uppercase',
    },
    devList: {
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: theme.radii.md,
        overflow: 'hidden',
    },
    devRow: {
        minHeight: 48,
        paddingHorizontal: theme.spacing.lg,
        justifyContent: 'center',
    },
    devRowText: {
        fontSize: theme.typography.body.fontSize,
        lineHeight: theme.typography.body.lineHeight,
        fontWeight: '500',
    },
});
