import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import DropDown from '@components/DropDown/DropDown';
import ErrorText from '@components/ErrorText/ErrorText';
import Typography from '@components/Typography/Typography';
import { doctorAvailabilityOptions } from '@core/config/dropdownOptions';
import toast from '@core/lib/toast';
import API from '@core/services';
import { refetchDoctor } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { DoctorAvailability } from '@typings/model/doctor';
import React, { useState } from 'react';
import { useMutation } from 'react-query';

interface AvailabilityDetailProps {
  closeModal?: (close: false) => void;
}

const AvailabilityDetail: React.FC<AvailabilityDetailProps> = (props) => {
  const { closeModal } = props;
  const doctor = useAppSelector((state) => state.auth.doctor);

  const [availability, setAvailability] = useState<DoctorAvailability>(() => doctor?.availablity!);

  const dispatch = useAppDispatch();

  const {
    isLoading,
    error,
    mutate: updateProfile,
  } = useMutation(API.doctor.auth.updateProfile, {
    onSuccess() {
      dispatch(refetchDoctor());
      toast.success('Availability updated successfully!');
      closeModal?.(false);
    },
    onError() {
      toast.error('Unable to update availability, please try again!');
    },
  });

  const handleSave = () => {
    updateProfile({ availablity: availability });
  };

  return (
    <Block>
      <Typography variation="title2Bolder">New Patients</Typography>
      <DropDown
        mT="xxl"
        value={availability}
        options={doctorAvailabilityOptions}
        placeholder="Accepting new patients?"
        onSelect={(value) => setAvailability(value as DoctorAvailability)}
      />
      <ErrorText error={error} />
      <Button loading={isLoading} mT="7xl" title="Save" onPress={handleSave} />
    </Block>
  );
};

export default AvailabilityDetail;
