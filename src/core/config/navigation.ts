import { getSize } from '@core/utils/responsive';
import { ViewStyle } from 'react-native';

export const defaultBottomTabItemStyle: ViewStyle = {
  borderTopWidth: 1,
  marginHorizontal: getSize(12),
  borderTopColor: '#DDDDDD',
  position: 'absolute',
};
