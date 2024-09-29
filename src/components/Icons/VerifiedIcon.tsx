import useAppTheme from '@hooks/useTheme';
import { SVGIconProps } from '@typings/common';
import * as React from 'react';
import Svg, { G, Mask, Path } from 'react-native-svg';

const VerifiedIcon: React.FC<SVGIconProps> = (props) => {
  const theme = useAppTheme();
  const { fill = theme.colors.mainBlue } = props;

  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
      <Mask id="a" maskUnits="userSpaceOnUse" x={0} y={0} width={16} height={16}>
        <Path fill="#D9D9D9" d="M0 0H16V16H0z" />
      </Mask>
      <G mask="url(#a)">
        <Path
          d="M5.733 15l-1.266-2.133-2.4-.534.233-2.466L.667 8 2.3 6.133l-.233-2.466 2.4-.534L5.733 1 8 1.967 10.267 1l1.266 2.133 2.4.534-.233 2.466L15.333 8 13.7 9.867l.233 2.466-2.4.534L10.267 15 8 14.033 5.733 15zM7.3 10.367L11.067 6.6l-.934-.967L7.3 8.467l-1.433-1.4L4.933 8 7.3 10.367z"
          fill={fill}
        />
      </G>
    </Svg>
  );
};

export default VerifiedIcon;
