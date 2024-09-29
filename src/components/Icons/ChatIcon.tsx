import useAppTheme from '@hooks/useTheme';
import { SVGIconProps } from '@typings/common';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const ChatIcon: React.FC<SVGIconProps> = (props) => {
  const theme = useAppTheme();
  const { fill = theme.colors.white } = props;

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M3 20.075V4.625c0-.467.154-.854.463-1.163C3.771 3.154 4.158 3 4.625 3h14.75c.467 0 .854.154 1.163.462.308.309.462.696.462 1.163v10.75c0 .467-.154.854-.462 1.163-.309.308-.696.462-1.163.462h-13.3L3 20.075zm1-2.425L5.65 16h13.725a.61.61 0 00.45-.175.61.61 0 00.175-.45V4.625a.609.609 0 00-.175-.45.61.61 0 00-.45-.175H4.625a.61.61 0 00-.45.175.61.61 0 00-.175.45V17.65zM4 4.625V4v13.65V4.625z"
        fill={fill}
      />
    </Svg>
  );
};

export default ChatIcon;
