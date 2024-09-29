import Block, { BlockProps } from '@components/Block/Block';
import Icon from '@components/Icon/Icon';
import Image from '@components/Image/Image';
import Typography from '@components/Typography/Typography';
import { getTimeAgo } from '@core/utils/date';
import { useAppSelector } from '@store/store';
import { Medication } from '@typings/model/medication';

interface MedicationHistoryRowProps extends BlockProps {
  history: Medication['history'][0];
}

const MedicationHistoryRow: React.FC<MedicationHistoryRowProps> = (props) => {
  const { history, ...restProps } = props;
  const { status, status_reason, status_updated_by } = history;

  const auth = useAppSelector((state) => state.auth);

  return (
    <Block flexDirection="row" pV="md" align="center" {...restProps}>
      <Image size={56} circular uri={status_updated_by.image} />
      <Block mL="xl">
        <Typography variation="title3">
          {status_updated_by.id === auth.doctor?.id
            ? 'You'
            : `${status_updated_by.first_name} ${status_updated_by.last_name}`}
        </Typography>
        <Block flexDirection="row" align="center">
          <Icon name="stamp" size={16} />
          <Typography mL="xs" variation="description1" color="dark">
            {status}
          </Typography>
        </Block>
        <Typography variation="description2" color="dark">
          {getTimeAgo(new Date(status_updated_by.timestamp * 1000))}
        </Typography>
      </Block>
    </Block>
  );
};

export default MedicationHistoryRow;
