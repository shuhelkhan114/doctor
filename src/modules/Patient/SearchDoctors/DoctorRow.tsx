import Block from '@components/Block/Block';
import Icon from '@components/Icon/Icon';
import Typography from '@components/Typography/Typography';
import toast from '@core/lib/toast';
import API from '@core/services';
import { getSize } from '@core/utils/responsive';
import { Doctor, DoctorAvailability } from '@typings/model/doctor';
import React, { useState } from 'react';
import { ActivityIndicator, Image } from 'react-native';
import { useMutation } from 'react-query';

interface DoctorRowProps {
  physician: Doctor;
  sendRequest?: boolean;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}

const DoctorRow: React.FC<DoctorRowProps> = (props) => {
  const { physician, sendRequest: shouldSendRequest, selected, disabled, onPress } = props;
  const [added, setAdded] = useState(false);
  const { isLoading, mutateAsync: sendRequest } = useMutation(API.patient.request.sendRequest);

  const handlePress = async () => {
    if (shouldSendRequest) {
      if (!isLoading) {
        if (physician.availablity !== DoctorAvailability.ACCEPTING) {
          toast.error(
            `${physician.first_name} ${physician.last_name} is not currently accepting requests!`
          );
        } else {
          await sendRequest(physician.id);
          setAdded(true);
          toast.success(`Request sent to ${physician.first_name} ${physician.last_name}`);
        }
      }
    } else {
      onPress?.();
    }
  };

  return (
    <Block flexDirection="row" pV="xl" onPress={handlePress}>
      <Image
        source={{
          uri: physician?.doctor_image,
        }}
        style={{
          height: getSize(56),
          width: getSize(56),
          borderRadius: 56,
        }}
      />
      <Block mL="xxl" style={{ marginRight: 'auto' }} justify="center">
        <Typography variation="title3">
          {physician?.first_name + ' ' + physician?.last_name}
        </Typography>
        <Typography numberOfLines={1} variation="description1" color="dark">
          {physician?.speciality}
        </Typography>
        {physician.office_address && (
          <Typography numberOfLines={1} variation="description1" color="dark">
            {/* TODO: Fix this */}
            {/* @ts-ignore */}
            {physician?.address}
          </Typography>
        )}
      </Block>
      {!disabled && (
        <Block>
          <Typography variation="description2">{physician.personal_code}</Typography>
          <Block
            style={{ width: getSize(24), height: getSize(24) }}
            justify="center"
            align="center"
            onPress={handlePress}>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <Icon name={added || selected ? 'checked' : 'user-add'} size={getSize(24)} />
            )}
          </Block>
        </Block>
      )}
    </Block>
  );
};

export default DoctorRow;
