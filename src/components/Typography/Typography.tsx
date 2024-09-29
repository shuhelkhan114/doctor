import { Size, colors } from '@core/styles/theme';
import useAppTheme from '@hooks/useTheme';
import React, { ReactNode, useMemo } from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';

export interface TypographyProps extends TextProps {
  mH?: Size;
  mV?: Size;
  mT?: Size;
  mR?: Size;
  mB?: Size;
  mL?: Size;
  pH?: Size;
  pV?: Size;
  pT?: Size;
  pR?: Size;
  pB?: Size;
  pL?: Size;
  flex1?: boolean;
  variation?:
    | 'title1'
    | 'title1Bolder'
    | 'title2'
    | 'title2Bolder'
    | 'title3'
    | 'title3Bolder'
    | 'description1'
    | 'description1Bolder'
    | 'description2'
    | 'description2Bolder'
    | 'description3'
    | 'description3Bolder'
    | 'paragraph'
    | 'chatBubbles';
  center?: boolean;
  uppercase?: boolean;
  letterSpacing?: number;
  maxWidth?: TextStyle['maxWidth'];
  style?: TextStyle;
  color?: keyof typeof colors;
  children?: ReactNode;
}

const Typography: React.FC<TypographyProps> = (props) => {
  const {
    mH,
    mV,
    mT,
    mR,
    mB,
    mL,
    pH,
    pV,
    pT,
    pR,
    pB,
    pL,
    flex1,
    maxWidth,
    children,
    variation = 'description1',
    center,
    letterSpacing,
    uppercase,
    style,
    color = 'text',
    ...restProps
  } = props;
  const theme = useAppTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        default: {
          ...theme.typography[variation],
          color: theme.colors[color],
          ...(mH && { marginHorizontal: theme.spacing[mH] }),
          ...(mV && { marginVertical: theme.spacing[mV] }),
          ...(mT && { marginTop: theme.spacing[mT] }),
          ...(mR && { marginRight: theme.spacing[mR] }),
          ...(mB && { marginBottom: theme.spacing[mB] }),
          ...(mL && { marginLeft: theme.spacing[mL] }),
          ...(pH && { paddingHorizontal: theme.spacing[pH] }),
          ...(pV && { paddingVertical: theme.spacing[pV] }),
          ...(pT && { paddingTop: theme.spacing[pT] }),
          ...(pR && { paddingRight: theme.spacing[pR] }),
          ...(pB && { paddingBottom: theme.spacing[pB] }),
          ...(pL && { paddingLeft: theme.spacing[pL] }),
          ...(flex1 && { flex: 1 }),
          ...(center && { textAlign: 'center' }),
          ...(maxWidth && { maxWidth }),
          ...(letterSpacing && { letterSpacing }),
          ...(uppercase && { textTransform: 'uppercase' }),
          ...style,
        },
      }),
    [
      theme,
      center,
      style,
      color,
      mH,
      mV,
      mT,
      mR,
      mB,
      mL,
      pH,
      pV,
      pT,
      pR,
      pB,
      pL,
      flex1,
      variation,
      letterSpacing,
      maxWidth,
      uppercase,
    ]
  );

  return (
    <Text style={styles.default as TextStyle} {...restProps}>
      {children}
    </Text>
  );
};

export default Typography;
