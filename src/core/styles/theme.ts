import { TextStyle } from 'react-native';

import { getSize } from '../utils/responsive';

export type Size =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl'
  | 'xxxl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | 'auto';

export const spacing = {
  /** 2px */
  xs: getSize(2),
  /** 4px */
  sm: getSize(4),
  /** 8px */
  md: getSize(8),
  /** 12px */
  lg: getSize(12),
  /** 16px */
  xl: getSize(16),
  /** 20px */
  xxl: getSize(20),
  /** 24px */
  xxxl: getSize(24),
  /** 32px */
  '4xl': getSize(32),
  /** 40px */
  '5xl': getSize(40),
  /** 48px */
  '6xl': getSize(48),
  /** 72px */
  '7xl': getSize(72),
  /** auto */
  auto: 'auto',
};

export const fontSizes = {
  /** 2px */
  xs: getSize(2),
  /** 10px */
  sm: getSize(10),
  /** 12px */
  md: getSize(12),
  /** 14px */
  lg: getSize(14),
  /** 16px */
  xl: getSize(16),
  /** 20px */
  xxl: getSize(20),
  /** 24px */
  xxxl: getSize(24),
};

export const rounded = {
  /** 1px */
  xs: 1,
  /** 2px */
  sm: 2,
  /** 4px */
  md: 4,
  /** 6px */
  lg: 6,
  /** 8px */
  xl: 8,
  /** 16px */
  xxl: 16,
  /** 20px */
  xxxl: 20,
  /** 24px */
  '4xl': 24,
  /** 32px */
  '5xl': 32,
  /** 40px */
  '6xl': 40,
};

export const shadow = {
  sm: {
    shadowColor: '#555',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 4,
  },
};

export const colors = {
  /** #1245FF */
  mainBlue: '#1245FF',
  /** #F6FBFF */
  background: '#F6FBFF',
  /** #14276B */
  secondaryBlue: '#14276B',
  /** #14276B */
  text: '#14276B',
  /** #62A9EE */
  accent: '#62A9EE',
  /** #C7E2F8 */
  accent2: '#C7E2F8',
  /** #ffffff */
  white: '#ffffff',
  /** #000 */
  black: '#000',
  /** #1C1B1F */
  darkest: '#1C1B1F',
  /** #333333 */
  darker: '#333333',
  /** #666666 */
  dark: '#666666',
  /** #999999 */
  light: '#999999',
  /** #DDDDDD */
  lighter: '#DDDDDD',
  /** #EDEDED */
  lightest: '#EDEDED',
  /** #F2F2F2 */
  lightest2: '#F2F2F2',
  /** #008000 */
  positiveAction: '#008000',
  /** #FF0000 */
  negativeAction: '#FF0000',
  /** #DCEAFA */
  lightestBlue: '#DCEAFA',
  /** transparent */
  transparent: 'transparent',
};

export type ThemeColor = keyof typeof colors;

export const fonts = {
  /** Poppins-Light, 300 */
  light: {
    fontFamily: 'Poppins-Light',
    fontWeight: '300' as TextStyle['fontWeight'],
  },
  /** Poppins-Regular, 400 */
  regular: {
    fontFamily: 'Poppins-Regular',
    fontWeight: '400' as TextStyle['fontWeight'],
  },
  /** Poppins-Medium, 500 */
  medium: {
    fontFamily: 'Poppins-Medium',
    fontWeight: '500' as TextStyle['fontWeight'],
  },
  /** Poppins-SemiBold, 600 */
  semiBold: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600' as TextStyle['fontWeight'],
  },
  /** Poppins-Bold, 700 */
  bold: {
    fontFamily: 'Poppins-Bold',
    fontWeight: '700' as TextStyle['fontWeight'],
  },
};

export const typography = {
  title1: {
    color: colors.text,
    fontSize: fontSizes.xxxl,
    lineHeight: 36,
    ...fonts.medium,
  },
  title1Bolder: {
    color: colors.text,
    fontSize: fontSizes.xxxl,
    lineHeight: 36,
    ...fonts.semiBold,
  },
  title2: {
    color: colors.text,
    fontSize: fontSizes.xxl,
    lineHeight: 30,
    ...fonts.medium,
  },
  title2Bolder: {
    color: colors.text,
    fontSize: fontSizes.xxl,
    lineHeight: 30,
    ...fonts.semiBold,
  },
  title3: {
    color: colors.text,
    fontSize: fontSizes.xl,
    lineHeight: 24,
    ...fonts.regular,
  },
  title3Bolder: {
    color: colors.text,
    fontSize: fontSizes.xl,
    lineHeight: 24,
    ...fonts.semiBold,
  },
  description1: {
    color: colors.dark,
    fontSize: fontSizes.lg,
    lineHeight: 21,
    ...fonts.regular,
  },
  description1Bolder: {
    color: colors.dark,
    fontSize: fontSizes.lg,
    lineHeight: 21,
    ...fonts.semiBold,
  },
  description2: {
    color: colors.dark,
    fontSize: fontSizes.md,
    lineHeight: 18,
    ...fonts.regular,
  },
  description2Bolder: {
    color: colors.dark,
    fontSize: fontSizes.md,
    lineHeight: 18,
    ...fonts.semiBold,
  },
  description3: {
    color: colors.dark,
    fontSize: fontSizes.sm,
    lineHeight: 15,
    ...fonts.regular,
  },
  description3Bolder: {
    color: colors.dark,
    fontSize: fontSizes.sm,
    lineHeight: 15,
    ...fonts.semiBold,
  },
  paragraph: {
    color: colors.darker,
    fontSize: fontSizes.xl,
    lineHeight: 24,
    ...fonts.regular,
  },
  chatBubbles: {
    color: colors.darker,
    fontSize: fontSizes.xl,
    lineHeight: 19,
    ...fonts.regular,
  },
};

export const gradientColors = [colors.white, colors.lightestBlue];
