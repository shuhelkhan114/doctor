import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { ChannelFilters } from 'stream-chat';
import { ChannelList } from 'stream-chat-expo';
import { DefaultStreamChatGenerics } from 'stream-chat-react-native-core';

import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import StaticNavigationBar from '@components/NavigationBar/StaticNavigationBar';
import Search from '@components/Search/Search';
import { Screens } from '@core/config/screens';
import { useChatClient } from '@hooks/useChatClient';
import useAppTheme from '@hooks/useTheme';
import MessageList from '@modules/Shared/Messages/MessageList/MessageList';
import { MessagesStackScreens } from '@navigation/Doctor/MessagesStack';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAppSelector } from '@store/store';

type MessagesScreenProps = NativeStackScreenProps<MessagesStackScreens, Screens.MessagesScreen>;

export type MessagesScreenParams = object;

const options = {
  watch: true,
};

const MessagesScreen: React.FC<MessagesScreenProps> = (props) => {
  const { navigation } = props;

  const height = useBottomTabBarHeight();
  const theme = useAppTheme();
  const auth = useAppSelector((state) => state.auth);
  const { clientIsReady } = useChatClient();

  const defaultFilters: ChannelFilters<DefaultStreamChatGenerics> = {
    members: {
      $in: [auth.doctor?.id!],
    },
  };

  const [filters, setFilters] = useState(defaultFilters);

  const handleSearch = (term: string) => {
    if (term === '') {
      setFilters(defaultFilters);
    } else {
      setFilters({ ...filters, 'member.user.name': { $autocomplete: term } });
    }
  };

  const handleClear = () => {
    setFilters(defaultFilters);
  };

  let content: React.ReactNode = null;

  if (!clientIsReady) {
    content = (
      <Block flex1 justify="center">
        <ActivityIndicator color={theme.colors.mainBlue} />
      </Block>
    );
  } else {
    const renderChannelList = () => {
      return (
        <Block flex1>
          <MessageList />
          <Block
            absolute
            left={0}
            pH="5xl"
            bottom={10}
            align="center"
            width="100%"
            justify="center"
            flexDirection="row">
            <Button
              pV="xl"
              icon="chat"
              title="New message"
              onPress={() => navigation.navigate(Screens.NewMessageScreen)}
            />
          </Block>
        </Block>
      );
    };

    content = (
      <Block flex1>
        <Block pH="xxxl" flex1>
          <Search
            mB="lg"
            onClear={handleClear}
            onSearch={handleSearch}
            placeholder="Search patients, doctors or messages"
          />
          <ChannelList options={options} filters={filters} List={renderChannelList} />
        </Block>
      </Block>
    );
  }

  return (
    <Block flex1 pB={height}>
      <StaticNavigationBar title="Messages" />
      {content}
    </Block>
  );
};

export default MessagesScreen;
