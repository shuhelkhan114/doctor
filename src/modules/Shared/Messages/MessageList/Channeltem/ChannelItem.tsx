import { BlockProps } from '@components/Block/Block';
import { useChat } from '@context/ChatContext';
import { Screens } from '@core/config/screens';
import { getParsedMessage } from '@core/utils/common';
import { MessagesStackScreens } from '@navigation/Doctor/MessagesStack';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppSelector } from '@store/store';
import { UserRole } from '@typings/common';
import React, { useEffect, useMemo, useState } from 'react';
import { Channel, FormatMessageResponse } from 'stream-chat';
import { DefaultStreamChatGenerics } from 'stream-chat-react-native-core';
import MessageItem from '../../MessageItem/MessageItem';

interface ChannelItemProps extends BlockProps {
  channel: Channel<DefaultStreamChatGenerics>;
}

const ChannelItem: React.FC<ChannelItemProps> = (props) => {
  const { channel, ...restProps } = props;
  const [lastMessage, setLastMessage] =
    useState<FormatMessageResponse<DefaultStreamChatGenerics> | null>(null);
  const [lastMessageSeen, setLastMessageSeen] = useState(false);

  const { setChannel } = useChat();
  const navigation =
    useNavigation<StackNavigationProp<MessagesStackScreens, Screens.MessagesScreen>>();

  const user = useAppSelector((state) => {
    const role = state.auth.role;
    return role === UserRole.Doctor ? state.auth.doctor : state.auth.patient;
  });

  useEffect(() => {
    // Adding listeners to update channel data in real time as stream chat don't update automatically if using custom UI
    channel?.on('message.new', handleMessageData);
    channel?.on('message.updated', handleMessageData);
    channel?.on('message.deleted', handleMessageData);
    channel?.on('message.read', handleMessageData);
  }, []);

  useEffect(() => {
    handleMessageData();
  }, []);

  const handleMessageData = () => {
    const lastMessage = channel?.lastMessage();
    setLastMessage(lastMessage);

    if (channel?.countUnread() > 0 && lastMessage.user_id !== user?.id) {
      setLastMessageSeen(false);
    } else {
      setLastMessageSeen(true);
    }
  };

  const isOnline = useMemo(() => {
    // If any of the members excepted the logged in user is online then display online status
    return Object.values(channel?.state.members)
      .filter((member) => member.user_id !== user?.id)
      .some((member) => member.user?.online);
  }, [channel?.state.members]);

  const handlePress = () => {
    setChannel(channel);
    setLastMessageSeen(true);
    navigation.navigate(Screens.ChatScreen, { name: title, imageUrls });
  };

  const members = Object.values(channel?.state.members);
  const totalUsers = members.length;
  const wasLastMessageByMe = lastMessage?.user?.id === user?.id;
  const isGroup = totalUsers > 2;
  const message = getParsedMessage(lastMessage?.html);
  const messagesCount = channel?.state.messages.length;
  const hasAttachments = !!lastMessage?.attachments?.[0];

  let title = '';
  let imageUrls: string[] = [];
  if (isGroup) {
    title = channel?.data?.name || 'Group Chat';
    imageUrls = members.map((member) => member.user?.vocalMdImageUrl as string);
  } else {
    const receiver = Object.values(channel?.state.members).find(
      (member) => member.user_id !== user?.id
    );
    title = `${receiver?.user?.name}`;
    imageUrls = [receiver?.user?.vocalMdImageUrl as string];
  }

  return (
    <MessageItem
      title={title}
      isGroup={isGroup}
      message={message}
      isOnline={isOnline}
      imageUrls={imageUrls}
      onPress={handlePress}
      messagesCount={messagesCount}
      hasAttachments={hasAttachments}
      wasLastMessageByMe={wasLastMessageByMe}
      lastMessageAt={lastMessage?.created_at}
      isLastMessageUnseen={!lastMessageSeen}
      {...restProps}
    />
  );
};

export default ChannelItem;
