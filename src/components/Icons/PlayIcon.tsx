import useAppTheme from '@hooks/useTheme';
import { SVGIconProps } from '@typings/common';
import * as React from 'react';
import Svg, { G, Mask, Path } from 'react-native-svg';

const PlayIcon: React.FC<SVGIconProps> = (props) => {
  const theme = useAppTheme();
  const { fill = theme.colors.darkest } = props;

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Mask id="a" maskUnits="userSpaceOnUse" x={0} y={0} width={24} height={24}>
        <Path fill="#D9D9D9" d="M0 0H24V24H0z" />
      </Mask>
      <G mask="url(#a)">
        <Path d="M8 19V5l11 7-11 7z" fill={fill} />
      </G>
    </Svg>
  );
};

export default PlayIcon;
