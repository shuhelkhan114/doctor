import Block from '@components/Block/Block';
import Icon from '@components/Icon/Icon';
import Typography from '@components/Typography/Typography';
import { colors } from '@core/styles/theme';
import useAppTheme from '@hooks/useTheme';

interface SettingRowProps {
  title: string;
  subtitle?: string;
  description1?: string;
  description2?: string;
  subtitleColor?: keyof typeof colors;
  onPress?: () => void;
}

const SettingRow: React.FC<SettingRowProps> = (props) => {
  const theme = useAppTheme();
  const { title, subtitle, description1, description2, onPress } = props;

  return (
    <Block onPress={onPress} flexDirection="row" pV="xl" justify="space-between" align="center">
      <Block flexDirection="column">
        <Typography variation="description1" color="darkest" style={{ ...theme.fonts.medium }}>
          {title}
        </Typography>

        {subtitle && (
          <Typography mT="xs" color="dark" variation="description1">
            {subtitle}
          </Typography>
        )}

        {description1 && (
          <Typography color="dark" variation="description1">
            {description1}
          </Typography>
        )}

        {description2 && (
          <Typography color="dark" variation="description1">
            {description2}
          </Typography>
        )}
      </Block>
      <Icon name="chevron-right" size={24} />
    </Block>
  );
};

export default SettingRow;
