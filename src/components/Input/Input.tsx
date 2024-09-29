import { useMemo, useState } from 'react';
import { StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';

import Block from '@components/Block/Block';
import Icon from '@components/Icon/Icon';
import { Size } from '@core/styles/theme';
import { getSize } from '@core/utils/responsive';
import useAppTheme from '@hooks/useTheme';

export interface InputProps extends TextInputProps {
  mH?: Size;
  mV?: Size;
  mT?: Size;
  mR?: Size;
  mB?: Size;
  mL?: Size;
  flex1?: boolean;
  placeholder: string;
  disabled?: boolean;
  style?: ViewStyle;
  type?: 'text' | 'password';
}

const Input: React.FC<InputProps> = (props) => {
  const {
    style,
    type = 'text',
    placeholder,
    value,
    onChangeText,
    flex1,
    mH,
    mV,
    mT,
    mR,
    mB,
    mL,
    disabled,
    ...restProps
  } = props;
  const [focused, setFocused] = useState(false);
  const theme = useAppTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          backgroundColor: 'white',
          borderWidth: 1,
          opacity: disabled ? 0.5 : 1,
          borderColor: focused || value ? theme.colors.accent : theme.colors.light,
          ...(flex1 && { flex: 1 }),
          ...(mH && { marginHorizontal: theme.spacing[mH] }),
          ...(mV && { marginVertical: theme.spacing[mV] }),
          ...(mT && { marginTop: theme.spacing[mT] }),
          ...(mR && { marginRight: theme.spacing[mR] }),
          ...(mB && { marginBottom: theme.spacing[mB] }),
          ...(mL && { marginLeft: theme.spacing[mL] }),
          ...style,
        },
        container: {
          borderWidth: 0,
        },
        textInput: {
          flex: 1,
          paddingVertical: theme.spacing.xxl,
        },
        label: {
          marginLeft: 20,
          left: 5,
          fontSize: 14,
          backgroundColor: theme.colors.white + 'D0',
          paddingHorizontal: 4,
          borderRadius: 2,
        },
        input: {
          paddingVertical: getSize(21.5),
          paddingHorizontal: theme.spacing.xxxl,
          backgroundColor: theme.colors.white,
          borderRadius: 100,
        },
      }),
    [style, focused, value, flex1, mH, mV, mT, mR, mB, mL]
  );

  return (
    <Block pR="xxxl" style={styles.wrapper} rounded="6xl">
      <FloatingLabelInput
        editable={!disabled}
        label={placeholder}
        isFocused={focused}
        labelStyles={styles.label}
        inputStyles={styles.input}
        onChangeText={onChangeText}
        isPassword={type === 'password'}
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        containerStyles={styles.container}
        value={value === null ? '' : value}
        customShowPasswordComponent={<Icon name="eye" size={24} />}
        customHidePasswordComponent={<Icon name="eye" size={24} />}
        labelProps={{
          style: {
            fontSize: 20,
          },
        }}
        customLabelStyles={{
          fontSizeFocused: 12,
          topFocused: getSize(-29),
        }}
        {...restProps}
      />
    </Block>
  );
};

export default Input;
