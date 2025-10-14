import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  accent1: string;
  accent2: string;
  accent3: string;
}

interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

interface ThemeShadows {
  small: object;
  medium: object;
  large: object;
}

interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  shadows: ThemeShadows;
  borderRadius: {
    small: number;
    medium: number;
    large: number;
    pill: number;
  };
}

const lightTheme: Theme = {
  colors: {
    primary: '#8AA17D',      // Sage green
    background: '#FFFFFF',
    card: '#F8F8F8',
    text: '#2C2C2C',
    textSecondary: '#6B6B6B',
    border: '#E5E5E5',
    error: '#FF6B6B',
    success: '#69B578',
    accent1: '#E8B4B8',     // Soft pink
    accent2: '#EED6C4',     // Beige
    accent3: '#6B4423',     // Brown
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    },
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    pill: 999,
  },
};

const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    primary: '#8AA17D',      // Keep sage green
    background: '#1A1A1A',
    card: '#2C2C2C',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#404040',
    error: '#FF6B6B',
    success: '#69B578',
    accent1: '#C79498',     // Darker soft pink
    accent2: '#C4A68C',     // Darker beige
    accent3: '#8B6142',     // Lighter brown
  },
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDark(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 