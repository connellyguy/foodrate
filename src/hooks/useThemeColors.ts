import { useColorScheme } from 'react-native';

import theme from '@/src/constants/theme';
import type { ColorSet } from '@/src/constants/theme';

const colorSchemeOverride = process.env.EXPO_PUBLIC_COLOR_SCHEME as 'light' | 'dark' | undefined;

export default function useThemeColors(): ColorSet {
    const systemScheme = useColorScheme();
    const colorScheme = colorSchemeOverride ?? (systemScheme === 'dark' ? 'dark' : 'light');
    return theme[colorScheme].colors;
}
