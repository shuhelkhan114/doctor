import React, { useEffect, useState } from 'react';

import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import Typography from '@components/Typography/Typography';
import UserAvatar from '@components/UserAvatar/UserAvatar';
import { useChat } from '@context/ChatContext';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import API from '@core/services';
import { capitalize } from '@core/utils/common';
import { CareTeamStackScreens } from '@navigation/Patient/CareTeamStack';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { refetchPatient } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { Doctor } from '@typings/model/doctor';
import { useMutation } from 'react-query';

interface DoctorDetailProps {
  doctor: Doctor;
  closeModal: (visible: false) => void;
}

const DoctorDetail: React.FC<DoctorDetailProps> = (props) => {
  const { doctor, closeModal } = props;

  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const [isOnline, setIsOnline] = useState(false);
  const { setChannel } = useChat();

  const { isLoading: updatingProfile, mutate: updateProfile } = useMutation(
    API.patient.auth.updateProfile,
    {
      onSuccess() {
        toast.success('Updated primary doctor successfully');
        dispatch(refetchPatient());
        closeModal?.(false);
      },
      onError() {
        toast.error('Unable to update primary doctor, please try again!');
      },
    }
  );

  const navigation =
    useNavigation<StackNavigationProp<CareTeamStackScreens, Screens.CareTeamScreen>>();

  useEffect(() => {
    API.stream.getUserById(doctor.id).then((res) => {
      setIsOnline(!!res.online);
    });
  }, []);

  const handleSendMessage = async () => {
    if (auth.patient) {
      navigation.navigate(Screens.ChatScreen, {
        name: `${doctor.first_name} ${doctor.last_name}`,
        imageUrls: [doctor.doctor_image],
      });
      const channel = await API.stream.getOrCreateChannel([auth.patient?.id, doctor.id]);
      setChannel(channel);
      closeModal?.(false);
    }
  };

  const handleUpdatePrimaryDoctor = async () => {
    updateProfile({ primary_doctor_id: doctor.id });
  };

  const isAlreadyPrimaryDoctor = auth.patient?.primary_doctor_id === doctor.id;

  return (
    <Block pT="xs">
      <Block flexDirection="row" align="center" pB="md" bC="lightest" bBW={1}>
        <UserAvatar mR="xl" isOnline={isOnline} uri={doctor?.doctor_image} size="large" />
        <Block mR="auto">
          <Typography color="secondaryBlue" variation="title3">
            {doctor?.first_name} {doctor?.last_name}
          </Typography>

          <Typography color="dark" variation="description1">
            {doctor?.speciality}
          </Typography>
        </Block>
      </Block>

      <Block flexDirection="row" align="center" mT="xxxl">
        <Block flex1>
          <Block flexDirection="row" justify="space-between">
            <Typography color="darkest" variation="title3">
              Chat Availability
            </Typography>
          </Block>

          {doctor?.chat_availibility.map((day) => {
            return (
              <Block key={day.day} flexDirection="row" mT="md">
                {day.durations.map((duration, index) => {
                  return (
                    <Typography key={index.toString()} variation="description1" color="dark">
                      {duration.start_time.hours}
                      {duration.start_time.window}-{duration.end_time.hours}
                      {duration.end_time.window}.
                    </Typography>
                  );
                })}
                <Typography color="dark" variation="description1" mL="md">
                  {' '}
                  {capitalize(day.day.slice(0, 3))}
                </Typography>
              </Block>
            );
          })}
        </Block>
      </Block>

      <Block mT="5xl">
        <Button title="Send message" onPress={handleSendMessage} />
      </Block>

      {!isAlreadyPrimaryDoctor && (
        <Block mT="xxxl">
          <Button
            loading={updatingProfile}
            variation="primary-light"
            disabled={isAlreadyPrimaryDoctor}
            onPress={handleUpdatePrimaryDoctor}
            title="Make this my primary doctor"
          />
        </Block>
      )}
    </Block>
  );
};

export default DoctorDetail;
