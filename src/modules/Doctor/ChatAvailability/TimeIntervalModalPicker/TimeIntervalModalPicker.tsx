import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import ErrorText from '@components/ErrorText/ErrorText';
import Typography from '@components/Typography/Typography';
import { getDateFromHoursAndMinutes } from '@core/utils/date';
import { getSize } from '@core/utils/responsive';
import useAppTheme from '@hooks/useTheme';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Availability } from '@typings/common';
import format from 'date-fns/format';
import { useCallback, useMemo, useState } from 'react';
import { Platform, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import Modal from 'react-native-modal';
import {
  NavigationState,
  SceneMap,
  SceneRendererProps,
  TabBar,
  TabView,
} from 'react-native-tab-view';
import { Scene } from 'react-native-tab-view/lib/typescript/src/types';

type RenderTabBarProps = SceneRendererProps & {
  navigationState: NavigationState<any>;
};

type RenderLabelProps = Scene<any> & {
  focused: boolean;
  color: string;
};

interface TimeIntervalModalPickerProps {
  visible: boolean;
  loading: boolean;
  error: unknown;
  dayOfWeek: string;
  startTime: Availability['durations'][0]['start_time'];
  endTime: Availability['durations'][0]['end_time'];
  onClose: (visible: false) => void;
  onSave: (from: Date, to: Date) => void;
}

const TimeIntervalModalPicker: React.FC<TimeIntervalModalPickerProps> = (props) => {
  const { visible, onClose, dayOfWeek, startTime, endTime, onSave, loading, error } = props;
  const [from, setFrom] = useState(getDateFromHoursAndMinutes(startTime.hours, startTime.minutes));
  const [to, setTo] = useState(getDateFromHoursAndMinutes(endTime.hours, endTime.minutes));
  const layout = useWindowDimensions();
  const theme = useAppTheme();
  const [index, setIndex] = useState(0);
  const routes = [
    { key: 'first', title: 'From', selectedDate: from },
    { key: 'second', title: 'To', selectedDate: to },
  ];

  const From = () => (
    <RNDateTimePicker
      mode="time"
      display="spinner"
      {...(Platform.OS === 'ios' && parseFloat(Platform.Version) >= 14
        ? null
        : { textColor: theme.colors.black })}
      is24Hour={false}
      value={from}
      minuteInterval={15}
      onChange={(event) => {
        setFrom(new Date(event.nativeEvent.timestamp as unknown as string));
      }}
    />
  );

  const To = () => (
    <RNDateTimePicker
      mode="time"
      minuteInterval={15}
      display="spinner"
      {...(Platform.OS === 'ios' && parseFloat(Platform.Version) >= 14
        ? null
        : { textColor: theme.colors.black })}
      is24Hour={false}
      value={to}
      onChange={(event) => {
        setTo(new Date(event.nativeEvent.timestamp as unknown as string));
      }}
    />
  );

  const renderScene = SceneMap({
    first: From,
    second: To,
  });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        modal: {
          margin: 0,
          justifyContent: 'flex-end',
        },
        container: {
          borderTopRightRadius: 34,
          borderTopLeftRadius: 34,
        },
        handle: {
          backgroundColor: theme.colors.lighter,
          width: getSize(54),
          height: getSize(4.5),
          borderRadius: theme.rounded.lg,
        },
        timeZoneList: {
          marginTop: theme.spacing['4xl'],
          height: getSize(400),
        },
        indicator: {
          backgroundColor: theme.colors.secondaryBlue,
          height: 4,
        },
        tabBar: {
          backgroundColor: 'transparent',
          borderBottomColor: theme.colors.lightest,
          borderBottomWidth: 1,
        },
        label: {
          color: theme.colors.secondaryBlue,
        },
      }),
    []
  );

  const handleClose = useCallback(() => {
    onClose?.(false);
  }, [onClose]);

  const handleSave = useCallback(() => {
    onSave?.(from, to);
  }, [onSave, from, to]);

  const renderLabel = (props: RenderLabelProps) => {
    return (
      <Block align="center">
        <Typography color="dark" variation="paragraph">
          {props.route.title}
        </Typography>
        <Typography
          color="secondaryBlue"
          variation="title2"
          style={{ fontWeight: '400', lineHeight: 30 }}>
          {format(props.route.selectedDate, 'kk:mm a')}
        </Typography>
      </Block>
    );
  };

  const renderTabBar = (props: RenderTabBarProps) => {
    return (
      <TabBar
        indicatorStyle={styles.indicator}
        renderLabel={renderLabel}
        style={styles.tabBar}
        labelStyle={styles.label}
        {...props}
      />
    );
  };

  return (
    <Modal
      isVisible={visible}
      style={styles.modal}
      onSwipeComplete={handleClose}
      onBackdropPress={handleClose}
      propagateSwipe={false}>
      <Block bgColor="white" pV="xl" style={styles.container}>
        <Block pH="xxxl">
          <Block align="center">
            <Block style={styles.handle} />
          </Block>
        </Block>
        <ScrollView contentContainerStyle={{ height: getSize(450) }}>
          <Block pH="xxxl">
            <Typography variation="title2" center mT="xxxl">
              {dayOfWeek}
            </Typography>

            <ErrorText error={error} />
          </Block>

          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={renderTabBar}
            initialLayout={{ width: layout.width }}
          />

          <Block pH="4xl" mT="4xl">
            <Button onPress={handleSave} loading={loading} title="Set availability" />
          </Block>
        </ScrollView>
      </Block>
    </Modal>
  );
};

export default TimeIntervalModalPicker;
