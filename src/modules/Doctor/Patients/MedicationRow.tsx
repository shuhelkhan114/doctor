import Block, { BlockProps } from '@components/Block/Block';
import Icon from '@components/Icon/Icon';
import WarningIcon from '@components/Icons/WarningIcon';
import Typography from '@components/Typography/Typography';
import { getTimeAgo } from '@core/utils/date';
import { Medication, MedicationStatus, MedicationStatusReason } from '@typings/model/medication';

interface MedicationRowProps extends BlockProps {
  medication: Medication;
}

const MedicationRow: React.FC<MedicationRowProps> = (props) => {
  const { medication, ...restProps } = props;
  const { name, dosage, status, status_reason, status_updated_by, updated_at } = medication;

  let statusContent: React.ReactNode = null;
  let statusIcon: React.ReactNode = null;

  if (status === MedicationStatus.NOT_CONFIRMED) {
    statusContent = 'Please confirm medication';
    statusIcon = <WarningIcon />;
  } else if (status === MedicationStatus.CONFIRMED) {
    statusContent = `Confirmed by ${status_updated_by.first_name}`;
    statusIcon = <Icon name="stamp" size={16} />;
  } else if (status === MedicationStatus.DELETED) {
    if (status_reason === MedicationStatusReason.DELETED_BY_PATIENT) {
      statusContent = 'Deleted by patient. Action necessary';
    } else if (status_reason === MedicationStatusReason.DELETED_BY_DOCTOR) {
      statusContent = `Deleted by ${status_updated_by.first_name}}`;
    } else {
      statusContent = 'Deleted';
    }

    statusIcon = <WarningIcon />;
  } else {
    statusContent = 'Unknown';
    statusIcon = <WarningIcon />;
  }

  return (
    <Block pV="md" flexDirection="row" align="center" justify="space-between" {...restProps}>
      <Block mR="auto" flex1>
        <Typography variation="title3">{name}</Typography>

        <Typography variation="description2" color="dark" mV="sm">
          {dosage}
        </Typography>

        <Block flexDirection="row" align="center">
          {status && (
            <Block flexDirection="row" align="center" mR="xxxl">
              {statusIcon}
              <Typography mL="xs" variation="description2" color="dark">
                {statusContent}
              </Typography>
            </Block>
          )}

          {updated_at && (
            <Block flexDirection="row" align="center">
              <Icon name="calendar" size={16} />
              <Typography mL="xs" variation="description2" color="dark">
                {getTimeAgo(new Date(updated_at))}
              </Typography>
            </Block>
          )}
        </Block>
      </Block>
      <Block>
        <Icon name="three-dots" size={24} />
      </Block>
    </Block>
  );
};

export default MedicationRow;
