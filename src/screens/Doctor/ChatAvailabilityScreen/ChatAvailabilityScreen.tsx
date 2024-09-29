import ErrorText from '@components/ErrorText/ErrorText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation } from 'react-query';

import Block from '@components/Block/Block';
import Icon from '@components/Icon/Icon';
import Typography from '@components/Typography/Typography';
import { appConfig } from '@core/config/app';
import { Screens } from '@core/config/screens';
import { timezones } from '@core/config/timezone';
import toast from '@core/lib/toast';
import API from '@core/services';
import { getDateFromHoursAndMinutes, getHoursAndMinutes } from '@core/utils/date';
import useAppTheme from '@hooks/useTheme';
import TimeZoneModalPicker from '@modules/Doctor/ChatAvailability/TimeZoneModalPicker/TimeZoneModalPicker';
import AvailabilityRow from '@modules/Doctor/DoctorProfile/AvailabilityRow/AvailabilityRow';
import { StartStackScreens } from '@navigation/Doctor/StartStack';
import { refetchDoctor } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { Availability, TimeZone } from '@typings/common';

type ChatAvailabilityScreenProps = NativeStackScreenProps<
  StartStackScreens,
  Screens.ChatAvailabilityScreen
>;

export type ChatAvailabilityScreenParams = undefined;

const ChatAvailabilityScreen: React.FC<ChatAvailabilityScreenProps> = (props) => {
  const { navigation } = props;
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const theme = useAppTheme();
  const [chatAvailabilityModalVisible, setChatAvailabilityModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const {
    isLoading,
    error,
    mutate: updateProfile,
  } = useMutation(API.doctor.auth.updateProfile, {
    onSuccess(data) {
      dispatch(refetchDoctor());
    },
  });

  const availabilities: Availability[] = useMemo(
    () =>
      ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => {
        const availability = auth.doctor?.chat_availibility.find(
          (availability) => availability.day === day
        );
        if (availability) {
          return {
            ...availability,
            available: true,
          };
        }
        return {
          day,
          durations: [
            {
              start_time: getHoursAndMinutes(
                getDateFromHoursAndMinutes(
                  appConfig.doctor.defaultWorkingTimeStart.hours,
                  appConfig.doctor.defaultWorkingTimeStart.minutes
                )
              ),
              end_time: getHoursAndMinutes(
                getDateFromHoursAndMinutes(
                  appConfig.doctor.defaultWorkingTimeEnd.hours,
                  appConfig.doctor.defaultWorkingTimeEnd.minutes
                )
              ),
            },
          ],
          available: false,
        };
      }),
    [auth.doctor?.chat_availibility]
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          paddingTop: insets.top,
        },
      }),
    []
  );

  const showChatAvailabilityModal = useCallback(() => {
    setChatAvailabilityModalVisible(true);
  }, []);

  const handleTimezoneChange = (timezone: TimeZone) => {
    updateProfile({
      chat_availibility_tz: timezone.offset,
    });
  };

  const renderAvailabilityRow: ListRenderItem<Availability> = (listItem) => {
    const { item, index } = listItem;
    return (
      <AvailabilityRow
        bC="lightest"
        key={item.day}
        availability={item}
        bBW={availabilities.length - 1 === index ? 0 : 1}
      />
    );
  };

  const handleSave = () => {
    toast.success('Updated chat availability!');
    navigation.goBack();
  };

  const timezone =
    auth.doctor?.chat_availibility_tz !== null
      ? timezones.find((timezone) => timezone.offset === auth.doctor?.chat_availibility_tz)
      : null;

  let timeZoneContent = <></>;

  if (isLoading) {
    timeZoneContent = <Typography>Updating...</Typography>;
  } else if (timezone) {
    timeZoneContent = (
      <Block>
        <Typography variation="description2">{timezone.value}</Typography>
        <Typography variation="description2">{timezone.text}</Typography>
      </Block>
    );
  } else {
    timeZoneContent = <Typography>Select your timezone</Typography>;
  }

  return (
    <Block style={styles.container}>
      <TimeZoneModalPicker
        onSelect={handleTimezoneChange}
        visible={chatAvailabilityModalVisible}
        onClose={setChatAvailabilityModalVisible}
      />

      <Block pH="xxxl" flexDirection="row" justify="space-between" align="center">
        <Block onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={theme.colors.mainBlue} />
        </Block>
        <Typography variation="title2">Chat availability</Typography>
        <Block onPress={handleSave}>
          <Icon name="checked" size={24} />
        </Block>
      </Block>

      <Block pH="xxxl">
        <Block style={{ marginTop: theme.spacing['4xl'] }}>
          <Typography color="dark" variation="description1">
            Patients will still be able to send you messages but they'll only get to you in the
            specified times.
          </Typography>
        </Block>
      </Block>

      <Block pH="xxxl" mT="xxxl" flex1>
        <Block
          pV="md"
          bW={1}
          pH="xxxl"
          bC="lighter"
          rounded="lg"
          align="center"
          flexDirection="row"
          justify="space-between"
          onPress={showChatAvailabilityModal}>
          {timeZoneContent}

          <Icon name="chevron-down" size={24} />
        </Block>

        <ErrorText error={error} />

        <Block mT={error ? 'xl' : 'xxl'} flex1>
          <FlatList
            listKey="id"
            data={availabilities}
            renderItem={renderAvailabilityRow}
            showsVerticalScrollIndicator={false}
          />
        </Block>
      </Block>
    </Block>
  );
};

export default ChatAvailabilityScreen;
