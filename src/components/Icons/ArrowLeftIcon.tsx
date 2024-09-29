import useAppTheme from '@hooks/useTheme';
import { SVGIconProps } from '@typings/common';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const ArrowLeftIcon: React.FC<SVGIconProps> = (props) => {
  const theme = useAppTheme();
  const { fill = theme.colors.secondaryBlue } = props;

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fill={fill}
        d="M12 19.225L4.775 12 12 4.775l.725.7L6.7 11.5h12.525v1H6.7l6.025 6.025-.725.7z"
      />
    </Svg>
  );
};

export default ArrowLeftIcon;
