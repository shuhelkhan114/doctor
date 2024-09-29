import { useCallback } from 'react';

import Block from '@components/Block/Block';
import Typography from '@components/Typography/Typography';

interface MedicationSearchItemProps {
  name: string;
  status: string;
  bottomBorder?: boolean;
  onPress?: () => void;
}

// TODO: Fix `any` type
const statusColorMapping: any = {
  Approved: 'positiveAction',
  Experimental: 'negativeAction',
  Illicit: 'dark',
};

const MedicationSearchItem: React.FC<MedicationSearchItemProps> = (props) => {
  const { name, status, bottomBorder, onPress } = props;

  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  return (
    <Block pV="md" onPress={handlePress} {...(bottomBorder && { bBW: 1, bC: 'lightest' })}>
      <Typography variation="title3">{name}</Typography>
      <Typography variation="description2" color={statusColorMapping[status]}>
        {status}
      </Typography>
    </Block>
  );
};

export default MedicationSearchItem;
