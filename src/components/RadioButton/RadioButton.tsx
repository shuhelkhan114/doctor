import Block from '@components/Block/Block';
import React from 'react';

interface RadioButtonProps {
  selected?: boolean;
}

const RadioButton: React.FC<RadioButtonProps> = (props) => {
  const { selected } = props;

  return (
    <Block
      bW={2}
      width={24}
      height={24}
      rounded="6xl"
      align="center"
      justify="center"
      bC={selected ? 'mainBlue' : 'dark'}>
      {selected && <Block width={12} height={12} bgColor="mainBlue" rounded="6xl" />}
    </Block>
  );
};

export default RadioButton;
