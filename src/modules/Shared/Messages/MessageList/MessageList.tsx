import Block from '@components/Block/Block';
import Spinner from '@components/Loaders/Spinner';
import ScrollView from '@components/ScrollView/ScrollView';
import Typography from '@components/Typography/Typography';
import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useChannelsContext } from 'stream-chat-expo';
import ChannelItem from './Channeltem/ChannelItem';

interface MessageListProps {}

const MessageList: React.FC<MessageListProps> = () => {
  const { channels, loadingChannels } = useChannelsContext();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        scrollView: {
          flex: loadingChannels ? 1 : undefined,
        },
      }),
    [loadingChannels]
  );

  let content: React.ReactNode = null;

  if (loadingChannels) {
    content = <Spinner />;
  } else if (!channels?.[0]) {
    content = (
      <Block flex1 style={{ height: '100%' }} mT="xxxl" justify="center" align="center">
        <Typography>No Messages found</Typography>
      </Block>
    );
  } else {
    content = channels.map((channel, index) => (
      <ChannelItem
        bC="lightest"
        key={channel.id}
        channel={channel}
        bBW={index === channels.length - 1 ? 0 : 1}
      />
    ));
  }

  return (
    <ScrollView pB="7xl" contentContainerStyle={styles.scrollView}>
      <Block flex1>{content}</Block>
    </ScrollView>
  );
};

export default MessageList;
