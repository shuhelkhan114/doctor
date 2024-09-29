import React, { forwardRef, useMemo } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

import { colors, rounded, Size } from '@core/styles/theme';
import { getSize } from '@core/utils/responsive';
import useAppTheme from '@hooks/useTheme';

export interface BlockProps extends ViewProps {
  mH?: Size;
  mV?: Size;
  mT?: Size | number;
  mR?: Size;
  mB?: Size;
  mL?: Size;
  pH?: Size;
  pV?: Size;
  pT?: Size | number;
  pR?: Size;
  pB?: Size | number;
  pL?: Size;
  /** Border Width */
  bW?: number;
  /** Border Top Width */
  bTW?: number;
  /** Border Right Width */
  bRW?: number;
  /** Border Bottom Width */
  bBW?: number;
  /** Border Left Width */
  bLW?: number;
  bC?: keyof typeof colors;
  shadow?: 'sm';
  rounded?: keyof typeof rounded;
  flexDirection?: ViewStyle['flexDirection'];
  justify?: ViewStyle['justifyContent'];
  align?: ViewStyle['alignItems'];
  bgColor?: keyof typeof colors;
  flex1?: boolean;
  absolute?: boolean;
  opacity?: ViewStyle['opacity'];
  relative?: boolean;
  top?: ViewStyle['top'];
  right?: ViewStyle['right'];
  bottom?: ViewStyle['bottom'];
  left?: ViewStyle['left'];
  zIndex?: ViewStyle['zIndex'];
  maxWidth?: ViewStyle['maxWidth'];
  minHeight?: ViewStyle['minHeight'];
  width?: ViewStyle['width'];
  height?: ViewStyle['height'];
  style?: ViewStyle;
  wrap?: boolean;
  overflow?: ViewStyle['overflow'];
  onPress?: (event: GestureResponderEvent) => void;
  children?: React.ReactNode;
}

const Block: React.FC<BlockProps> = forwardRef((props, ref: any) => {
  const {
    children,
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
    bW,
    bTW,
    bRW,
    bBW,
    bLW,
    bC,
    shadow,
    rounded,
    flexDirection,
    justify,
    align,
    bgColor,
    style,
    flex1,
    absolute,
    relative,
    top,
    right,
    bottom,
    left,
    zIndex,
    maxWidth,
    width,
    minHeight,
    height,
    wrap,
    overflow,
    opacity,
    onPress,
    ...restProps
  } = props;
  const theme = useAppTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          ...(mH && { marginHorizontal: theme.spacing[mH] }),
          ...(mV && { marginVertical: theme.spacing[mV] }),
          ...(mT && { marginTop: typeof mT === 'string' ? theme.spacing[mT] : mT }),
          ...(mR && { marginRight: theme.spacing[mR] }),
          ...(mB && { marginBottom: theme.spacing[mB] }),
          ...(mL && { marginLeft: theme.spacing[mL] }),
          ...(pH && { paddingHorizontal: theme.spacing[pH] }),
          ...(pV && { paddingVertical: theme.spacing[pV] }),
          ...(pT && { paddingTop: typeof pT === 'string' ? theme.spacing[pT] : pT }),
          ...(pR && { paddingRight: theme.spacing[pR] }),
          ...(pB && { paddingBottom: typeof pB === 'string' ? theme.spacing[pB] : pB }),
          ...(pL && { paddingLeft: theme.spacing[pL] }),
          ...(bW && { borderWidth: bW }),
          ...(bTW && { borderTopWidth: bTW }),
          ...(bRW && { borderRightWidth: bRW }),
          ...(bBW && { borderBottomWidth: bBW }),
          ...(bLW && { borderLeftWidth: bLW }),
          ...(bC && { borderColor: theme.colors[bC] }),
          ...(shadow && theme.shadow[shadow]),
          ...(rounded && { borderRadius: theme.rounded[rounded] }),
          ...(flexDirection && { flexDirection }),
          ...(justify && { justifyContent: justify }),
          ...(align && { alignItems: align }),
          ...(bgColor && { backgroundColor: theme.colors[bgColor] }),
          ...(flex1 && { flex: 1 }),
          ...(absolute && { position: 'absolute' }),
          ...(relative && { position: 'relative' }),
          ...(top !== undefined && { top: typeof top === 'number' ? getSize(top) : top }),
          ...(right !== undefined && { right: typeof right === 'number' ? getSize(right) : right }),
          ...(bottom !== undefined && {
            bottom: typeof bottom === 'number' ? getSize(bottom) : bottom,
          }),
          ...(left !== undefined && { left: typeof left === 'number' ? getSize(left) : left }),
          ...(zIndex && { zIndex }),
          ...(maxWidth && { maxWidth }),
          ...(width && { width: typeof width === 'number' ? getSize(width) : width }),
          ...(height && { height: typeof height === 'number' ? getSize(height) : height }),
          ...(minHeight && { minHeight }),
          ...(overflow && { overflow }),
          ...(wrap && { flexWrap: 'wrap' }),
          ...(opacity && { opacity }),
          ...style,
        },
      }),
    [
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
      bW,
      bTW,
      bRW,
      bBW,
      bLW,
      bC,
      shadow,
      rounded,
      flexDirection,
      justify,
      align,
      bgColor,
      flex1,
      absolute,
      relative,
      top,
      right,
      bottom,
      left,
      maxWidth,
      width,
      height,
      zIndex,
      wrap,
      minHeight,
      style,
      overflow,
      opacity,
    ]
  );

  if (onPress && typeof onPress === 'function') {
    return (
      <Pressable
        onPress={onPress}
        ref={ref}
        style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, styles.container]}
        {...restProps}>
        {children}
      </Pressable>
    );
  }

  return (
    <View ref={ref} style={styles.container} {...restProps}>
      {children}
    </View>
  );
});

export default Block;
