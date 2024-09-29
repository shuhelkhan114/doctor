import Block from '@components/Block/Block';
import ThreeDotsVertical from '@components/Icons/ThreeDotsVertical';
import Image from '@components/Image/Image';
import Typography from '@components/Typography/Typography';
import { getTimeAgo } from '@core/utils/date';
import React from 'react';

interface RequestRowProps {
  name: string;
  imageUrl: string;
  speciality: string;
  city: string;
  state: string;
  requestSentOn: string;
  onPress?: () => void;
}

const RequestRow: React.FC<RequestRowProps> = (props) => {
  const { name, imageUrl, speciality, city, state, requestSentOn, onPress } = props;

  return (
    <Block pV="xl" flexDirection="row" align="center" onPress={onPress}>
      <Image mR="xl" size={56} circular uri={imageUrl} />
      <Block flex1>
        <Block flexDirection="row" align="center" justify="space-between">
          <Typography variation="title3">{name}</Typography>
        </Block>

        <Typography color="dark" variation="title3">
          {speciality}
        </Typography>
        {city && (
          <Typography color="dark" variation="title3">
            {city} {state}
          </Typography>
        )}
      </Block>
      <Block align="flex-end" style={{ alignSelf: 'flex-start' }}>
        <Typography variation="description2">{getTimeAgo(new Date(requestSentOn))}</Typography>
        <ThreeDotsVertical />
      </Block>
    </Block>
  );
};

export default RequestRow;
