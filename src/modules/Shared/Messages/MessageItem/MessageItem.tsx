import Block, { BlockProps } from '@components/Block/Block';
import GroupImage from '@components/GroupImage/GroupImage';
import AttachmentIcon from '@components/Icons/AttachmentIcon';
import Typography from '@components/Typography/Typography';
import UserAvatar from '@components/UserAvatar/UserAvatar';
import { getTimeAgo } from '@core/utils/date';
import React from 'react';

interface MessageItemProps extends BlockProps {
  message: string;
  title: string;
  imageUrls: string[];
  isGroup?: boolean;
  isOnline?: boolean;
  messagesCount: number;
  hasAttachments: boolean;
  wasLastMessageByMe?: boolean;
  isLastMessageUnseen: boolean;
  lastMessageAt: Date | undefined;
}

const MessageItem: React.FC<MessageItemProps> = (props) => {
  const {
    isOnline = false,
    hasAttachments = false,
    title = '',
    message = '',
    imageUrls = [] as string[],
    lastMessageAt = new Date(),
    isLastMessageUnseen = false,
    wasLastMessageByMe = false,
    messagesCount = 0,
    isGroup,
    ...restProps
  } = props;

  let lastMessageContent: React.ReactNode = null;

  if (messagesCount === 0) {
    lastMessageContent = <Typography color="light">No Messages Yet</Typography>;
  } else if (hasAttachments) {
    lastMessageContent = (
      <Block flexDirection="row" align="center">
        <AttachmentIcon />
        <Typography variation="description1" color="dark">
          {wasLastMessageByMe ? 'You sent an attachment' : 'Attachment'}
        </Typography>
      </Block>
    );
  } else {
    lastMessageContent = (
      <Typography variation="description1" color="darkest" numberOfLines={1}>
        {message}
      </Typography>
    );
  }

  return (
    <Block pV="lg" align="center" flexDirection="row" {...restProps}>
      {isGroup ? (
        <GroupImage mR="xl" images={imageUrls} />
      ) : (
        <UserAvatar mR="xl" size="large" isOnline={isOnline} uri={imageUrls[0]} />
      )}
      <Block style={{ flex: 1 }}>
        <Block flexDirection="row" justify="space-between">
          <Typography
            color="secondaryBlue"
            variation={isLastMessageUnseen ? 'title3Bolder' : 'title3'}>
            {title}
          </Typography>

          {lastMessageAt && messagesCount > 0 && (
            <Typography variation="description2" color="dark">
              {getTimeAgo(lastMessageAt)}
            </Typography>
          )}
        </Block>
        <Block flexDirection="row" align="center" justify="space-between">
          {lastMessageContent}
          {isLastMessageUnseen && (
            <Block height={12} width={12} rounded="xxl" bgColor="negativeAction" mL="xxxl" />
          )}
        </Block>
      </Block>
    </Block>
  );
};

export default MessageItem;
