import Block from '@components/Block/Block';
import Typography from '@components/Typography/Typography';
import { MedicationItem } from '@typings/patient';

interface MedicationListItemProps {
  medicationItem: MedicationItem;
}

const MedicationListItem: React.FC<MedicationListItemProps> = (props) => {
  const { medicationItem } = props;
  const { name, status } = medicationItem;

  return (
    <Block pV="xl">
      <Typography>{name}</Typography>
      <Typography>{status}</Typography>
    </Block>
  );
};

export default MedicationListItem;
