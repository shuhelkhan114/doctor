import useAppTheme from '@hooks/useTheme';
import { SVGIconProps } from '@typings/common';
import * as React from 'react';
import Svg, { G, Mask, Path } from 'react-native-svg';

const HomeIcon: React.FC<SVGIconProps> = (props) => {
  const theme = useAppTheme();
  const { fill = theme.colors.secondaryBlue } = props;

  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none" {...props}>
      <Mask id="a" maskUnits="userSpaceOnUse" x={0} y={0} width={32} height={32}>
        <Path fill="#D9D9D9" d="M0 0H32V32H0z" />
      </Mask>
      <G mask="url(#a)">
        <Path
          d="M8 25.333h4.933V17.5h6.134v7.833H24v-12l-8-6.066-8 6.066v12zm-1.333 1.334v-14L16 5.6l9.333 7.067v14h-7.6v-7.834h-3.466v7.834h-7.6z"
          fill={fill}
        />
      </G>
    </Svg>
  );
};

export default HomeIcon;
