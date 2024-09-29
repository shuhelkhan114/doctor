import React, { useState } from 'react';
import { Image } from 'react-native';

import Block from '@components/Block/Block';
import OnboardingButton from '@components/OnboardingButton/OnboardingButton';
import Typography from '@components/Typography/Typography';
import { getSize } from '@core/utils/responsive';
import { FHIRDoctor } from '@typings/api-responses/fhir/doctor';

type ConfirmationStatus = 'YES' | 'NO' | 'UNDETERMINED';

interface DoctorConfirmationProps {
  doctor: FHIRDoctor;
  onConfirm?: () => void;
  onCancel?: () => void;
  closeModal?: () => void;
}

const DoctorConfirmation: React.FC<DoctorConfirmationProps> = (props) => {
  const { doctor, onConfirm, onCancel, closeModal } = props;

  const [confirmed, setConfirmed] = useState<ConfirmationStatus>();

  const handleConfirm = () => {
    setConfirmed('YES');
    setTimeout(() => {
      onConfirm?.();
      closeModal?.();
    }, 500);
  };

  const handleCancel = () => {
    setConfirmed('NO');
    setTimeout(() => {
      onCancel?.();
      closeModal?.();
    }, 500);
  };

  return (
    <Block>
      <Typography variation="title3">Are you still seeing this doctor?</Typography>

      <Block flexDirection="row" mT="xxl" align="center">
        <Image
          source={{ uri: doctor?.imageUrl }}
          style={{
            height: getSize(56),
            width: getSize(56),
            borderRadius: 56,
          }}
        />
        <Block mL="xxl">
          <Typography maxWidth="90%" numberOfLines={1} variation="title3">
            {doctor?.name}
          </Typography>
          <Typography numberOfLines={1} variation="description1" color="dark">
            {doctor?.speciality}
          </Typography>
        </Block>
      </Block>

      <Block mT="5xl" flexDirection="row" justify="space-between">
        <OnboardingButton
          mR="xl"
          title="YES"
          selected={confirmed === 'YES'}
          onPress={handleConfirm}
        />

        <OnboardingButton title="NO" selected={confirmed === 'NO'} onPress={handleCancel} />
      </Block>
    </Block>
  );
};

export default DoctorConfirmation;
