import useAppTheme from '@hooks/useTheme';
import { SVGIconProps } from '@typings/common';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const TrashIcon: React.FC<SVGIconProps> = (props) => {
  const theme = useAppTheme();
  const { fill = theme.colors.negativeAction } = props;

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M7.625 20c-.45 0-.833-.159-1.15-.475A1.566 1.566 0 016 18.375V6H5V5h4v-.775h6V5h4v1h-1v12.375c0 .466-.154.854-.462 1.163-.309.308-.696.462-1.163.462h-8.75zM17 6H7v12.375a.61.61 0 00.175.45.609.609 0 00.45.175h8.75a.597.597 0 00.437-.188.597.597 0 00.188-.437V6zM9.8 17h1V8h-1v9zm3.4 0h1V8h-1v9zM7 6v13V6z"
        fill={fill}
      />
    </Svg>
  );
};

export default TrashIcon;
