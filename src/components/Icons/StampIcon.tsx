import useAppTheme from '@hooks/useTheme';
import { SVGIconProps } from '@typings/common';
import * as React from 'react';
import Svg, { G, Mask, Path } from 'react-native-svg';

const StampIcon: React.FC<SVGIconProps> = (props) => {
  const theme = useAppTheme();
  const { fill = theme.colors.secondaryBlue } = props;

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Mask id="a" maskUnits="userSpaceOnUse" x={0} y={0} width={24} height={24}>
        <Path fill="#D9D9D9" d="M0 0H24V24H0z" />
      </Mask>
      <G mask="url(#a)">
        <Path
          d="M5 19.7v-4.4c0-.45.154-.83.463-1.138.308-.308.695-.462 1.162-.462h10.75c.467 0 .854.154 1.163.462.308.309.462.688.462 1.138v4.4H5zm1-3h12v-1.4a.574.574 0 00-.188-.413.599.599 0 00-.437-.187H6.625a.599.599 0 00-.437.187A.574.574 0 006 15.3v1.4zm6-3L8 8.275v-.2c0-1.116.388-2.062 1.163-2.838.775-.774 1.72-1.162 2.837-1.162 1.117 0 2.063.388 2.838 1.162C15.613 6.013 16 6.96 16 8.075v.2L12 13.7zm0-1.55l3-4.075c0-.833-.292-1.541-.875-2.125A2.893 2.893 0 0012 5.075c-.833 0-1.542.292-2.125.875A2.893 2.893 0 009 8.075l3 4.075z"
          fill={fill}
        />
      </G>
    </Svg>
  );
};

export default StampIcon;
