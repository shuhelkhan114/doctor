import Block from '@components/Block/Block';
import GroupImage from '@components/GroupImage/GroupImage';
import Icon from '@components/Icon/Icon';
import DoximityDialerIcon from '@components/Icons/DoximityDialerIcon';
import Image from '@components/Image/Image';
import KeyboardView from '@components/KeyboardView/KeyboardView';
import PrimaryNavigationBar from '@components/NavigationBar/PrimaryNavigationBar/PrimaryNavigationBar';
import Typography from '@components/Typography/Typography';
import UserAvatar from '@components/UserAvatar/UserAvatar';
import { useChat } from '@context/ChatContext';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import Message from '@modules/Shared/ChatScreen/Message/Message';
import MessageInput from '@modules/Shared/ChatScreen/MessageInput/MessageInput';
import { MessagesStackScreens } from '@navigation/Doctor/MessagesStack';
import { CareTeamStackScreens } from '@navigation/Patient/CareTeamStack';
import { MessagesStackScreens as PatientMessagesStackScreens } from '@navigation/Patient/MessagesStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppSelector } from '@store/store';
import { UserRole } from '@typings/common';
import { Audio } from 'expo-av';
import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, NativeModules, StatusBar } from 'react-native';
import { Channel, MessageList, MessageInput as StreamMessageInput } from 'stream-chat-expo';

type ChatScreenProps = NativeStackScreenProps<
  MessagesStackScreens | PatientMessagesStackScreens | CareTeamStackScreens,
  Screens.ChatScreen
>;

export type ChatScreenParams = {
  name: string;
  imageUrls: string[];
};

const ChatScreen: React.FC<ChatScreenProps> = (props) => {
  const { navigation, route } = props;
  const { name, imageUrls } = route?.params || {};

  const { channel } = useChat();

  const { user, role } = useAppSelector((state) => {
    const role = state.auth.role;
    return { user: role === UserRole.Doctor ? state.auth.doctor : state.auth.patient, role };
  });

  useEffect(() => {
    Audio.requestPermissionsAsync();
  }, []);

  const members = Object.values(channel?.state.members || {});
  const totalUsers = members.length;
  const isGroup = totalUsers > 2;
  const hasPatient = !!members.find((member) => member.user?.vocalMdRole === 'patient');

  const isOnline = useMemo(() => {
    // If any of the members excepted the logged in user is online then display online status
    return members
      .filter((member) => member.user_id !== user?.id)
      .some((member) => member.user?.online);
  }, [members]);

  const handleDoximityDialerPress = () => {
    const patient = members.find((member) => member.user?.vocalMdRole === 'patient');
    if (patient) {
      NativeModules.DocHelloDoximityDialer.openDoximityDialer(patient.user?.vocalMdPhone);
    } else {
      toast.error('No patient found in this chat!');
    }
  };

  let content: React.ReactNode = null;

  if (!channel) {
    content = (
      <Block flex1 justify="center" align="center">
        <ActivityIndicator />
      </Block>
    );
  } else {
    content = (
      <Channel key={channel?.id} channel={channel}>
        <MessageList
          DateHeader={() => null}
          channel={channel}
          key={channel?.id}
          Message={Message}
          EmptyStateIndicator={() => (
            <Block justify="center" align="center" pH="4xl" flex1>
              <Image
                size={200}
                resizeMode="contain"
                source={require('@assets/empty-conversation.png')}
              />
              <Typography color="darker" variation="title2Bolder" center>
                Start a conversation with {name}
              </Typography>
              <Typography mT="md" color="dark" variation="paragraph" center>
                Please be aware that family members are also in this chat.
              </Typography>
            </Block>
          )}
        />
        <StreamMessageInput Input={MessageInput} />
      </Channel>
    );
  }

  return (
    <KeyboardView>
      <Block flex1>
        <StatusBar barStyle="light-content" />
        <PrimaryNavigationBar>
          <Block pH="xxl" pB="xl" flexDirection="row" align="center">
            <Block onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={28} />
            </Block>

            <Block mL="md" flexDirection="row" align="center" flex1>
              <Block onPress={() => navigation.navigate(Screens.ChatDetailScreen)}>
                {imageUrls.length > 1 ? (
                  <GroupImage size={42} images={imageUrls} />
                ) : (
                  <UserAvatar size="medium" isOnline={isOnline} uri={imageUrls[0]} />
                )}
                {isGroup && (
                  <Block
                    bW={1}
                    absolute
                    bottom={-2}
                    right={-4}
                    bC="white"
                    height={16}
                    width={16}
                    align="center"
                    rounded="4xl"
                    justify="center"
                    bgColor="mainBlue">
                    <Icon color="white" name="crown" size={16} />
                  </Block>
                )}
              </Block>

              <Block mL="md" flex1 onPress={() => navigation.navigate(Screens.ChatDetailScreen)}>
                <Typography color="white" variation="title3Bolder" maxWidth="100%">
                  {name}
                </Typography>
                <Typography color="white" numberOfLines={1}>
                  You,{' '}
                  {members
                    .filter((member) => member?.user_id !== user?.id)
                    .map((member) => member?.user?.name)
                    ?.join(', ')}
                </Typography>
              </Block>

              {role === UserRole.Doctor && hasPatient && (
                <Block mL="md" onPress={handleDoximityDialerPress}>
                  <DoximityDialerIcon fill="#fff" />
                </Block>
              )}
            </Block>
          </Block>
        </PrimaryNavigationBar>

        <Block flex1>{content}</Block>
      </Block>
    </KeyboardView>
  );
};

export default ChatScreen;
