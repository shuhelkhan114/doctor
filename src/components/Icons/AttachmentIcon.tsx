import useAppTheme from '@hooks/useTheme';
import { SVGIconProps } from '@typings/common';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const AttachmentIcon: React.FC<SVGIconProps> = (props) => {
  const theme = useAppTheme();
  const { fill = theme.colors.dark } = props;
  return (
    <Svg width={16} height={17} fill="none" {...props}>
      <Path
        d="M4.967 12.166c-1.011 0-1.87-.358-2.575-1.075A3.56 3.56 0 0 1 1.333 8.5c0-1.011.348-1.875 1.042-2.592.694-.717 1.547-1.075 2.558-1.075H12.1a2.46 2.46 0 0 1 1.817.758c.5.506.75 1.114.75 1.825 0 .711-.25 1.32-.75 1.825A2.46 2.46 0 0 1 12.1 10H5.517c-.423 0-.78-.145-1.075-.434A1.436 1.436 0 0 1 4 8.5c0-.423.153-.778.458-1.067C4.764 7.144 5.128 7 5.55 7h6.55v.666H5.533a.861.861 0 0 0-.608.242.779.779 0 0 0-.258.592c0 .233.083.43.25.591a.833.833 0 0 0 .6.242H12.1c.533 0 .983-.186 1.35-.558.367-.373.55-.825.55-1.359 0-.533-.183-.986-.55-1.358A1.821 1.821 0 0 0 12.1 5.5H4.9c-.811 0-1.497.294-2.058.883A2.96 2.96 0 0 0 2 8.5c0 .833.286 1.541.858 2.125a2.82 2.82 0 0 0 2.092.875h7.15v.666H4.967Z"
        fill={fill}
      />
    </Svg>
  );
};

export default AttachmentIcon;
