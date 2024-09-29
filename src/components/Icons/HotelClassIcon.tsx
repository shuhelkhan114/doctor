import useAppTheme from '@hooks/useTheme';
import { SVGIconProps } from '@typings/common';
import * as React from 'react';
import Svg, { G, Mask, Path } from 'react-native-svg';

const HotelClassIcon: React.FC<SVGIconProps> = (props) => {
  const theme = useAppTheme();
  const { fill = theme.colors.positiveAction } = props;

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Mask id="a" maskUnits="userSpaceOnUse" x={0} y={0} width={24} height={24}>
        <Path fill="#D9D9D9" d="M0 0H24V24H0z" />
      </Mask>
      <G mask="url(#a)">
        <Path
          d="M16.7 15.5l3.8-3.25 3 .25-4.4 3.825L20.4 22l-2.55-1.55-1.15-4.95zm-2.35-7.3L13.3 5.75 14.45 3l2.3 5.425-2.4-.225zM4.325 22l1.625-7.025L.5 10.25l7.2-.625L10.5 3l2.8 6.625 7.2.625-5.45 4.725L16.675 22 10.5 18.275 4.325 22z"
          fill={fill}
        />
      </G>
    </Svg>
  );
};

export default HotelClassIcon;
