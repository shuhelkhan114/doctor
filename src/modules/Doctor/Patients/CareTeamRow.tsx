import Block, { BlockProps } from '@components/Block/Block';
import Icon from '@components/Icon/Icon';
import Image from '@components/Image/Image';
import Typography from '@components/Typography/Typography';
import useAppTheme from '@hooks/useTheme';
import { Doctor } from '@typings/model/doctor';

interface DoctorRowProps extends BlockProps {
  doctor: Doctor;
  disabled?: boolean;
  isCurrentlyLoggedInDoctor?: boolean;
}

const DoctorRow: React.FC<DoctorRowProps> = (props) => {
  const { doctor, disabled, isCurrentlyLoggedInDoctor, ...restProps } = props;
  const { first_name, last_name, doctor_image, speciality } = doctor;
  const theme = useAppTheme();

  return (
    <Block pV="lg" flexDirection="row" align="center" justify="space-between" {...restProps}>
      <Block flexDirection="row" align="center">
        <Image uri={doctor_image} circular size={56} />
        <Block mL="xl">
          <Typography variation="title3">
            {isCurrentlyLoggedInDoctor ? 'You' : `${first_name} ${last_name}`}
          </Typography>
          <Typography color="dark" variation="description1">
            {speciality}
          </Typography>
        </Block>
      </Block>
      {!disabled && (
        <Block>
          <Icon name="chat" color={theme.colors.mainBlue} size={24} />
        </Block>
      )}
    </Block>
  );
};

export default DoctorRow;
