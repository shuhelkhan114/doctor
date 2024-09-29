import Block, { BlockProps } from '@components/Block/Block';
import Typography from '@components/Typography/Typography';
import React from 'react';

interface TrusteesProps extends BlockProps {}

const Trustees: React.FC<TrusteesProps> = (props) => {
  const { ...restProps } = props;

  return (
    <Block {...restProps}>
      <Typography color="black" mB="md" variation="title2">
        People with access
      </Typography>

      <Typography>Access granted to no-one.</Typography>
    </Block>
  );
};

export default Trustees;
