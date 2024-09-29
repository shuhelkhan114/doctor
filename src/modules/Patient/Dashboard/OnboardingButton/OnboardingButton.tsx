import Block, { BlockProps } from '@components/Block/Block';
import Typography from '@components/Typography/Typography';
import React from 'react';

interface OnboardingButtonProps extends BlockProps {
  title: string;
  icon: React.ReactNode;
}

const OnboardingButton: React.FC<OnboardingButtonProps> = (props) => {
  const { title, icon, ...restProps } = props;

  return (
    <Block
      mT="xl"
      pH="xxxl"
      pV="xxxl"
      flexDirection="row"
      rounded="xxl"
      bW={1}
      align="center"
      bC="lightest"
      bgColor="white"
      shadow="sm"
      {...restProps}>
      {icon}
      <Typography mL="xl" variation="title3Bolder">
        {title}
      </Typography>
    </Block>
  );
};

export default OnboardingButton;
