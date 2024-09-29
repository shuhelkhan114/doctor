import Block from '@components/Block/Block';
import Icon from '@components/Icon/Icon';
import Typography from '@components/Typography/Typography';
import useAppTheme from '@hooks/useTheme';

interface BasicInfoRowProps {
  title: string;
  description: string;
  description2?: string;
  description3?: string;
  borderBottom?: boolean;
  onPress?: () => void;
}

const BasicInfoRow: React.FC<BasicInfoRowProps> = (props) => {
  const { title, description, description2, description3, borderBottom, onPress } = props;
  const theme = useAppTheme();

  return (
    <Block
      pV="lg"
      onPress={onPress}
      flexDirection="row"
      justify="space-between"
      {...(borderBottom && { bBW: 1, bC: 'lightest' })}>
      <Block flex1>
        <Typography color="darkest" variation="description1Bolder">
          {title}
        </Typography>

        {description && (
          <Typography color="dark" variation="description1">
            {description}
          </Typography>
        )}

        {description2 && (
          <Typography color="dark" variation="description1">
            {description2}
          </Typography>
        )}

        {description3 && (
          <Typography color="dark" variation="description1">
            {description3}
          </Typography>
        )}
      </Block>

      <Icon name="three-dots" color={theme.colors.mainBlue} size={24} />
    </Block>
  );
};

export default BasicInfoRow;
