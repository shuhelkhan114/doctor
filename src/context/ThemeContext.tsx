import React, { createContext, PropsWithChildren, useMemo } from 'react';

import { colors, fonts, rounded, shadow, spacing, typography } from '@core/styles/theme';

export const ThemeContext = createContext({
  colors,
  fonts,
  spacing,
  shadow,
  rounded,
  typography,
});

interface ThemeContextProviderProps extends PropsWithChildren {}

const ThemeContextProvider: React.FC<ThemeContextProviderProps> = (props) => {
  const { children } = props;
  const value = useMemo(
    () => ({
      colors,
      fonts,
      spacing,
      shadow,
      rounded,
      typography,
    }),
    []
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeContextProvider;
