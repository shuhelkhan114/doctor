import Block, { BlockProps } from '@components/Block/Block';
import { getSize } from '@core/utils/responsive';
import useAppTheme from '@hooks/useTheme';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

interface StepIndicatorProps extends BlockProps {
  steps: number;
  activeStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = (props) => {
  const { activeStep, steps, ...restProps } = props;

  const theme = useAppTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        stepIndicator: {
          flexDirection: 'row',
          justifyContent: 'center',
        },
        activeStep: {
          width: getSize(30),
          height: getSize(5),
          borderRadius: 8,
          backgroundColor: theme.colors.accent,
          marginRight: theme.spacing.sm,
        },
        inactiveStep: {
          width: getSize(7),
          height: getSize(5),
          borderRadius: 8,
          marginRight: theme.spacing.sm,
          backgroundColor: theme.colors.accent + '66',
        },
      }),
    []
  );

  return (
    <Block flexDirection="row" justify="center" {...restProps}>
      {new Array(steps).fill(0).map((_, index) => (
        <View
          key={index.toString()}
          style={activeStep === index + 1 ? styles.activeStep : styles.inactiveStep}
        />
      ))}
    </Block>
  );
};

export default StepIndicator;
