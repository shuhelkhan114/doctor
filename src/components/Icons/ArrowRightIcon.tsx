import useAppTheme from '@hooks/useTheme';
import { SVGIconProps } from '@typings/common';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const ArrowRightIcon: React.FC<SVGIconProps> = (props) => {
  const theme = useAppTheme();
  const { fill = theme.colors.secondaryBlue } = props;
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M14.1 17.3l-.7-.7 4.075-4.1H4.6v-1h12.875L13.4 7.4l.7-.7 5.3 5.3-5.3 5.3z"
        fill={fill}
      />
    </Svg>
  );
};

export default ArrowRightIcon;
