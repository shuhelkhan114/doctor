import { useChat } from '@context/ChatContext';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import API from '@core/services';
import { logError } from '@core/utils/logger';
import { StartStackScreens } from '@navigation/Doctor/StartStack';
import { DashboardStackScreens } from '@navigation/Patient/DashboardStack';
import notifee, { EventType, Notification } from '@notifee/react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DocHelloNotificationType } from '@typings/common';
import { useEffect } from 'react';

export const useNotification = () => {
  const { setChannel } = useChat();
  const navigation =
    useNavigation<
      StackNavigationProp<StartStackScreens | DashboardStackScreens, Screens.PatientDetailScreen>
    >();

  const handleNotification = async (notification: Notification) => {
    if (notification.data?.channel_id) {
      const channel = await API.stream.getChannelById(notification.data.channel_id as string);
      if (channel) {
        setChannel(channel);
        navigation.navigate(Screens.ChatScreen, {
          name: channel?.data?.name as string,
          imageUrls: [channel?.data?.image as string],
        });
      } else {
        toast.error('Chat not found, Please try again!');
        logError(`Channel not found: ${notification.data?.channel_id}`);
      }
    }
    // handle Doc Hello server notifications
    else {
      const { content } = notification.data as { content: string };
      try {
        const notificationContent = JSON.parse(content as string);
        const { type, data } = notificationContent;
        switch (type) {
          case DocHelloNotificationType.NewPatientRequest:
            navigation.navigate(Screens.PatientDetailScreen, {
              patientId: data.patient_id,
            });
            break;
          case DocHelloNotificationType.NewArticle:
            navigation.navigate(Screens.NewsFeedScreen, {
              selectedArticleId: data.article_id,
            });
            break;
          case DocHelloNotificationType.NewDoctor:
            // TODO: Talk to team and implement this
            break;
          default:
            logError(`Unknown notification type: ${type}`);
        }
      } catch (error) {
        logError(`Unable to parse notification: ${JSON.stringify(error, null, 2)}`);
        logError(error);
      }
    }
  };

  const mount = async () => {
    notifee.onBackgroundEvent(async ({ detail, type }) => {
      if (type === EventType.PRESS && detail.notification) {
        handleNotification(detail.notification);
      }
    });

    notifee.getInitialNotification().then(async (initialNotification) => {
      if (initialNotification) {
        handleNotification(initialNotification.notification);
      }
    });
  };

  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS && detail.notification) handleNotification(detail.notification);
    });
  }, []);

  useEffect(() => {
    mount();
  }, []);

  return {
    handleNotification,
  };
};
