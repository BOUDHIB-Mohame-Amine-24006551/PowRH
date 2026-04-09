import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

import { TechnicianProvider } from '@/context/TechnicianContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <TechnicianProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Accueil' }} />
          <Stack.Screen name="new-technician" options={{ title: 'Nouveau Technicien', headerBackTitle: 'Retour' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </TechnicianProvider>
  );
}
