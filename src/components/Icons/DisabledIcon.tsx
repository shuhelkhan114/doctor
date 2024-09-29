import useAppTheme from '@hooks/useTheme';
import { SVGIconProps } from '@typings/common';
import * as React from 'react';
import Svg, { G, Mask, Path } from 'react-native-svg';

const DisabledIcon: React.FC<SVGIconProps> = (props) => {
  const theme = useAppTheme();
  const { fill = theme.colors.dark } = props;

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Mask id="a" maskUnits="userSpaceOnUse" x={0} y={0} width={24} height={24}>
        <Path fill="#D9D9D9" d="M0 0H24V24H0z" />
      </Mask>
      <G mask="url(#a)">
        <Path
          d="M7.5 12.5h9v-1h-9v1zm4.503 8.5a8.772 8.772 0 01-3.51-.709 9.094 9.094 0 01-2.859-1.922 9.085 9.085 0 01-1.925-2.857A8.753 8.753 0 013 12.003c0-1.244.236-2.414.708-3.51a9.094 9.094 0 011.924-2.859 9.085 9.085 0 012.856-1.925A8.753 8.753 0 0111.997 3c1.244 0 2.414.236 3.51.708a9.094 9.094 0 012.859 1.924 9.083 9.083 0 011.925 2.856A8.753 8.753 0 0121 11.997a8.772 8.772 0 01-.709 3.51 9.093 9.093 0 01-1.922 2.859 9.083 9.083 0 01-2.857 1.925 8.753 8.753 0 01-3.509.709zM12 20c2.233 0 4.125-.775 5.675-2.325C19.225 16.125 20 14.233 20 12c0-2.233-.775-4.125-2.325-5.675C16.125 4.775 14.233 4 12 4c-2.233 0-4.125.775-5.675 2.325C4.775 7.875 4 9.767 4 12c0 2.233.775 4.125 2.325 5.675C7.875 19.225 9.767 20 12 20z"
          fill={fill}
        />
      </G>
    </Svg>
  );
};

export default DisabledIcon;
