import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import type { Meta, StoryObj } from '@storybook/react-native';

import theme, {
    palette,
    sentimentColor,
    sentimentBackgroundColor,
    sentimentMeta,
} from '@/src/constants/theme';
import type { SentimentValue } from '@/src/constants/theme';

const colors = theme.light.colors;
const { typography, spacing, radii, shadows } = theme;

// ============================================================
// Section Components
// ============================================================

function SectionHeader({ title }: { title: string }) {
    return <Text style={styles.sectionHeader}>{title}</Text>;
}

function SubHeader({ title }: { title: string }) {
    return <Text style={styles.subHeader}>{title}</Text>;
}

function ColorSwatch({ name, hex }: { name: string; hex: string }) {
    const isDark = hex.replace('#', '').match(/.{2}/g)
        ?.reduce((sum, c) => sum + parseInt(c, 16), 0) ?? 765;
    const textColor = isDark < 384 ? palette.white : palette.neutrals900;

    return (
        <View style={styles.swatchContainer}>
            <View style={[styles.swatch, { backgroundColor: hex }]}>
                <Text style={[styles.swatchLabel, { color: textColor }]}>{name}</Text>
            </View>
            <Text style={styles.swatchHex}>{hex}</Text>
        </View>
    );
}

function ColorRow({ title, swatches }: { title: string; swatches: { name: string; hex: string }[] }) {
    return (
        <View style={styles.colorRow}>
            <SubHeader title={title} />
            <View style={styles.swatchGrid}>
                {swatches.map((s) => (
                    <ColorSwatch key={s.name} name={s.name} hex={s.hex} />
                ))}
            </View>
        </View>
    );
}

function ColorsSection() {
    const orangeSwatches = [
        { name: 'orange50', hex: palette.orange50 },
        { name: 'orange100', hex: palette.orange100 },
        { name: 'orange200', hex: palette.orange200 },
        { name: 'orange300', hex: palette.orange300 },
        { name: 'orange400', hex: palette.orange400 },
        { name: 'orange500', hex: palette.orange500 },
        { name: 'orange600', hex: palette.orange600 },
        { name: 'orange700', hex: palette.orange700 },
        { name: 'orange800', hex: palette.orange800 },
        { name: 'orange900', hex: palette.orange900 },
    ];

    const sentimentSwatches = [
        { name: 'loved', hex: colors.loved },
        { name: 'lovedBg', hex: colors.lovedBackground },
        { name: 'liked', hex: colors.liked },
        { name: 'likedBg', hex: colors.likedBackground },
        { name: 'disliked', hex: colors.disliked },
        { name: 'dislikedBg', hex: colors.dislikedBackground },
        { name: 'hated', hex: colors.hated },
        { name: 'hatedBg', hex: colors.hatedBackground },
    ];

    const neutralSwatches = [
        { name: 'neutrals50', hex: palette.neutrals50 },
        { name: 'neutrals100', hex: palette.neutrals100 },
        { name: 'neutrals200', hex: palette.neutrals200 },
        { name: 'neutrals300', hex: palette.neutrals300 },
        { name: 'neutrals400', hex: palette.neutrals400 },
        { name: 'neutrals500', hex: palette.neutrals500 },
        { name: 'neutrals600', hex: palette.neutrals600 },
        { name: 'neutrals700', hex: palette.neutrals700 },
        { name: 'neutrals800', hex: palette.neutrals800 },
        { name: 'neutrals900', hex: palette.neutrals900 },
    ];

    const secondarySwatches = [
        { name: 'tawny50', hex: palette.tawny50 },
        { name: 'tawny100', hex: palette.tawny100 },
        { name: 'tawny200', hex: palette.tawny200 },
        { name: 'tawny300', hex: palette.tawny300 },
        { name: 'tawny400', hex: palette.tawny400 },
        { name: 'tawny500', hex: palette.tawny500 },
        { name: 'tawny600', hex: palette.tawny600 },
        { name: 'tawny700', hex: palette.tawny700 },
        { name: 'tawny800', hex: palette.tawny800 },
        { name: 'tawny900', hex: palette.tawny900 },
    ];

    const accentSwatches = [
        { name: 'slate50', hex: palette.slate50 },
        { name: 'slate100', hex: palette.slate100 },
        { name: 'slate200', hex: palette.slate200 },
        { name: 'slate300', hex: palette.slate300 },
        { name: 'slate400', hex: palette.slate400 },
        { name: 'slate500', hex: palette.slate500 },
        { name: 'slate600', hex: palette.slate600 },
        { name: 'slate700', hex: palette.slate700 },
        { name: 'slate800', hex: palette.slate800 },
        { name: 'slate900', hex: palette.slate900 },
    ];

    const semanticSwatches = [
        { name: 'error', hex: colors.error },
        { name: 'errorBg', hex: colors.errorBackground },
        { name: 'success', hex: colors.success },
        { name: 'successBg', hex: colors.successBackground },
        { name: 'warning', hex: colors.warning },
        { name: 'warningBg', hex: colors.warningBackground },
    ];

    return (
        <View style={styles.section}>
            <SectionHeader title="Colors" />
            <ColorRow title="Brand (Orange)" swatches={orangeSwatches} />
            <ColorRow title="Secondary (Brown-Gold)" swatches={secondarySwatches} />
            <ColorRow title="Accent (Slate Blue)" swatches={accentSwatches} />
            <ColorRow title="Sentiment" swatches={sentimentSwatches} />
            <ColorRow title="Neutrals" swatches={neutralSwatches} />
            <ColorRow title="Semantic" swatches={semanticSwatches} />
        </View>
    );
}

