import Block from '@components/Block/Block';
import Typography from '@components/Typography/Typography';
import useAppTheme from '@hooks/useTheme';
import Checkbox from 'expo-checkbox';
import { ViewStyle } from 'react-native';

interface CheckBoxProps {
  checked?: boolean;
  label?: string;
  onChange?: (checked: boolean) => void;
  style?: ViewStyle;
}

const CheckBox: React.FC<CheckBoxProps> = (props) => {
  const { checked, label, style, onChange } = props;
  const theme = useAppTheme();

  return (
    <Block flexDirection="row" align="center" style={style}>
      <Checkbox
        value={checked}
        onValueChange={onChange}
        style={{ height: 24, width: 24 }}
        color={theme.colors.secondaryBlue}
      />

      <Typography mL="xl" variation="description1">
        {label}
      </Typography>
    </Block>
  );
};

export default CheckBox;
