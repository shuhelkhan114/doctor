import useAppTheme from '@hooks/useTheme';
import { SVGIconProps } from '@typings/common';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const CheckIcon: React.FC<SVGIconProps> = (props) => {
  const theme = useAppTheme();
  const { fill = theme.colors.secondaryBlue } = props;
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M10.55 15.9l6.4-6.4-.7-.7-5.7 5.7-2.85-2.85-.7.7 3.55 3.55zM12 21c-1.25 0-2.42-.237-3.512-.712a9.142 9.142 0 01-2.85-1.926 9.143 9.143 0 01-1.926-2.85A8.709 8.709 0 013 12c0-1.25.237-2.421.712-3.513a9.159 9.159 0 011.926-2.85 9.152 9.152 0 012.85-1.925A8.709 8.709 0 0112 3c1.25 0 2.421.237 3.513.712a9.168 9.168 0 012.85 1.925 9.167 9.167 0 011.925 2.85A8.715 8.715 0 0121 12c0 1.25-.237 2.42-.712 3.512a9.151 9.151 0 01-1.925 2.85 9.158 9.158 0 01-2.85 1.926A8.715 8.715 0 0112 21zm0-1c2.233 0 4.125-.775 5.675-2.325C19.225 16.125 20 14.233 20 12c0-2.233-.775-4.125-2.325-5.675C16.125 4.775 14.233 4 12 4c-2.233 0-4.125.775-5.675 2.325C4.775 7.875 4 9.767 4 12c0 2.233.775 4.125 2.325 5.675C7.875 19.225 9.767 20 12 20z"
        fill={fill}
      />
    </Svg>
  );
};

export default CheckIcon;
