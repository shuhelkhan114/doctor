import { useMemo } from 'react';
import { Image, ImageStyle, StyleSheet } from 'react-native';

import { getSize } from '@core/utils/responsive';

export const iconsMap = {
  paid: require('@assets/icons/paid.png'),
  search: require('@assets/icons/search.png'),
  crown: require('@assets/icons/crown.png'),
  'arrow-right': require('@assets/icons/arrow-right.png'),
  'arrow-left': require('@assets/icons/arrow-left.png'),
  chat: require('@assets/icons/chat.png'),
  profile: require('@assets/icons/profile.png'),
  'chevron-right': require('@assets/icons/chevron-right.png'),
  'chevron-down': require('@assets/icons/chevron-down.png'),
  checked: require('@assets/icons/checked.png'),
  add: require('@assets/icons/add.png'),
  stamp: require('@assets/icons/stamp.png'),
  calendar: require('@assets/icons/calendar.png'),
  'three-dots': require('@assets/icons/three-dots.png'),
  'medication-edit': require('@assets/icons/medication-edit.png'),
  conversation: require('@assets/icons/conversation.png'),
  pencil: require('@assets/icons/pencil.png'),
  history: require('@assets/icons/history.png'),
  close: require('@assets/icons/close.png'),
  'trash-can': require('@assets/icons/trash-can.png'),
  'exam-board': require('@assets/icons/exam-board.png'),
  'chevron-left-encircled': require('@assets/icons/chevron-left-encircled.png'),
  'my-chart': require('@assets/icons/my-chart.png'),
  tick: require('@assets/icons/tick.png'),
  'user-add': require('@assets/icons/user-add.png'),
  eye: require('@assets/icons/eye.png'),
  error: require('@assets/icons/error.png'),
  send: require('@assets/icons/send.png'),
  microphone: require('@assets/icons/microphone.png'),
  pause: require('@assets/icons/pause.png'),
  share: require('@assets/icons/share.png'),
  question: require('@assets/icons/question.png'),
};

interface IconProps {
  name: keyof typeof iconsMap;
  size?: number;
  color?: string;
  style?: ImageStyle;
}

const Icon: React.FC<IconProps> = (props) => {
  const { name, size = 32, color, style } = props;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        default: {
          width: getSize(size),
          height: getSize(size),
          ...(color && { tintColor: color }),
          ...style,
        },
      }),
    [size, color, style]
  );

  return <Image style={styles.default} source={iconsMap[name]} />;
};

export default Icon;
