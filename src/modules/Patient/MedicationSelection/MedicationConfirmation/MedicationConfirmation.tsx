import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import Chip from '@components/Chip/Chip';
import DropDown from '@components/DropDown/DropDown';
import OnboardingButton from '@components/OnboardingButton/OnboardingButton';
import Typography from '@components/Typography/Typography';
import { medicationPricingRange } from '@core/config/app';
import { useAppSelector } from '@store/store';
import { FHIRMedication } from '@typings/api-responses/fhir/medication';
import React, { useState } from 'react';

type TakingStatus = 'YES' | 'NO' | 'UNDETERMINED';

export interface MedicationInfo {
  taking: TakingStatus;
  frequency: string;
  priceRange: string;
}

interface MedicationConfirmationProps {
  medication: FHIRMedication;
  onConfirm?: (medicationInfo: MedicationInfo) => void;
  onCancel?: () => void;
  closeModal?: () => void;
}

const MedicationConfirmation: React.FC<MedicationConfirmationProps> = (props) => {
  const { medication, onConfirm, onCancel, closeModal } = props;
  const [taking, setTaking] = useState<TakingStatus | null>(null);
  const [frequency, setFrequency] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string | null>(null);

  const frequencies = useAppSelector((state) => state.auth.config.medication_frequecny);

  const handleConfirm = () => {
    onConfirm?.({ taking: taking!, frequency: frequency!, priceRange: priceRange! });
    closeModal?.();
  };

  const handleCancel = () => {
    setTaking('NO');
    setTimeout(() => {
      onCancel?.();
      closeModal?.();
    }, 500);
  };

  const frequencyOptions = frequencies.map((freq) => ({
    label: freq.value,
    value: freq.value,
  }));

  const renderDropDownTitle = () => (
    <Typography variation="title3">
      How many times a day do you take{' '}
      <Typography variation="title3Bolder">
        {medication?.name} {medication?.dosageAmount} {medication?.dosageUnit}
      </Typography>
    </Typography>
  );

  return (
    <Block>
      <Typography variation="title3">Are you still taking this medication?</Typography>

      <Typography variation="title2" mT="xxl">
        {medication?.name}
      </Typography>

      <Typography variation="description1" color="dark">
        {medication?.dosageAmount} {medication?.dosageUnit}
      </Typography>

      <Block mT="5xl" flexDirection="row" justify="space-between">
        <OnboardingButton
          mR="xl"
          title="YES"
          selected={taking === 'YES'}
          onPress={() => setTaking('YES')}
        />
        <OnboardingButton title="NO" selected={taking === 'NO'} onPress={handleCancel} />
      </Block>

      {taking === 'YES' && (
        <Block mT="xxxl">
          <Typography mB="xxl">How often do you take it?</Typography>
          <DropDown
            value={frequency!}
            placeholder="Select"
            onSelect={setFrequency}
            options={frequencyOptions}
            renderTitle={renderDropDownTitle}
          />
        </Block>
      )}

      {frequency && (
        <>
          <Typography mB="xl" mT="xxxl">
            How expensive do you find it?
          </Typography>
          <Block flexDirection="row" justify="space-between" style={{ flexWrap: 'wrap' }}>
            {medicationPricingRange.map((p) => (
              <Chip key={p} text={p} onPress={() => setPriceRange(p)} selected={priceRange === p} />
            ))}
          </Block>
        </>
      )}

      {priceRange && (
        <Block mT="4xl">
          <Button onPress={handleConfirm} title="Confirm" />
        </Block>
      )}
    </Block>
  );
};

export default MedicationConfirmation;
