import Block from '@components/Block/Block';
import OnboardingButton from '@components/OnboardingButton/OnboardingButton';
import Typography from '@components/Typography/Typography';
import { FHIRHealthIssue } from '@typings/api-responses/fhir/healthIssue';
import React, { useState } from 'react';

type TakingStatus = 'YES' | 'NO' | 'UNDETERMINED';

interface HealthIssueConfirmationProps {
  healthIssue: FHIRHealthIssue;
  onConfirm?: () => void;
  onCancel?: () => void;
  closeModal?: () => void;
}

const HealthIssueConfirmation: React.FC<HealthIssueConfirmationProps> = (props) => {
  const { healthIssue, onConfirm, onCancel, closeModal } = props;
  const [taking, setTaking] = useState<TakingStatus>();

  const handleConfirm = () => {
    setTaking('YES');
    setTimeout(() => {
      onConfirm?.();
      closeModal?.();
    }, 500);
  };

  const handleCancel = () => {
    setTaking('NO');
    setTimeout(() => {
      onCancel?.();
      closeModal?.();
    }, 500);
  };

  return (
    <Block>
      <Typography variation="title2" mT="xxl">
        {healthIssue?.name}
      </Typography>

      <Typography variation="title3" mT="xxxl">
        Is this health issue still present?
      </Typography>

      <Block mT="5xl" flexDirection="row" justify="space-between">
        <OnboardingButton mR="xl" title="YES" selected={taking === 'YES'} onPress={handleConfirm} />

        <OnboardingButton title="NO" selected={taking === 'NO'} onPress={handleCancel} />
      </Block>
    </Block>
  );
};

export default HealthIssueConfirmation;
