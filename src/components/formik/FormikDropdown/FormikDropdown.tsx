import Block from '@components/Block/Block';
import DropDown, { DropDownProps } from '@components/DropDown/DropDown';
import ErrorText from '@components/ErrorText/ErrorText';
import useAppTheme from '@hooks/useTheme';
import { useField } from 'formik';
import React from 'react';
import { ViewStyle } from 'react-native';

interface FormikDropdownProps extends DropDownProps {
  name: string;
  containerStyles?: ViewStyle;
}

const FormikDropdown: React.FC<FormikDropdownProps> = (props) => {
  const { name, containerStyles, ...restProps } = props;

  const [field, meta, helpers] = useField(name as any);
  const theme = useAppTheme();
  const hasError = meta.error && meta.touched;

  const handleSelect = (value: string) => {
    helpers.setValue(value);
  };

  const value = field.value || undefined;

  return (
    <Block style={containerStyles}>
      <DropDown value={value} onSelect={handleSelect} {...restProps} />
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

export default FormikDropdown;
