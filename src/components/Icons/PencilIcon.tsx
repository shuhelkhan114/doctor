import useAppTheme from '@hooks/useTheme';
import { SVGIconProps } from '@typings/common';
import * as React from 'react';
import Svg, { G, Mask, Path } from 'react-native-svg';

const PencilIcon: React.FC<SVGIconProps> = (props) => {
  const theme = useAppTheme();
  const { fill = theme.colors.secondaryBlue, width = 24, height = 24 } = props;

  return (
    <Svg width={height} height={width} viewBox="0 0 24 24" fill="none" {...props}>
      <Mask id="a" maskUnits="userSpaceOnUse" x={0} y={0} width={24} height={24}>
        <Path fill="#D9D9D9" d="M0 0H24V24H0z" />
      </Mask>
      <G mask="url(#a)">
        <Path
          d="M5.3 19h1.075l9.9-9.9L15.2 8.025l-9.9 9.9V19zM18.425 8.375l-2.5-2.475 1.2-1.2a.951.951 0 01.725-.325c.283 0 .525.108.725.325l1.05 1.025c.2.2.3.442.3.725s-.1.525-.3.725l-1.2 1.2zM17.7 9.1L6.8 20H4.3v-2.5L15.2 6.6l2.5 2.5z"
          fill={fill}
        />
      </G>
    </Svg>
  );
};

export default PencilIcon;