function TypographySection() {
    type TypoKey = keyof typeof typography;
    type TypoValue = typeof typography[TypoKey];
    const levels = Object.entries(typography) as [TypoKey, TypoValue][];

    return (
        <View style={styles.section}>
            <SectionHeader title="Typography" />
            {levels.map(([name, style]) => (
                <View key={name} style={styles.typographyRow}>
                    <Text style={[styles.typographySample, style]}>
                        {name}
                    </Text>
                    <Text style={styles.typographyMeta}>
                        {style.fontSize}/{style.lineHeight} &middot; weight {style.fontWeight}
                    </Text>
                </View>
            ))}
        </View>
    );
}

function SpacingSection() {
    const entries = Object.entries(spacing) as [string, number][];

    return (
        <View style={styles.section}>
            <SectionHeader title="Spacing" />
            <View style={styles.spacingList}>
                {entries.map(([name, value]) => (
                    <View key={name} style={styles.spacingRow}>
                        <View style={styles.spacingLabelContainer}>
                            <Text style={styles.spacingLabel}>{name}</Text>
                            <Text style={styles.spacingValue}>{value}dp</Text>
                        </View>
                        <View
                            style={[
                                styles.spacingBox,
                                { width: value, height: value },
                            ]}
                        />
                    </View>
                ))}
            </View>
        </View>
    );
}

