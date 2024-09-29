import { Size } from '@core/styles/theme';
import useAppTheme from '@hooks/useTheme';
import React, { forwardRef, useMemo } from 'react';
import {
  ScrollView as NativeScrollView,
  ScrollViewProps as NativeScrollViewProps,
  RefreshControl,
  StyleSheet,
  ViewStyle,
} from 'react-native';

interface ScrollViewProps extends NativeScrollViewProps {
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
  width?: ViewStyle['width'];
  height?: ViewStyle['height'];
  refreshing?: boolean;
  onRefresh?: () => void;
}

const ScrollView: React.FC<ScrollViewProps> = forwardRef((props, ref: any) => {
  const {
    children,
    refreshing = false,
    onRefresh,
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
    width,
    height,
    contentContainerStyle,
    ...restProps
  } = props;

  const theme = useAppTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
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
          ...(width && { width }),
          ...(height && { height }),
        },
      }),
    [mH, mV, mT, mR, mB, mL, pH, pV, pT, pR, pB, pL, width, height]
  );

  const refreshControl = <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />;

  return (
    <NativeScrollView
      ref={ref}
      {...(onRefresh && { refreshControl })}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, contentContainerStyle]}
      {...restProps}>
      {children}
    </NativeScrollView>
  );
});

export default ScrollView;
