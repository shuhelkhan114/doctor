import Block from '@components/Block/Block';
import Icon from '@components/Icon/Icon';
import Typography from '@components/Typography/Typography';
import useAppTheme from '@hooks/useTheme';
import React, { useState } from 'react';
import { ViewStyle } from 'react-native';
import NativeDatePicker from 'react-native-date-picker';

export interface DatePickerProps {
  value?: Date | undefined;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  onChange?: (date: Date) => void;
  style?: ViewStyle;
}

const DatePicker: React.FC<DatePickerProps> = (props) => {
  const { value, minDate = new Date(1900, 0, 1), maxDate, placeholder, onChange, style } = props;
  const [pickerVisible, setPickerVisible] = useState(false);

  const theme = useAppTheme();

  const handleConfirm = (date: Date) => {
    setPickerVisible(false);
    onChange?.(date);
  };

  const handleOpenModal = () => {
    setPickerVisible(true);
  };

  const handleClosePicker = () => {
    setPickerVisible(false);
  };

  const defaultValue = value || new Date();

  return (
    <Block style={style}>
      <NativeDatePicker
        modal
        mode="date"
        open={pickerVisible}
        date={defaultValue}
        minimumDate={minDate}
        maximumDate={maxDate}
        onConfirm={handleConfirm}
        onCancel={handleClosePicker}
      />

      <Block
        pH="xxxl"
        pV="xxl"
        bgColor="white"
        align="center"
        flexDirection="row"
        justify="space-between"
        style={{ borderRadius: 100 }}
        onPress={handleOpenModal}>
        {value && (
          <Block
            pH="sm"
            absolute
            top={-7}
            left={24}
            rounded="xs"
            style={{ backgroundColor: theme.colors.white + 'D0' }}>
            <Typography variation="description2" color="dark" style={{ fontSize: 12 }}>
              {placeholder}
            </Typography>
          </Block>
        )}
        <Typography variation="description2" color="dark" style={{ fontSize: 14 }}>
          {value instanceof Date ? new Date(value).toDateString() : placeholder}
        </Typography>

        <Icon name="calendar" size={24} color={theme.colors.mainBlue} />
      </Block>
    </Block>
  );
};

export default DatePicker;
