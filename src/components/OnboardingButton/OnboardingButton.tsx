import Block, { BlockProps } from '@components/Block/Block';
import Typography from '@components/Typography/Typography';
import React from 'react';

interface OnboardingButtonProps extends BlockProps {
  title?: string;
  selected?: boolean;
}

// TODO: Refactor
const OnboardingButton: React.FC<OnboardingButtonProps> = (props) => {
  const { title, selected, ...restProps } = props;

  return (
    <Block
      flex1
      bW={1}
      pV="xxl"
      rounded="6xl"
      shadow="sm"
      bgColor="white"
      bC={selected ? 'positiveAction' : 'transparent'}
      {...restProps}>
      <Typography center variation="description1Bolder">
        {title}
      </Typography>
    </Block>
  );
};

export default OnboardingButton;
