import Block, { BlockProps } from '@components/Block/Block';
import Icon from '@components/Icon/Icon';
import Typography from '@components/Typography/Typography';
import { HealthIssue } from '@typings/model/healthIssue';

interface HealthIssueRowProps extends BlockProps {
  healthIssue: HealthIssue;
  hideEditIcon?: boolean;
}

const HealthIssueRow: React.FC<HealthIssueRowProps> = (props) => {
  const { healthIssue, hideEditIcon, ...restProps } = props;
  const { name } = healthIssue;

  return (
    <Block flexDirection="row" align="center" justify="space-between" pV="md" {...restProps}>
      <Block flex1>
        <Typography variation="title3">{name}</Typography>
        <Typography variation="description2" color="dark">
          {healthIssue?.doctor_notes?.length > 0
            ? `${healthIssue?.doctor_notes?.length} notes from care team`
            : 'No notes from care team'}
        </Typography>
      </Block>
      {!hideEditIcon && <Icon name="three-dots" size={24} />}
    </Block>
  );
};

export default HealthIssueRow;
