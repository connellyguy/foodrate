import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme as lightTheme, darkTheme } from '@storybook/react-native-theming';
import { view } from './storybook.requires';

const colorScheme = process.env.EXPO_PUBLIC_COLOR_SCHEME as 'light' | 'dark' | undefined;
const sbTheme = colorScheme === 'dark' ? darkTheme : lightTheme;

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
  theme: sbTheme,
});

export default StorybookUIRoot;
