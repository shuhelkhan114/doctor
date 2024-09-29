import Block from '@components/Block/Block';
import Modal from '@components/Modal/Modal';
import ScrollView from '@components/ScrollView/ScrollView';
import Search from '@components/Search/Search';
import Typography from '@components/Typography/Typography';
import { timezones as allTimezones } from '@core/config/timezone';
import { getSize } from '@core/utils/responsive';
import useAppTheme from '@hooks/useTheme';
import { TimeZone } from '@typings/common';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import TimeZoneRow from './TimeZoneRow/TimeZoneRow';

interface TimeZoneModalPickerProps {
  visible: boolean;
  onClose: (visible: false) => void;
  onSelect: (timezone: TimeZone) => void;
}

const TimeZoneModalPicker: React.FC<TimeZoneModalPickerProps> = (props) => {
  const { visible, onClose, onSelect } = props;
  const [timezones, setTimezones] = useState(allTimezones);
  const theme = useAppTheme();

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
          height: getSize(300),
        },
      }),
    []
  );

  const handleClose = useCallback(() => {
    onClose?.(false);
  }, [onClose]);

  const handleSearch = useCallback((term: string) => {
    setTimezones(
      allTimezones.filter(({ value, text, utc }) => {
        return value.includes(term) || text.includes(term) || utc.join('').includes(term);
      })
    );
  }, []);

  return (
    <Modal visible={visible} onClose={handleClose} disabledSwipe minHeight="80%">
      <Block bgColor="white" style={styles.container}>
        <Typography variation="title2" center mT="xxxl">
          Select time zone
        </Typography>

        <Search
          mV="xxl"
          placeholder="Search timezone"
          onSearch={handleSearch}
          onClear={handleSearch}
        />

        <ScrollView>
          {timezones.map((timezone, index) => {
            const handlePress = () => {
              onSelect?.(timezone);
              handleClose();
            };
            return (
              <TimeZoneRow
                key={timezone.value}
                bBW={index === timezones.length - 1 ? 0 : 1}
                bC="lighter"
                name={timezone.value}
                offset={timezone.text}
                utc={timezone.utc[0]}
                onPress={handlePress}
              />
            );
          })}
        </ScrollView>
      </Block>
    </Modal>
  );
};

export default TimeZoneModalPicker;
