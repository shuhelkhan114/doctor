import Block, { BlockProps } from '@components/Block/Block';
import Icon from '@components/Icon/Icon';
import Image from '@components/Image/Image';
import Typography from '@components/Typography/Typography';

interface PatientRowProps extends BlockProps {
  name: string;
  imageUrl: string;
  doctorsCount: number;
  healthIssuesCount: number;
  referer?: {
    first_name: string;
    last_name: string;
  };
  bottomBorder?: boolean;
  asideItem?: React.ReactNode;
  onPress?: () => void;
}

const PatientRow: React.FC<PatientRowProps> = (props) => {
  const {
    name,
    imageUrl,
    doctorsCount,
    healthIssuesCount,
    referer,
    onPress,
    bottomBorder,
    asideItem,
    ...restProps
  } = props;

  return (
    <Block
      pV="md"
      bC="lightest"
      align="center"
      onPress={onPress}
      flexDirection="row"
      bBW={bottomBorder ? 1 : 0}
      {...restProps}>
      <Image uri={imageUrl} size={56} circular mR="xl" />
      <Block flex1>
        <Typography color="secondaryBlue" variation="title3">
          {name}
        </Typography>

        <Block flexDirection="row" align="center">
          <Icon name="crown" size={16} />
          <Typography variation="description1" color="dark" mL="sm" numberOfLines={1}>
            {referer
              ? `Referred by ${referer.first_name} ${referer.last_name}`
              : `${doctorsCount} care team members`}
          </Typography>
        </Block>

        <Typography variation="description2" color="dark" numberOfLines={1}>
          {healthIssuesCount} health issues
        </Typography>
      </Block>
      {asideItem}
    </Block>
  );
};

export default PatientRow;