function BorderRadiiSection() {
    const entries = Object.entries(radii) as [string, number][];

    return (
        <View style={styles.section}>
            <SectionHeader title="Border Radii" />
            <View style={styles.radiiGrid}>
                {entries.map(([name, value]) => (
                    <View key={name} style={styles.radiiItem}>
                        <View style={[styles.radiiBox, { borderRadius: value }]} />
                        <Text style={styles.radiiLabel}>{name}</Text>
                        <Text style={styles.radiiValue}>{value}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

function ShadowsSection() {
    const entries = Object.entries(shadows) as [string, Record<string, unknown>][];

    return (
        <View style={styles.section}>
            <SectionHeader title="Shadows" />
            <View style={styles.shadowGrid}>
                {entries.map(([name, shadowStyle]) => (
                    <View key={name} style={[styles.shadowCard, shadowStyle]}>
                        <Text style={styles.shadowLabel}>{name}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

function SentimentMetaSection() {
    const sentimentValues: SentimentValue[] = [2, 1, -1, -2];

    return (
        <View style={styles.section}>
            <SectionHeader title="Sentiment Meta" />
            {sentimentValues.map((value) => {
                const meta = sentimentMeta[value];
                const fg = sentimentColor(value, colors);
                const bg = sentimentBackgroundColor(value, colors);

                return (
                    <View key={value} style={[styles.sentimentCard, { backgroundColor: bg }]}>
                        <View style={styles.sentimentHeader}>
                            <View style={[styles.sentimentDot, { backgroundColor: fg }]} />
                            <Text style={[styles.sentimentLabel, { color: fg }]}>
                                {meta.label}
                            </Text>
                            <Text style={styles.sentimentValue}>({value})</Text>
                        </View>
                        <Text style={styles.sentimentDescription}>{meta.description}</Text>
                        <View style={styles.sentimentColors}>
                            <Text style={styles.sentimentColorText}>fg: {fg}</Text>
                            <Text style={styles.sentimentColorText}>bg: {bg}</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
}

// ============================================================
// Main Render
// ============================================================

function ThemeReference() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>OakRate Design Tokens</Text>
            <Text style={styles.subtitle}>Light theme (default)</Text>
            <ColorsSection />
            <TypographySection />
            <SpacingSection />
            <BorderRadiiSection />
            <ShadowsSection />
            <SentimentMetaSection />
        </ScrollView>
    );
}

// ============================================================
// Story
// ============================================================

const meta = {
    title: 'Design Tokens/Theme Reference',
    component: ThemeReference,
} satisfies Meta<typeof ThemeReference>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// ============================================================
// Styles
// ============================================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.lg,
        paddingBottom: spacing['6xl'],
    },
    title: {
        ...typography.display,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
        marginBottom: spacing['3xl'],
    },
    section: {
        marginBottom: spacing['3xl'],
    },
    sectionHeader: {
        ...typography.h2,
        color: colors.textPrimary,
        marginBottom: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
        paddingBottom: spacing.sm,
    },
    subHeader: {
        ...typography.h3,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    colorRow: {
        marginBottom: spacing.xl,
    },
    swatchGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    swatchContainer: {
        alignItems: 'center',
        width: 80,
    },
    swatch: {
        width: 80,
        height: 48,
        borderRadius: radii.md,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    swatchLabel: {
        ...typography.caption,
        fontWeight: '600',
    },
    swatchHex: {
        ...typography.caption,
        color: colors.textTertiary,
        marginTop: spacing.xxs,
    },
    typographyRow: {
        marginBottom: spacing.lg,
    },
    typographySample: {
        color: colors.textPrimary,
    },
    typographyMeta: {
        ...typography.caption,
        color: colors.textTertiary,
        marginTop: spacing.xxs,
    },
    spacingList: {
        gap: spacing.md,
    },
    spacingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    spacingLabelContainer: {
        width: 80,
    },
    spacingLabel: {
        ...typography.label,
        color: colors.textPrimary,
    },
    spacingValue: {
        ...typography.caption,
        color: colors.textTertiary,
    },
    spacingBox: {
        backgroundColor: colors.primary,
        borderRadius: radii.sm,
        minWidth: 2,
        minHeight: 2,
    },
    radiiGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.lg,
    },
    radiiItem: {
        alignItems: 'center',
    },
    radiiBox: {
        width: 64,
        height: 64,
        backgroundColor: colors.primary,
    },
    radiiLabel: {
        ...typography.label,
        color: colors.textPrimary,
        marginTop: spacing.sm,
    },
    radiiValue: {
        ...typography.caption,
        color: colors.textTertiary,
    },
    shadowGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.lg,
    },
    shadowCard: {
        width: 120,
        height: 80,
        backgroundColor: colors.surfaceElevated,
        borderRadius: radii.lg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shadowLabel: {
        ...typography.label,
        color: colors.textPrimary,
    },
    sentimentCard: {
        padding: spacing.lg,
        borderRadius: radii.lg,
        marginBottom: spacing.md,
    },
    sentimentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.xs,
    },
    sentimentDot: {
        width: 12,
        height: 12,
        borderRadius: radii.full,
    },
    sentimentLabel: {
        ...typography.h3,
    },
    sentimentValue: {
        ...typography.bodySmall,
        color: colors.textTertiary,
    },
    sentimentDescription: {
        ...typography.body,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    sentimentColors: {
        flexDirection: 'row',
        gap: spacing.lg,
    },
    sentimentColorText: {
        ...typography.caption,
        color: colors.textTertiary,
        fontFamily: 'monospace',
    },
});
