import { useCallback, useState } from 'react';
import { ActivityIndicator, Switch } from 'react-native';
import { useMutation } from 'react-query';

import Block, { BlockProps } from '@components/Block/Block';
import Icon from '@components/Icon/Icon';
import Typography from '@components/Typography/Typography';
import API from '@core/services';
import { capitalizeFirstLetter } from '@core/utils/common';
import { getAvailabilityText, getHoursAndMinutes } from '@core/utils/date';
import useAppTheme from '@hooks/useTheme';
import { refetchDoctor } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { Availability } from '@typings/common';
import TimeIntervalModalPicker from '../../ChatAvailability/TimeIntervalModalPicker/TimeIntervalModalPicker';

interface AvailabilityRowProps extends BlockProps {
  availability: Availability;
}

const AvailabilityRow: React.FC<AvailabilityRowProps> = (props) => {
  const theme = useAppTheme();
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const {
    isLoading: updatingProfile,
    error,
    mutateAsync: updateProfile,
  } = useMutation(API.doctor.auth.updateProfile, {
    onSuccess() {
      dispatch(refetchDoctor());
      setTimePickerVisible(false);
    },
  });
  const { availability, ...restProps } = props;

  const [available, setAvailable] = useState(() => availability.available);

  const handleToggleAvailability = async (checked: boolean) => {
    if (checked) {
      setTimePickerVisible(true);
      setAvailable(true);
    } else {
      await updateProfile({
        chat_availibility: auth.doctor?.chat_availibility.filter(
          (av) => av.day !== availability.day
        ),
      });
      setAvailable(false);
    }
  };

  const showTimePicker = useCallback(() => {
    setTimePickerVisible(true);
  }, [setTimePickerVisible]);

  const timeText = getAvailabilityText(
    !!availability.available,
    availability.durations[0].start_time,
    availability.durations[0].end_time
  );

  const handleSetAvailability = async (from: Date, to: Date) => {
    const exists = auth.doctor?.chat_availibility.find((av) => av.day === availability.day);
    let updatedChatAvailabilities: Availability[] = [];
    if (exists) {
      updatedChatAvailabilities = (auth.doctor?.chat_availibility || []).map((av) => {
        if (av.day === availability.day) {
          return {
            ...av,
            durations: [
              {
                start_time: getHoursAndMinutes(from),
                end_time: getHoursAndMinutes(to),
              },
            ],
          };
        }
        return av;
      });
    } else {
      updatedChatAvailabilities = [
        ...(auth.doctor?.chat_availibility || []),
        {
          day: availability.day.toLowerCase(),
          durations: [
            {
              start_time: getHoursAndMinutes(from),
              end_time: getHoursAndMinutes(to),
            },
          ],
        },
      ];
    }
    await updateProfile({
      chat_availibility: updatedChatAvailabilities,
    });
    setAvailable(true);
  };

  const handleCloseTimePicker = () => {
    setTimePickerVisible(false);
    if (!availability.available) {
      setAvailable(false);
    }
  };

  return (
    <Block
      key={availability.day}
      flexDirection="row"
      justify="space-between"
      align="center"
      pV="xxl"
      {...restProps}>
      <TimeIntervalModalPicker
        loading={updatingProfile}
        error={error}
        dayOfWeek={availability.day}
        startTime={availability.durations[0].start_time}
        endTime={availability.durations[0].end_time}
        visible={timePickerVisible}
        onClose={handleCloseTimePicker}
        onSave={handleSetAvailability}
      />
      {updatingProfile ? (
        <ActivityIndicator style={{ marginHorizontal: 16 }} color={theme.colors.mainBlue} />
      ) : (
        <Switch
          value={available}
          thumbColor={theme.colors.mainBlue}
          onChange={(event) => event.preventDefault()}
          onValueChange={handleToggleAvailability}
          trackColor={{ false: theme.colors.lighter, true: theme.colors.accent }}
        />
      )}
      <Typography variation="description1">
        {capitalizeFirstLetter(availability.day.slice(0, 3))}
      </Typography>
      <Block
        pV="lg"
        bgColor="lightest2"
        rounded="lg"
        style={{ minWidth: '45%', opacity: availability.available ? 1 : 0.4 }}
        onPress={() => {
          if (availability.available && !updatingProfile) {
            showTimePicker();
          }
        }}>
        <Typography variation="description2" center>
          {timeText}
        </Typography>
      </Block>
      <Block>
        <Icon
          name="add"
          size={24}
          color={availability.available ? theme.colors.mainBlue : theme.colors.secondaryBlue}
        />
      </Block>
    </Block>
  );
};

export default AvailabilityRow;
