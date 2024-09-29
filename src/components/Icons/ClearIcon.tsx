import useAppTheme from '@hooks/useTheme';
import { SVGIconProps } from '@typings/common';
import * as React from 'react';
import Svg, { G, Mask, Path } from 'react-native-svg';

const ClearIcon: React.FC<SVGIconProps> = (props) => {
  const theme = useAppTheme();
  const { fill = theme.colors.mainBlue } = props;

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Mask id="a" maskUnits="userSpaceOnUse" x={0} y={0} width={24} height={24}>
        <Path fill="#D9D9D9" d="M0 0H24V24H0z" />
      </Mask>
      <G mask="url(#a)">
        <Path
          d="M11.05 15.3l2.6-2.6 2.6 2.6.7-.7-2.6-2.6 2.6-2.6-.7-.7-2.6 2.6-2.6-2.6-.7.7 2.6 2.6-2.6 2.6.7.7zM4.125 12L7.7 6.925c.2-.283.458-.508.775-.675C8.792 6.083 9.133 6 9.5 6h8.775c.45 0 .83.158 1.138.475.308.317.462.7.462 1.15v8.75c0 .45-.154.833-.462 1.15a1.527 1.527 0 01-1.138.475H9.5c-.367 0-.704-.087-1.012-.262a2.47 2.47 0 01-.788-.713L4.125 12zm1.2 0l3.225 4.5c.1.133.233.25.4.35.167.1.35.15.55.15h8.775c.15 0 .288-.063.413-.188a.599.599 0 00.187-.437v-8.75a.599.599 0 00-.187-.437.574.574 0 00-.413-.188H9.5c-.2 0-.383.05-.55.15-.167.1-.3.217-.4.35L5.325 12z"
          fill={fill}
        />
      </G>
    </Svg>
  );
};

export default ClearIcon;
