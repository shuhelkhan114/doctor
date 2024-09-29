import Checkbox from 'expo-checkbox';

import Block, { BlockProps } from '@components/Block/Block';
import Icon from '@components/Icon/Icon';
import DisabledIcon from '@components/Icons/DisabledIcon';
import Typography from '@components/Typography/Typography';
import useAppTheme from '@hooks/useTheme';
import { EntityStatus } from '@store/slices/patientOnboardingSlice';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

interface MedicationRowProps extends BlockProps {
  name: string;
  status: EntityStatus;
  dosageUnit: string;
  dosageAmount: number;
  onPress: () => void;
}

const MedicationRow: React.FC<MedicationRowProps> = (props) => {
  const { name, dosageUnit, dosageAmount, status, onPress, ...restProps } = props;

  const theme = useAppTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        checkbox: {
          width: 24,
          height: 24,
          borderWidth: 1,
          borderColor: theme.colors.secondaryBlue,
        },
      }),
    []
  );

  let asideItem: React.ReactNode;

  if (status === 'undetermined') {
    asideItem = <Checkbox style={styles.checkbox} onValueChange={onPress} onChange={onPress} />;
  } else if (status === 'confirmed') {
    asideItem = <Icon name="tick" size={24} />;
  } else if (status === 'rejected') {
    asideItem = <DisabledIcon />;
  } else {
    asideItem = null;
  }

  return (
    <Block
      pV="md"
      align="center"
      onPress={onPress}
      flexDirection="row"
      justify="space-between"
      {...restProps}>
      <Block maxWidth="90%">
        <Typography variation="title2">{name}</Typography>
        <Typography variation="description1" color="dark">
          {dosageAmount} {dosageUnit}
        </Typography>
      </Block>
      {asideItem}
    </Block>
  );
};

export default MedicationRow;
