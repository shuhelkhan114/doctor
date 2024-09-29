import useAppTheme from '@hooks/useTheme';
import { useField } from 'formik';
import React from 'react';
import { ViewStyle } from 'react-native';
import Block from '../../Block/Block';
import ErrorText from '../../ErrorText/ErrorText';
import Input, { InputProps } from '../../Input/Input';

interface FormikInputProps extends InputProps {
  name: string;
  formatter?: (value: string) => string;
  style?: ViewStyle;
  inputStyle?: ViewStyle;
}

const FormikInput: React.FC<FormikInputProps> = (props) => {
  const { name, formatter, style, inputStyle, ...restProps } = props;

  const [field, meta, helpers] = useField(name as any);
  const theme = useAppTheme();
  const { onChange, onBlur, ...requiredFieldProps } = field;
  const hasError = meta.error && meta.touched;

  const handleChange = (val: string) => {
    let value = val;
    if (formatter && typeof formatter === 'function') {
      value = formatter(value);
    }
    helpers.setValue(value);
  };

  return (
    <Block style={style}>
      <Input
        style={inputStyle}
        onChangeText={handleChange}
        {...requiredFieldProps}
        {...restProps}
      />
      {hasError && (
        <ErrorText
          style={{
            // TODO: Refactor this
            marginVertical: 0,
            marginTop: theme.spacing.md,
            marginLeft: theme.spacing.xxxl,
            fontSize: 14,
          }}
          error={{ message: meta.error }}
        />
      )}
    </Block>
  );
};

export default FormikInput;
