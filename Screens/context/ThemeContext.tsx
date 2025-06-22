// src/context/ThemeContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { ActivityIndicator, Appearance, useColorScheme, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Define the shape of our theme colors
export interface ThemeColors {
  textPrimary: any;
  secondary: any;
  placeholder: any;
  link: any;
  error: any;
  background: string;
  cardBackground: string;
  text: string;
  secondaryText: string;
  placeholderText: string;
  borderColor: string;
  shadowColor: string;
  primary: string; // Accent color
  filterButtonBackground: string;
  activeFilterBackground: string;
  activeFilterText: string;
  // Add more colors as needed
}

// Define the light and dark theme color palettes
const lightColors: ThemeColors = {
  background: '#f0f2f5',
  cardBackground: '#ffffff',
  secondary: '#03DAC6',
  text: '#333333',
  secondaryText: '#666666',
  placeholderText: '#888888',
  borderColor: '#e0e0e0',
  shadowColor: '#000000',
  primary: '#6200EE', // Purple accent
  filterButtonBackground: '#e0e0e0',
  activeFilterBackground: '#6200EE',
  activeFilterText: '#ffffff',
  textPrimary: '#333333',
  link: undefined,
  error: undefined,
  placeholder: undefined
};

const darkColors: ThemeColors = {
  background: '#121212', // Very dark background
  cardBackground: '#1e1e1e', // Slightly lighter dark for cards
  secondary: '#03DAC6',
  text: '#e0e0e0', // Light text on dark background
  secondaryText: '#a0a0a0',
  placeholderText: '#777777',
  borderColor: '#333333',
  shadowColor: '#000000', // Still black for shadows, but with lower opacity
  primary: '#BB86FC', // Lighter purple accent for dark mode
  filterButtonBackground: '#2a2a2a',
  activeFilterBackground: '#BB86FC',
  activeFilterText: '#121212',
  textPrimary: '#E0E0E0',
  link: undefined,
  error: undefined,
  placeholder: undefined
};

// Define the context type
interface ThemeContextType {
  theme: 'light' | 'dark';
  colors: ThemeColors;
  toggleTheme: () => void;
  isThemeLoading: boolean; // New state to indicate if theme is still loading from storage
}

// Create the context
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Define the key for AsyncStorage
const THEME_STORAGE_KEY = '@app_theme_preference';

// Create the ThemeProvider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme(); // 'light' or 'dark' or null
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null); // Initialize as null to indicate loading
  const [isThemeLoading, setIsThemeLoading] = useState(true); // Track loading state

  // Effect to load theme from AsyncStorage when component mounts
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme === 'light' || storedTheme === 'dark') {
          setTheme(storedTheme);
        } else {
          // If no stored theme, use system preference or default to 'light'
          setTheme(systemColorScheme || 'light');
        }
      } catch (e) {
        console.error("Failed to load theme from AsyncStorage:", e);
        // Fallback to system preference or default if loading fails
        setTheme(systemColorScheme || 'light');
      } finally {
        setIsThemeLoading(false);
      }
    };

    loadTheme();
  }, [systemColorScheme]); // Re-run if systemColorScheme changes (though less common after initial load)

  // Effect to save theme to AsyncStorage when theme changes
  useEffect(() => {
    if (theme !== null && !isThemeLoading) { // Only save once loaded and not during initial load
      const saveTheme = async () => {
        try {
          await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch (e) {
          console.error("Failed to save theme to AsyncStorage:", e);
        }
      };
      saveTheme();
    }
  }, [theme, isThemeLoading]);

  // Listener for system theme changes (primarily for native apps)
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme) {
        // Only update if the user hasn't manually overridden the theme,
        // or if you want system changes to always override.
        // For simplicity, we'll let system changes update the state,
        // which then triggers a save to AsyncStorage.
        setTheme(colorScheme);
      }
    });
    return () => subscription.remove();
  }, []); // Empty dependency array means this listener only runs once on mount

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      // No need to save here, as the useEffect will handle it
      return newTheme;
    });
  }, []);

  // Provide default colors while theme is loading to prevent flickering
  const colors = theme === 'light' ? lightColors : darkColors;

  if (isThemeLoading) {
    // You might want a splash screen or a simple loading indicator here
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: lightColors.background }}>
        <ActivityIndicator size="large" color={lightColors.primary} />
        <Text style={{ marginTop: 10, color: lightColors.text }}>Loading theme...</Text>
      </View>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme: theme!, colors, toggleTheme, isThemeLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};