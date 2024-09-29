import { Image } from 'react-native';

import Block, { BlockProps } from '@components/Block/Block';
import Icon from '@components/Icon/Icon';
import Typography from '@components/Typography/Typography';
import useAppTheme from '@hooks/useTheme';

interface TrusteeRowProps extends BlockProps {
  imageUrl: string;
  name: string;
  permission: string;
  icon?: boolean;
  onPress?: () => void;
}

const TrusteeRow: React.FC<TrusteeRowProps> = (props) => {
  const { imageUrl, name, permission, icon, ...restProps } = props;
  const theme = useAppTheme();

  return (
    <Block pV="md" flexDirection="row" align="center" justify="space-between" {...restProps}>
      <Block flexDirection="row" align="center">
        <Image source={{ uri: imageUrl }} style={{ height: 56, width: 56, borderRadius: 56 }} />
        <Block mL="xl">
          <Typography variation="title3">{name}</Typography>
          <Typography variation="description1">{permission}</Typography>
        </Block>
      </Block>

      {icon && <Icon name="three-dots" color={theme.colors.mainBlue} size={24} />}
    </Block>
  );
};

export default TrusteeRow;
