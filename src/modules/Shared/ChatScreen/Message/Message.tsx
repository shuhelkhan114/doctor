import AudioPlayer from '@components/AudioPlayer/AudioPlayer';
import Block from '@components/Block/Block';
import Image from '@components/Image/Image';
import Typography from '@components/Typography/Typography';
import { useChat } from '@context/ChatContext';
import { getParsedMessage } from '@core/utils/common';
import { getTimeAgo } from '@core/utils/date';
import { ImageGallery } from '@georstat/react-native-image-gallery';

import CloseIcon from '@components/Icons/CloseIcon';
import { getSize } from '@core/utils/responsive';
import useAppTheme from '@hooks/useTheme';
import { useAppSelector } from '@store/store';
import { UserRole } from '@typings/common';
import React, { useState } from 'react';
import { ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DefaultStreamChatGenerics, MessageProps as NativeMessageProps } from 'stream-chat-expo';

interface MessageProps extends NativeMessageProps<DefaultStreamChatGenerics> {}

const Message: React.FC<MessageProps> = (props) => {
  const { message } = props;
  const { attachments } = message;
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { channel } = useChat();
  const [imageGalleryVisible, setImageGalleryVisible] = useState(false);
  const auth = useAppSelector((state) => state.auth);
  const currId = auth.role === UserRole.Doctor ? auth.doctor?.id : auth.patient?.id;
  const totalUsers = Object.values(channel?.state.members).length;
  const isGroup = totalUsers > 2;

  const isMyMessage = message.user?.id === currId;

  let attachmentContent = <></>;
  if (attachments!.length > 0) {
    const att = attachments?.[0];
    if (att?.type === 'image') {
      attachmentContent = (
        <Image
          onPress={() => setImageGalleryVisible(true)}
          uri={att.thumb_url}
          imageStyle={{
            height: getSize(100),
            width: getSize(160),
            borderRadius: 8,
            marginBottom: theme.spacing.xl,
          }}
        />
      );
    } else if (att?.type === 'audio') {
      attachmentContent = (
        <Block style={{ width: getSize(240) }}>
          <AudioPlayer
            title="Voice Note"
            url={att.asset_url!}
            theme={isMyMessage ? 'dark' : 'light'}
          />
        </Block>
      );
    }
  }

  const boxStyle: ViewStyle = {
    ...(isMyMessage ? { borderTopRightRadius: 0 } : { borderTopLeftRadius: 0 }),
  };

  return (
    <Block mV="md" align={isMyMessage ? 'flex-end' : 'flex-start'} pH="xl">
      <ImageGallery
        hideThumbs
        isOpen={imageGalleryVisible}
        close={() => setImageGalleryVisible(false)}
        images={[{ url: attachments?.[0]?.asset_url as string }]}
        renderHeaderComponent={() => (
          <Block
            pH="xxl"
            justify="flex-end"
            flexDirection="row"
            style={{ paddingTop: insets.top }}
            onPress={() => setImageGalleryVisible(false)}>
            <CloseIcon width={40} height={40} fill="white" />
          </Block>
        )}
      />

      <Block flexDirection={isMyMessage ? 'row' : 'row-reverse'} align="flex-end">
        <Block maxWidth="80%" {...(isMyMessage ? { mR: 'md' } : { mL: 'md' })}>
          {!isMyMessage && isGroup && <Typography>{message.user?.name}</Typography>}
          <Block align={isMyMessage ? 'flex-end' : 'flex-start'}>
            <Block
              pV="xl"
              pH="xl"
              rounded="xl"
              style={boxStyle}
              bgColor={isMyMessage ? 'secondaryBlue' : 'lighter'}>
              {attachmentContent}
              {attachments?.[0]?.type !== 'audio' && message.html && (
                <Typography color={isMyMessage ? 'white' : 'dark'} variation="chatBubbles">
                  {getParsedMessage(message.html)}
                </Typography>
              )}
            </Block>
            <Typography variation="description2">
              {getTimeAgo(message.created_at as Date)}
            </Typography>
          </Block>
        </Block>
        <Image mB="xxxl" circular uri={message.user?.vocalMdImageUrl as string} size={32} />
      </Block>
    </Block>
  );
};

export default Message;
