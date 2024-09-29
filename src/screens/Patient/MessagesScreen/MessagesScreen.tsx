import Block from '@components/Block/Block';
import StaticNavigationBar from '@components/NavigationBar/StaticNavigationBar';
import { Screens } from '@core/config/screens';
import { useChatClient } from '@hooks/useChatClient';
import useAppTheme from '@hooks/useTheme';
import MessageList from '@modules/Shared/Messages/MessageList/MessageList';
import { MessagesStackScreens } from '@navigation/Patient/MessagesStack';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppSelector } from '@store/store';
import { useMemo } from 'react';
import { ActivityIndicator } from 'react-native';
import { ChannelFilters } from 'stream-chat';
import { ChannelList } from 'stream-chat-expo';
import { DefaultStreamChatGenerics } from 'stream-chat-react-native-core';

type MessagesScreenProps = NativeStackScreenProps<MessagesStackScreens, Screens.MessagesScreen>;

export type MessagesScreenParams = undefined;

const MessagesScreen: React.FC<MessagesScreenProps> = () => {
  const theme = useAppTheme();
  const height = useBottomTabBarHeight();
  const auth = useAppSelector((state) => state.auth);
  const { clientIsReady } = useChatClient();

  const defaultFilters: ChannelFilters<DefaultStreamChatGenerics> = useMemo(
    () => ({
      members: {
        $in: [auth.patient?.id!],
      },
    }),
    []
  );

  let content: React.ReactNode = null;

  if (!clientIsReady) {
    content = (
      <Block flex1 justify="center">
        <ActivityIndicator color={theme.colors.mainBlue} />
      </Block>
    );
  } else {
    content = (
      <Block pH="xxxl" flex1>
        <ChannelList filters={defaultFilters} List={MessageList} />
      </Block>
    );
  }

  return (
    <Block flex1 pB={height}>
      <StaticNavigationBar title="Talk to your Care Team" />
      {content}
    </Block>
  );
};

export default MessagesScreen;
