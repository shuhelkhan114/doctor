import useAppTheme from '@hooks/useTheme';
import { SVGIconProps } from '@typings/common';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const ThreeDotsVertical: React.FC<SVGIconProps> = (props) => {
  const theme = useAppTheme();
  const { fill = theme.colors.secondaryBlue } = props;

  return (
    <Svg width={24} height={24} fill="none" {...props}>
      <Path
        d="M12 19.275c-.417 0-.77-.146-1.062-.438a1.444 1.444 0 0 1-.438-1.062c0-.417.146-.771.438-1.063A1.446 1.446 0 0 1 12 16.275c.417 0 .77.145 1.062.437.292.292.438.646.438 1.063 0 .416-.146.77-.438 1.062a1.444 1.444 0 0 1-1.062.438Zm0-5.775c-.417 0-.77-.146-1.062-.438A1.444 1.444 0 0 1 10.5 12c0-.417.146-.771.438-1.062A1.444 1.444 0 0 1 12 10.5c.417 0 .77.146 1.062.438.292.29.438.645.438 1.062 0 .416-.146.77-.438 1.062A1.444 1.444 0 0 1 12 13.5Zm0-5.775c-.417 0-.77-.146-1.062-.438a1.444 1.444 0 0 1-.438-1.062c0-.417.146-.771.438-1.063A1.446 1.446 0 0 1 12 4.725c.417 0 .77.145 1.062.437.292.292.438.646.438 1.063 0 .416-.146.77-.438 1.062A1.444 1.444 0 0 1 12 7.725Z"
        fill={fill}
      />
    </Svg>
  );
};

export default ThreeDotsVertical;
