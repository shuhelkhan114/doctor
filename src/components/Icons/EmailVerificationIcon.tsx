import useAppTheme from '@hooks/useTheme';
import { SVGIconProps } from '@typings/common';
import * as React from 'react';
import Svg, { G, Mask, Path } from 'react-native-svg';

const EmailVerificationIcon: React.FC<SVGIconProps> = (props) => {
  const theme = useAppTheme();
  const { fill = theme.colors.dark } = props;

  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none" {...props}>
      <Mask id="a" maskUnits="userSpaceOnUse" x={0} y={0} width={32} height={32}>
        <Path fill="#D9D9D9" d="M0 0H32V32H0z" />
      </Mask>
      <G mask="url(#a)">
        <Path
          d="M20.651 28.359l-4.743-4.744.943-.943 3.8 3.8 7.585-7.585.944.944-8.529 8.528zM16 14.666L26.256 8H5.744L16 14.666zm0 1.488L5.333 9.179v14c0 .24.077.436.231.59.154.154.35.23.59.23h6.38l1.333 1.334H6.154c-.614 0-1.126-.205-1.537-.616-.411-.412-.617-.924-.617-1.538V8.82c0-.613.206-1.126.617-1.537.41-.41.923-.617 1.537-.617h19.692c.614 0 1.126.206 1.537.617.411.411.617.924.617 1.537v6.57l-1.333 1.333V9.179L16 16.154z"
          fill={fill}
        />
      </G>
    </Svg>
  );
};

export default EmailVerificationIcon;
