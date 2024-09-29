import useAppTheme from '@hooks/useTheme';
import { SVGIconProps } from '@typings/common';
import * as React from 'react';
import Svg, { G, Mask, Path } from 'react-native-svg';

const CloseIcon: React.FC<SVGIconProps> = (props) => {
  const theme = useAppTheme();
  const { fill = theme.colors.mainBlue, height = 24, width = 24 } = props;

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
      <Mask id="a" maskUnits="userSpaceOnUse" x={0} y={0} width={24} height={24}>
        <Path fill="#D9D9D9" d="M0 0H24V24H0z" />
      </Mask>
      <G mask="url(#a)">
        <Path
          d="M6.4 18.3l-.7-.7 5.6-5.6-5.6-5.6.7-.7 5.6 5.6 5.6-5.6.7.7-5.6 5.6 5.6 5.6-.7.7-5.6-5.6-5.6 5.6z"
          fill={fill}
        />
      </G>
    </Svg>
  );
};

export default CloseIcon;
