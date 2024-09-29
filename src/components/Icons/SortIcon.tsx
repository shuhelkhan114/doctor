import useAppTheme from '@hooks/useTheme';
import { SVGIconProps } from '@typings/common';
import * as React from 'react';
import Svg, { G, Mask, Path } from 'react-native-svg';

const SortIcon: React.FC<SVGIconProps> = (props) => {
  const theme = useAppTheme();
  const { fill = theme.colors.secondaryBlue } = props;

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Mask id="a" maskUnits="userSpaceOnUse" x={0} y={0} width={24} height={24}>
        <Path fill="#D9D9D9" d="M0 0H24V24H0z" />
      </Mask>
      <G mask="url(#a)">
        <Path
          d="M2 17L5.75 7H7.9l3.75 10H9.6l-.85-2.4H4.9L4.1 17H2zm3.5-4.1h2.6L6.9 9.15h-.15L5.5 12.9zm8.2 4.1v-1.9l5.05-6.3H13.9V7h7.05v1.9l-5 6.3H21V17h-7.3zM9 5l3-3 3 3H9zm3 17l-3-3h6l-3 3z"
          fill={fill}
        />
      </G>
    </Svg>
  );
};

export default SortIcon;
