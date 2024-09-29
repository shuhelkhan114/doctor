import { useContext } from 'react';

import { ThemeContext } from '@context/ThemeContext';

const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      'ThemeContext not found, Make sure to wrap your root component (App.tsx) with ThemeContextProvider.'
    );
  }
  return context;
};

export default useAppTheme;
