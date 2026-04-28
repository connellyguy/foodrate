// OakRate Design Tokens
// Consumed via StyleSheet.create — all values are density-independent pixels (no CSS units).

// ============================================================
// COLORS
// ============================================================

const palette = {
    // Brand — burnt orange
    orange50: '#FFF3E6',
    orange100: '#FFD9B3',
    orange200: '#FFBF80',
    orange300: '#FFA54D',
    orange400: '#FF8C1A',
    orange500: '#CC6A00',
    orange600: '#A85500',
    orange700: '#854300',
    orange800: '#613100',
    orange900: '#3D1F00',

    // Sentiment
    lovedGreen: '#146132',
    lovedGreenLight: '#E8F5EC',
    likedTeal: '#307A5E',
    likedTealLight: '#EAF5F0',
    dislikedAmber: '#956100',
    dislikedAmberLight: '#FDF3E1',
    hatedRed: '#B83230',
    hatedRedLight: '#FDEAEA',

    // Neutrals (warm)
    white: '#FFFFFF',
    neutrals50: '#FAFAF8',
    neutrals100: '#F5F4F2',
    neutrals200: '#E8E6E3',
    neutrals300: '#D5D3CF',
    neutrals400: '#A09D98',
    neutrals450: '#908D87',
    neutrals500: '#73706B',
    neutrals600: '#524F4A',
    neutrals700: '#3D3A35',
    neutrals800: '#262421',
    neutrals900: '#1A1816',
    black: '#000000',

    // Secondary — warm brown-gold
    tawny50: '#FBF6E8',
    tawny100: '#F5ECD4',
    tawny200: '#E8D5A3',
    tawny300: '#D4B86A',
    tawny400: '#B8932E',
    tawny500: '#8B6914',
    tawny600: '#725610',
    tawny700: '#5C4610',
    tawny800: '#3D2E0A',
    tawny900: '#261D06',

    // Accent — slate blue
    slate50: '#EEF3F7',
    slate100: '#E1EAF1',
    slate200: '#C3D4E3',
    slate300: '#9AB5CE',
    slate400: '#7093B3',
    slate500: '#4A6B8A',
    slate600: '#3D5972',
    slate700: '#33495F',
    slate800: '#243342',
    slate900: '#172029',

    // Semantic
    errorRed: '#DC2626',
    errorRedLight: '#FEF2F2',
    successGreen: '#16A34A',
    successGreenLight: '#F0FDF4',
    warningYellow: '#CA8A04',
    warningYellowLight: '#FEFCE8',
} as const;

const lightColors = {
    // Brand
    primary: palette.orange600,
    primaryLight: palette.orange100,
    primaryDark: palette.orange700,
    secondary: palette.tawny500,
    secondaryLight: palette.tawny100,
    secondaryDark: palette.tawny700,
    accent: palette.slate500,
    accentLight: palette.slate100,
    accentDark: palette.slate700,

    // Sentiment
    loved: palette.lovedGreen,
    lovedBackground: palette.lovedGreenLight,
    liked: palette.likedTeal,
    likedBackground: palette.likedTealLight,
    disliked: palette.dislikedAmber,
    dislikedBackground: palette.dislikedAmberLight,
    hated: palette.hatedRed,
    hatedBackground: palette.hatedRedLight,

    // Surfaces
    background: palette.white,
    surface: palette.neutrals50,
    surfaceElevated: palette.white,

    // Text
    textPrimary: palette.neutrals900,
    textSecondary: palette.neutrals600,
    textTertiary: palette.neutrals500,
    textInverse: palette.white,

    // Borders
    border: palette.neutrals200,
    borderFocused: palette.orange500,
    divider: palette.neutrals100,

    // Semantic
    error: palette.errorRed,
    errorBackground: palette.errorRedLight,
    success: palette.successGreen,
    successBackground: palette.successGreenLight,
    warning: palette.warningYellow,
    warningBackground: palette.warningYellowLight,
} as const;

