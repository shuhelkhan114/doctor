import React, { useEffect, useState } from 'react';

import Block, { BlockProps } from '@components/Block/Block';
import ThreeDotsVertical from '@components/Icons/ThreeDotsVertical';
import Typography from '@components/Typography/Typography';
import UserAvatar from '@components/UserAvatar/UserAvatar';
import API from '@core/services';
import { Doctor } from '@typings/model/doctor';

interface DoctorRowProps extends BlockProps {
  doctor: Doctor;
  renderActionButton?: JSX.Element;
}

const DoctorRow: React.FC<DoctorRowProps> = (props) => {
  const { doctor, renderActionButton, ...restProps } = props;

  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    API.stream.getUserById(doctor.id).then((res) => {
      setIsOnline(!!res.online);
    });
  }, []);

  return (
    <Block flexDirection="row" align="center" pV="lg" {...restProps}>
      <UserAvatar isOnline={isOnline} mR="xl" size="large" uri={doctor.doctor_image} />
      <Block mR="auto">
        <Typography color="secondaryBlue" variation="title3">
          {doctor.first_name} {doctor.last_name}
        </Typography>

        <Typography color="dark" variation="description1">
          {doctor.speciality}
        </Typography>
      </Block>

      {renderActionButton || <ThreeDotsVertical />}
    </Block>
  );
};

export default DoctorRow;
