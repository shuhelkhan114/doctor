import useAppTheme from '@hooks/useTheme';
import { SVGIconProps } from '@typings/common';
import * as React from 'react';
import Svg, { G, Mask, Path } from 'react-native-svg';

const MicroPhoneIcon: React.FC<SVGIconProps> = (props) => {
  const theme = useAppTheme();
  const { fill = theme.colors.white } = props;

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Mask id="a" maskUnits="userSpaceOnUse" x={0} y={0} width={24} height={24}>
        <Path fill="#D9D9D9" d="M0 0H24V24H0z" />
      </Mask>
      <G mask="url(#a)">
        <Path
          d="M12 13c-.567 0-1.042-.192-1.425-.575C10.192 12.042 10 11.567 10 11V5c0-.567.192-1.042.575-1.425C10.958 3.192 11.433 3 12 3c.567 0 1.042.192 1.425.575.383.383.575.858.575 1.425v6c0 .567-.192 1.042-.575 1.425-.383.383-.858.575-1.425.575zm-.5 7.5v-3.525c-1.567-.133-2.875-.771-3.925-1.913C6.525 13.921 6 12.567 6 11h1c0 1.383.488 2.562 1.463 3.537C9.438 15.512 10.617 16 12 16s2.563-.488 3.538-1.463C16.513 13.562 17 12.383 17 11h1c0 1.567-.525 2.92-1.575 4.062-1.05 1.142-2.358 1.78-3.925 1.913V20.5h-1zM12 12a.968.968 0 00.713-.288A.967.967 0 0013 11V5a.97.97 0 00-.287-.713A.97.97 0 0012 4a.967.967 0 00-.712.287A.968.968 0 0011 5v6c0 .283.096.52.288.712A.965.965 0 0012 12z"
          fill={fill}
        />
      </G>
    </Svg>
  );
};

export default MicroPhoneIcon;
