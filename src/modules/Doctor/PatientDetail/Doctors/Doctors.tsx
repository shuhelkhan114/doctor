import React from 'react';

import Block, { BlockProps } from '@components/Block/Block';
import Button from '@components/Button/Button';
import Typography from '@components/Typography/Typography';
import { useChat } from '@context/ChatContext';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import API from '@core/services';
import { logError } from '@core/utils/logger';
import DoctorRow from '@modules/Doctor/Patients/CareTeamRow';
import { PatientsStackScreens } from '@navigation/Doctor/PatientsStack';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppSelector } from '@store/store';
import { PatientRowData, SubscriptionPlan } from '@typings/common';
import { Doctor } from '@typings/model/doctor';

interface DoctorsProps extends BlockProps {
  patient: PatientRowData;
  currentPlan: SubscriptionPlan;
  hasSentRequest: boolean;
  doctors: Doctor[];
  onDoctorPress?: (doctor: Doctor) => void;
}

const Doctors: React.FC<DoctorsProps> = (props) => {
  const { patient, doctors, hasSentRequest, currentPlan, onDoctorPress, ...restProps } = props;

  const auth = useAppSelector((state) => state.auth);
  const { setChannel } = useChat();
  const navigation =
    useNavigation<StackNavigationProp<PatientsStackScreens, Screens.PatientDetailScreen>>();

  const handleReferPatient = () => {
    navigation.navigate(Screens.ReferDoctorScreen, { patient, currentPlan });
  };

  let content: React.ReactNode = null;

  if (doctors.length < 1) {
    content = (
      <Typography color="dark" variation="description1">
        Only patients can inform which physicians they are seeing. They will appear here. You,
        however, can refer physicians.
      </Typography>
    );
  } else {
    content = doctors.map((doctor, index) => {
      const handlePress = async () => {
        try {
          navigation.navigate(Screens.ChatScreen, {
            name: `${doctor.first_name} ${doctor.last_name}`,
            imageUrls: [doctor.doctor_image],
          });
          if (auth.doctor) {
            const members = [auth.doctor.id, doctor.id];
            const channel = await API.stream.getOrCreateChannel(members);
            setChannel(channel);
          }
        } catch (error) {
          toast.error('Something went wrong, please try again!');
          logError(error);
        }
      };

      return (
        <DoctorRow
          bC="lightest"
          key={doctor.id}
          doctor={doctor}
          onPress={handlePress}
          disabled={auth.doctor?.id === doctor.id}
          isCurrentlyLoggedInDoctor={auth.doctor?.id === doctor.id}
          bBW={index === doctors.length - 1 ? 0 : 1}
        />
      );
    });
  }

  return (
    <Block {...restProps}>
      <Typography color="black" mB="md" variation="title2">
        Care Team
      </Typography>
      {content}
      {!hasSentRequest && (
        <Button mT="xl" variation="secondary" title="Refer patient" onPress={handleReferPatient} />
      )}
    </Block>
  );
};

export default Doctors;
