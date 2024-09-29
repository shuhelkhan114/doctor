import Block from '@components/Block/Block';
import Icon from '@components/Icon/Icon';
import ArrowLeftIcon from '@components/Icons/ArrowLeftIcon';
import DoximityDialerIcon from '@components/Icons/DoximityDialerIcon';
import Image from '@components/Image/Image';
import PrimaryNavigationBar from '@components/NavigationBar/PrimaryNavigationBar/PrimaryNavigationBar';
import Typography from '@components/Typography/Typography';
import { useChat } from '@context/ChatContext';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import API from '@core/services';
import useAppTheme from '@hooks/useTheme';
import { MessagesStackScreens } from '@navigation/Doctor/MessagesStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppSelector } from '@store/store';
import { UserRole } from '@typings/common';
import { NativeModules } from 'react-native';

type ChatDetailScreenProps = NativeStackScreenProps<MessagesStackScreens, Screens.ChatDetailScreen>;

export type ChatDetailScreenParams = undefined;

const ChatDetailScreen: React.FC<ChatDetailScreenProps> = (props) => {
  const { navigation } = props;
  const { user, role } = useAppSelector((state) => {
    const role = state.auth.role;
    return {
      role,
      user: role === UserRole.Doctor ? state.auth.doctor : state.auth.patient,
    };
  });
  const { channel, setChannel } = useChat();

  const theme = useAppTheme();

  const handleDoximityDialerPress = () => {
    const patient = members.find((member) => member.user?.vocalMdRole === 'patient');
    if (patient) {
      NativeModules.DocHelloDoximityDialer.openDoximityDialer(patient.user?.vocalMdPhone);
    } else {
      toast.error('No patient found in this chat!');
    }
  };

  const members = Object.values(channel?.state.members);
  const patient = members.find((member) => member?.user?.vocalMdRole === 'patient');
  const primaryUser =
    patient ||
    members.find((member) => member?.user?.vocalMdRole === 'doctor' && member.user_id !== user?.id);

  return (
    <Block>
      <PrimaryNavigationBar>
        <Block pH="xxxl" flexDirection="row" justify="space-between">
          <Block onPress={navigation.goBack}>
            <ArrowLeftIcon fill="#fff" />
          </Block>
          <Block align="center">
            <Block>
              <Image
                size={72}
                circular
                uri={primaryUser?.user?.vocalMdImageUrl as string}
                style={{ borderWidth: 2, borderColor: 'white', borderRadius: 72 }}
              />
              {members.length > 2 && (
                <Block
                  bW={1}
                  absolute
                  bottom={0}
                  right={0}
                  bC="white"
                  height={24}
                  width={24}
                  align="center"
                  rounded="4xl"
                  justify="center"
                  bgColor="mainBlue">
                  <Icon color="white" name="crown" size={16} />
                </Block>
              )}
            </Block>
            <Typography variation="title3Bolder" color="white" mT="md">
              {primaryUser?.user?.name}
            </Typography>
            <Typography variation="title3" color="white" mB="lg">
              {members.length} participants
            </Typography>
          </Block>
          {patient ? (
            <Block onPress={handleDoximityDialerPress}>
              <DoximityDialerIcon fill="#fff" />
            </Block>
          ) : (
            <Block />
          )}
        </Block>
      </PrimaryNavigationBar>

      <Block pV="xl">
        <Block pV="xl" pH="xxxl">
          <Typography variation="title3Bolder" mB="xxxl">
            {members.length > 2 ? 'Care Team' : 'Participants'}
          </Typography>
          {members
            .filter((member) => member.user_id !== primaryUser?.user?.id)
            .map((member, index) => {
              const handlePress = async () => {
                navigation.navigate(Screens.ChatScreen, {
                  name: member.user?.name as string,
                  imageUrls: [member.user?.vocalMdImageUrl as string],
                });
                if (user?.id) {
                  const members = [user?.id, member?.user_id!];
                  const channel = await API.stream.getOrCreateChannel(members);
                  setChannel(channel);
                }
              };

              const isCurrentUser = member?.user_id === user?.id;

              let title = '';
              let subtitle = '';

              if (isCurrentUser) {
                title = 'You';
              } else {
                title = member.user?.name!;
              }

              if (role === UserRole.Patient) {
                subtitle = 'Patient';
              } else if (role === UserRole.Doctor) {
                subtitle = member?.user?.vocalMdSpeciality as string;
              }

              return (
                <Block
                  pV="lg"
                  bC="lightest"
                  align="center"
                  flexDirection="row"
                  key={member?.user_id}
                  bBW={index !== members.length - 2 ? 1 : 0}>
                  <Image mR="xl" uri={member.user?.vocalMdImageUrl as string} size={56} circular />
                  <Block flex1>
                    <Typography numberOfLines={1} variation="title3">
                      {title}
                    </Typography>
                    <Typography numberOfLines={1} variation="description1" color="dark">
                      {subtitle}
                    </Typography>
                  </Block>
                  {!isCurrentUser && (
                    <Block pV="lg" pH="xl" onPress={handlePress}>
                      <Icon size={24} name="chat" color={theme.colors.mainBlue} />
                    </Block>
                  )}
                </Block>
              );
            })}
        </Block>
      </Block>
    </Block>
  );
};

export default ChatDetailScreen;
