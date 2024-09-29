import Block, { BlockProps } from '@components/Block/Block';
import React from 'react';

interface ModalHandleProps extends BlockProps {}

const ModalHandle: React.FC<ModalHandleProps> = (props) => {
  return (
    <Block align="center" mT="xxl" mB="xxxl" {...props}>
      <Block width={48} height={4} bgColor="lighter" rounded="6xl" />
    </Block>
  );
};

export default ModalHandle;
