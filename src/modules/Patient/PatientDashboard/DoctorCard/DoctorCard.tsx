import { useEffect, useState } from 'react';
import { ViewStyle } from 'react-native';

import Block, { BlockProps } from '@components/Block/Block';
import Icon from '@components/Icon/Icon';
import Typography from '@components/Typography/Typography';
import UserAvatar from '@components/UserAvatar/UserAvatar';
import API from '@core/services';
import { getChannel } from '@core/services/stream';
import { logError } from '@core/utils/logger';
import useAppTheme from '@hooks/useTheme';
import { useAppSelector } from '@store/store';
import { Doctor } from '@typings/model/doctor';

interface DoctorCardProps extends BlockProps {
  doctor: Doctor;
  style?: ViewStyle;
  onChatPress?: () => void;
}

const DoctorCard: React.FC<DoctorCardProps> = (props) => {
  const { doctor, style, onChatPress, ...restProps } = props;
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [wasLastMessageByMe, setLastMessageByMe] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const auth = useAppSelector((state) => state.auth);
  const theme = useAppTheme();

  const updateState = (channel: any) => {
    const lastMessage = channel.lastMessage();
    if (lastMessage?.user?.id === auth.patient?.id) {
      setLastMessageByMe(true);
    } else {
      setLastMessageByMe(false);
    }
    if (channel.countUnread() > 0) {
      setHasNewMessage(true);
    } else {
      setHasNewMessage(false);
    }
  };

  const mount = async () => {
    try {
      if (auth.patient) {
        const channel = await getChannel([doctor.id, auth.patient?.id]);
        if (channel) {
          channel.on('all', (event) => {
            updateState(channel);
          });
          updateState(channel);
        }
      }
    } catch (error) {
      logError(error);
    }
  };

  useEffect(() => {
    API.stream.getUserById(doctor.id).then((res) => {
      setIsOnline(!!res.online);
    });
  }, []);

  useEffect(() => {
    mount();
  }, []);

  const imageUrl = doctor.doctor_image;

  let footerText = `Dr. ${doctor.last_name} has replied to your message`;

  if (wasLastMessageByMe) {
    footerText = `You sent a message to Dr. ${doctor.first_name}`;
  }

  return (
    <Block rounded="xxl" shadow="sm" pV="xl" pH="xl" bgColor="white" style={style} {...restProps}>
      <Block>
        <Block relative flexDirection="row" align="center" mT="md">
          <UserAvatar size="large" isOnline={isOnline} uri={imageUrl} />
          <Block mL="xl">
            <Typography variation="title3">{`${doctor.first_name} ${doctor.last_name}`}</Typography>
            <Typography variation="description1" color="dark">
              {doctor.speciality}
            </Typography>
          </Block>
        </Block>
        <Block absolute top={0} style={{ right: 0 }}>
          <Icon name="three-dots" size={24} color={theme.colors.mainBlue} />
        </Block>
      </Block>

      <Block mV="xl" bgColor="lightest" height={1} />

      <Block
        flexDirection="row"
        justify="space-between"
        align="center"
        onPress={(event) => {
          event.stopPropagation();
          onChatPress?.();
        }}>
        <Typography color="dark" numberOfLines={1} variation="description2" maxWidth="90%">
          {footerText}
        </Typography>
        <Block relative>
          <Icon name="chat" size={24} color={theme.colors.mainBlue} />

          {hasNewMessage && (
            <Block
              bgColor="negativeAction"
              style={{
                width: 8,
                height: 8,
                borderRadius: 8,
                position: 'absolute',
                top: 0,
                right: 0,
              }}
            />
          )}
        </Block>
      </Block>
    </Block>
  );
};

export default DoctorCard;
