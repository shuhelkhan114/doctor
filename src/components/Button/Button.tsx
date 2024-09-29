import { useMemo } from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  ImageStyle,
  Pressable,
  PressableProps,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { Size, colors } from '@core/styles/theme';
import { getSize } from '@core/utils/responsive';
import useAppTheme from '@hooks/useTheme';
import Icon, { iconsMap } from '../Icon/Icon';
import Typography from '../Typography/Typography';

interface Props extends PressableProps {
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variation?: 'primary' | 'primary-light' | 'secondary' | 'link';
  icon?: keyof typeof iconsMap;
  iconPosition?: 'left' | 'right';
  iconColor?: keyof typeof colors;
  iconStyle?: ImageStyle;
  loading?: boolean;
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
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
  bgColor?: keyof typeof colors;
}

const Button: React.FC<Props> = (props) => {
  const {
    title,
    variation = 'primary',
    style,
    onPress,
    icon,
    iconPosition = 'left',
    iconColor,
    iconStyle,
    loading,
    disabled,
    textStyle,
    bgColor,
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
    ...restProps
  } = props;
  const theme = useAppTheme();

  const backgroundColor = useMemo(() => {
    switch (variation) {
      case 'primary':
        return theme.colors.mainBlue;
      case 'primary-light':
        return theme.colors.lightest;
      case 'secondary':
        return theme.colors.white;
    }
  }, [variation]);

  const textColor = useMemo(() => {
    switch (variation) {
      case 'primary':
        return theme.colors.white;
      case 'primary-light':
        return theme.colors.secondaryBlue;
      case 'secondary':
        return theme.colors.text;
    }
  }, [variation]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor,
          borderRadius: 200,
          paddingVertical: getSize(18),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
          width: '100%',
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
          ...(bgColor && { backgroundColor: theme.colors[bgColor] }),
          ...(variation === 'secondary' && {
            borderWidth: 1,
            borderColor: theme.colors.lighter,
            paddingVertical: getSize(10),
          }),
          ...style,
        },
        text: {
          color: textColor,
          textAlign: 'center',
          ...theme.fonts.semiBold,
          ...(variation === 'link' && {
            color: theme.colors.negativeAction,
          }),
          ...(variation === 'secondary' && theme.fonts.regular),
          ...textStyle,
        },
      }),
    [
      textColor,
      backgroundColor,
      style,
      disabled,
      textStyle,
      bgColor,
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
    ]
  );

  const handlePress = (event: GestureResponderEvent) => {
    if (!disabled && !loading) onPress?.(event);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }, styles.container]}
      {...restProps}>
      {loading ? (
        <ActivityIndicator
          color={
            variation === 'secondary' || variation === 'link' || variation === 'primary-light'
              ? theme.colors.mainBlue
              : theme.colors.white
          }
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <View style={{ marginRight: 8 }}>
              <Icon size={24} name={icon} color={iconColor} style={iconStyle} />
            </View>
          )}
          <Typography variation="description1" style={styles.text}>
            {title}
          </Typography>
          {icon && iconPosition === 'right' && (
            <Icon size={24} name={icon} color={iconColor} style={{ marginLeft: 8, ...iconStyle }} />
          )}
        </>
      )}
    </Pressable>
  );
};

export default Button;
