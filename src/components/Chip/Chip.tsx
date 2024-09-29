import Block, { BlockProps } from '@components/Block/Block';
import Typography from '@components/Typography/Typography';
import { colors } from '@core/styles/theme';
import React from 'react';

interface ChipProps extends BlockProps {
  selected?: boolean;
  onPress?: () => void;
  selectedBgColor?: keyof typeof colors;
  selectedTextColor?: keyof typeof colors;
  text: string;
}

const Chip: React.FC<ChipProps> = (props) => {
  const { text, selected, onPress, selectedBgColor, selectedTextColor, ...restProps } = props;

  const handlePress = () => {
    onPress?.();
  };

  return (
    <Block
      pV="md"
      pH="xl"
      bW={1}
      rounded="4xl"
      bgColor={selected ? selectedBgColor || 'mainBlue' : 'white'}
      bC={selected ? selectedBgColor || 'mainBlue' : 'lighter'}
      mT="md"
      onPress={handlePress}
      {...restProps}>
      <Typography variation="description2" color={selected ? selectedTextColor || 'white' : 'text'}>
        {text}
      </Typography>
    </Block>
  );
};

export default Chip;
