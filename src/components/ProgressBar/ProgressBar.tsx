import Block, { BlockProps } from '@components/Block/Block';
import React from 'react';

interface ProgressBarProps extends BlockProps {
  /** Current Progress Percentage, should be between 0 and 1. eg. 0.4
   * Default is 0
   */
  currentValue: number;
  theme?: 'light' | 'dark';
}

const ProgressBar: React.FC<ProgressBarProps> = (props) => {
  const { currentValue = 0, theme = 'light', ...restProps } = props;

  return (
    <Block
      height={5}
      rounded="xxl"
      bgColor={theme === 'light' ? 'light' : 'lighter'}
      {...restProps}>
      <Block
        absolute
        top={0}
        left={0}
        height={5}
        bgColor={theme === 'light' ? 'mainBlue' : 'mainBlue'}
        rounded="xxl"
        width={`${currentValue * 100}%`}
      />
    </Block>
  );
};

export default ProgressBar;
