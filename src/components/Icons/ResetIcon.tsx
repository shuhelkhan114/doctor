import useAppTheme from '@hooks/useTheme';
import { SVGIconProps } from '@typings/common';
import * as React from 'react';
import Svg, { G, Mask, Path } from 'react-native-svg';

const ResetIcon: React.FC<SVGIconProps> = (props) => {
  const theme = useAppTheme();
  const { fill = theme.colors.mainBlue } = props;

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Mask id="a" maskUnits="userSpaceOnUse" x={0} y={0} width={24} height={24}>
        <Path fill="#D9D9D9" d="M0 0H24V24H0z" />
      </Mask>
      <G mask="url(#a)">
        <Path
          d="M11 19.9c-1.733-.234-3.167-1.005-4.3-2.314C5.567 16.278 5 14.75 5 13c0-.933.183-1.83.55-2.688A7.13 7.13 0 017.075 8.05l.725.7a5.582 5.582 0 00-1.35 1.938C6.15 11.412 6 12.183 6 13c0 1.467.471 2.754 1.413 3.862C8.354 17.97 9.55 18.65 11 18.9v1zm2 .05v-1a6.437 6.437 0 003.575-2.126C17.525 15.724 18 14.45 18 13c0-1.666-.583-3.083-1.75-4.25C15.083 7.583 13.667 7 12 7h-.625l1.6 1.6-.725.7-2.8-2.8 2.8-2.8.725.7-1.6 1.6H12c1.95 0 3.604.68 4.962 2.037C18.321 9.395 19 11.05 19 13c0 1.75-.57 3.27-1.712 4.562-1.142 1.292-2.571 2.088-4.288 2.388z"
          fill={fill}
        />
      </G>
    </Svg>
  );
};

export default ResetIcon;