const darkColors = {
    // Brand
    primary: palette.orange400,
    primaryLight: palette.orange800,
    primaryDark: palette.orange200,
    secondary: '#C49A2A',
    secondaryLight: '#2A2410',
    secondaryDark: '#E8BF5A',
    accent: '#7BA3C9',
    accentLight: '#1A2530',
    accentDark: '#A8C8E8',

    // Sentiment
    loved: '#4ADE80',
    lovedBackground: '#14291E',
    liked: '#6DD5A8',
    likedBackground: '#142620',
    disliked: '#FBBF24',
    dislikedBackground: '#2A2110',
    hated: '#F87171',
    hatedBackground: '#2A1414',

    // Surfaces
    background: palette.neutrals900,
    surface: palette.neutrals800,
    surfaceElevated: '#343230',

    // Text
    textPrimary: palette.neutrals50,
    textSecondary: palette.neutrals400,
    textTertiary: palette.neutrals450,
    textInverse: palette.neutrals900,

    // Borders
    border: palette.neutrals700,
    borderFocused: palette.orange400,
    divider: palette.neutrals800,

    // Semantic
    error: '#F87171',
    errorBackground: '#2A1414',
    success: '#4ADE80',
    successBackground: '#14291E',
    warning: '#FBBF24',
    warningBackground: '#2A2110',
} as const;

// ============================================================
// TYPOGRAPHY
// ============================================================

const typography = {
    display: {
        fontSize: 32,
        lineHeight: 40,
        fontWeight: '700' as const,
        letterSpacing: -0.5,
    },
    h1: {
        fontSize: 28,
        lineHeight: 36,
        fontWeight: '700' as const,
        letterSpacing: -0.3,
    },
    h2: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: '600' as const,
        letterSpacing: -0.2,
    },
    h3: {
        fontSize: 20,
        lineHeight: 28,
        fontWeight: '600' as const,
        letterSpacing: 0,
    },
    body: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400' as const,
        letterSpacing: 0,
    },
    bodySmall: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '400' as const,
        letterSpacing: 0,
    },
    caption: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '400' as const,
        letterSpacing: 0.2,
    },
    label: {
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '500' as const,
        letterSpacing: 0.1,
    },
} as const;

// ============================================================
// SPACING (4pt grid)
// ============================================================

const spacing = {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    '6xl': 64,
} as const;

// ============================================================
// BORDER RADII
// ============================================================

const radii = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
} as const;

// ============================================================
// SHADOWS (platform-specific)
// ============================================================

import { Platform } from 'react-native';

const shadows = {
    sm: Platform.select({
        ios: {
            shadowColor: palette.black,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
        },
        android: { elevation: 1 },
        default: {},
    })!,
    md: Platform.select({
        ios: {
            shadowColor: palette.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
        },
        android: { elevation: 3 },
        default: {},
    })!,
    lg: Platform.select({
        ios: {
            shadowColor: palette.black,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 8,
        },
        android: { elevation: 6 },
        default: {},
    })!,
} as const;

// ============================================================
// SENTIMENT HELPERS
// ============================================================

const sentimentMeta = {
    2: { label: 'Loved it', description: "I'd come back here for this dish" },
    1: { label: 'Liked it', description: "I'd order again" },
    '-1': { label: "Didn't like it", description: "Wouldn't order again, but might suit your taste" },
    '-2': { label: 'Hated it', description: 'Nobody should order this' },
} as const;

type SentimentValue = 2 | 1 | -1 | -2;
type ColorSet = typeof lightColors | typeof darkColors;

function sentimentColor(value: SentimentValue, colors: ColorSet) {
    const map = {
        2: colors.loved,
        1: colors.liked,
        '-1': colors.disliked,
        '-2': colors.hated,
    } as const;
    return map[value];
}

function sentimentBackgroundColor(value: SentimentValue, colors: ColorSet) {
    const map = {
        2: colors.lovedBackground,
        1: colors.likedBackground,
        '-1': colors.dislikedBackground,
        '-2': colors.hatedBackground,
    } as const;
    return map[value];
}

// ============================================================
// THEME EXPORT
// ============================================================

const theme = {
    light: { colors: lightColors },
    dark: { colors: darkColors },
    typography,
    spacing,
    radii,
    shadows,
    sentimentMeta,
    sentimentColor,
    sentimentBackgroundColor,
} as const;

export { palette, sentimentMeta, sentimentColor, sentimentBackgroundColor };
export type { ColorSet, SentimentValue };
export default theme;
