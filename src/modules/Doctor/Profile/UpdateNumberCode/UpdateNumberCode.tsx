import React, { useState } from 'react';

import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import ErrorText from '@components/ErrorText/ErrorText';
import Input from '@components/Input/Input';
import Typography from '@components/Typography/Typography';
import toast from '@core/lib/toast';
import API from '@core/services';
import { refetchDoctor } from '@store/slices/authSlice';
import { useAppDispatch } from '@store/store';
import { useMutation } from 'react-query';

interface UpdateNPINumberProps {
  closeModal?: (close: false) => void;
}

const UpdateNPINumber: React.FC<UpdateNPINumberProps> = (props) => {
  const { closeModal } = props;
  const [npiNumber, setNPINumberCode] = useState('');

  const dispatch = useAppDispatch();

  const {
    isLoading,
    error,
    mutate: updateProfile,
  } = useMutation(API.doctor.auth.updateProfile, {
    onSuccess() {
      dispatch(refetchDoctor());
      toast.success('NPI number updated successfully!');
      closeModal?.(false);
    },
    onError() {
      toast.error('Unable to update NPI number, please try again!');
    },
  });

  const handleSave = () => {
    updateProfile({ npi: npiNumber });
  };

  return (
    <Block>
      <Typography variation="title2">Update NPI Code</Typography>
      <Typography>Eg. 1245319599</Typography>
      <Input
        mV="xxl"
        maxLength={10}
        value={npiNumber}
        placeholder="NPI number"
        keyboardType="number-pad"
        onChangeText={setNPINumberCode}
      />
      <Typography mB="xxl">
        The National Provider Identifier (NPI) is a Health Insurance Portability and Accountability
        Act (HIPAA) Administrative Simplification Standard
      </Typography>
      <ErrorText error={error} />
      <Button loading={isLoading} title="Save" onPress={handleSave} />
    </Block>
  );
};

export default UpdateNPINumber;
