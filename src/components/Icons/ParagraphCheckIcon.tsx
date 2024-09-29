import useAppTheme from '@hooks/useTheme';
import { SVGIconProps } from '@typings/common';
import * as React from 'react';
import Svg, { G, Mask, Path } from 'react-native-svg';

const ParagraphCheckIcon: React.FC<SVGIconProps> = (props) => {
  const theme = useAppTheme();
  const { fill = theme.colors.secondaryBlue } = props;

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Mask id="a" maskUnits="userSpaceOnUse" x={0} y={0} width={24} height={24}>
        <Path fill="#D9D9D9" d="M0 0H24V24H0z" />
      </Mask>
      <G mask="url(#a)">
        <Path
          d="M3.5 20.05v-1h8v1h-8zm0-3.775v-1h8v1h-8zm0-3.775v-1h17v1h-17zm0-3.775v-1h17v1h-17zm0-3.775v-1h17v1h-17zm12.925 14.875L14.3 17.7l.675-.7 1.425 1.425 3.2-3.2.7.725-3.875 3.875z"
          fill={fill}
        />
      </G>
    </Svg>
  );
};

export default ParagraphCheckIcon;
