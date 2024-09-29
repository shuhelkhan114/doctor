import useAppTheme from '@hooks/useTheme';
import { SVGIconProps } from '@typings/common';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const WarningIcon: React.FC<SVGIconProps> = (props) => {
  const theme = useAppTheme();
  const { fill = theme.colors.secondaryBlue } = props;

  return (
    <Svg width={16} height={17} viewBox="0 0 16 17" fill="none" {...props}>
      <Path
        d="M8 14.35a1.075 1.075 0 01-.75-.317L2.467 9.25c-.1-.1-.178-.217-.234-.35a1.033 1.033 0 01-.083-.4 1.074 1.074 0 01.317-.75L7.25 2.967a.887.887 0 01.35-.242c.133-.05.267-.075.4-.075s.267.025.4.075c.133.05.25.13.35.242l4.783 4.783c.112.1.192.217.242.35.05.133.075.267.075.4s-.025.267-.075.4a.888.888 0 01-.242.35L8.75 14.033c-.1.1-.217.178-.35.234a1.034 1.034 0 01-.4.083zm.3-.8l4.75-4.75c.067-.067.1-.167.1-.3 0-.133-.033-.233-.1-.3L8.3 3.45c-.067-.067-.167-.1-.3-.1-.133 0-.233.033-.3.1L2.95 8.2c-.067.067-.1.167-.1.3 0 .133.033.233.1.3l4.75 4.75c.067.067.167.1.3.1.133 0 .233-.033.3-.1zm-.633-4.267h.666V5.8h-.666v3.483zM8 10.767a.415.415 0 00.292-.117.374.374 0 00.125-.283A.415.415 0 008 9.95a.415.415 0 00-.417.417c0 .11.042.205.125.283.084.078.18.117.292.117z"
        fill={fill}
      />
    </Svg>
  );
};

export default WarningIcon;
