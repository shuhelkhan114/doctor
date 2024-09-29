import format from 'date-fns/format';
import parse from 'date-fns/parse';
import { useField } from 'formik';
import React from 'react';
import { ViewStyle } from 'react-native';

import useAppTheme from '@hooks/useTheme';
import Block from '../../Block/Block';
import DatePicker, { DatePickerProps } from '../../DatePicker/DatePicker';
import ErrorText from '../../ErrorText/ErrorText';

interface FormikDateInputProps extends DatePickerProps {
  name: string;
  dateFormat?: string;
  style?: ViewStyle;
  inputStyle?: ViewStyle;
}

const FormikDateInput: React.FC<FormikDateInputProps> = (props) => {
  const { name, dateFormat, style, inputStyle, ...restProps } = props;

  const [field, meta, helpers] = useField(name as any);
  const theme = useAppTheme();
  const { onChange, ...requiredFieldProps } = field;
  const hasError = meta.error && meta.touched;

  const handleChange = (date: Date) => {
    if (dateFormat) {
      helpers.setValue(format(date, dateFormat));
    } else {
      helpers.setValue(date);
    }
  };

  const value = field.value || undefined;

  return (
    <Block style={style}>
      <DatePicker
        style={{
          borderWidth: 1,
          borderColor: value ? theme.colors.accent : theme.colors.light,
          borderRadius: 100,
          ...inputStyle,
        }}
        {...restProps}
        {...requiredFieldProps}
        value={value && dateFormat ? parse(field.value, dateFormat, new Date()) : field.value}
        onChange={handleChange}
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

export default FormikDateInput;
