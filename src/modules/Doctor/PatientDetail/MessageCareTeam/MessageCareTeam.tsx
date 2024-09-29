import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import CheckBox from '@components/CheckBox/CheckBox';
import Typography from '@components/Typography/Typography';
import { useChat } from '@context/ChatContext';
import { Screens } from '@core/config/screens';
import API from '@core/services';
import { logError } from '@core/utils/logger';
import PatientRow from '@modules/Doctor/Patients/PatientRow/PatientRow';
import DoctorRow from '@modules/Patient/CareTeam/DoctorRow/DoctorRow';
import { CareTeamStackScreens } from '@navigation/Patient/CareTeamStack';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppSelector } from '@store/store';
import { Patient } from '@typings/api-responses/responses';
import { Doctor } from '@typings/model/doctor';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';

interface MessageTeamProps {
  closeModal: (visible: boolean) => void;
  doctors: Doctor[];
  patient: Patient;
}

const MessageCareTeam: React.FC<MessageTeamProps> = (props) => {
  const { closeModal, doctors, patient } = props;
  const [loading, setLoading] = useState(false);
  const [selectedDoctors, setSelectedDoctors] = useState<Doctor[]>([]);

  const navigation =
    useNavigation<StackNavigationProp<CareTeamStackScreens, Screens.CareTeamScreen>>();
  const { setChannel } = useChat();
  const auth = useAppSelector((state) => state.auth);

  const handleMessage = async () => {
    try {
      if (auth.doctor) {
        navigation.replace(Screens.ChatScreen, {
          name: `${patient.first_name} ${patient.last_name}`,
          imageUrls: [patient.patient_image_resized[3].image_url],
        });
        const members = [
          ...selectedDoctors.map((doctor) => doctor.id),
          patient.id,
          auth.doctor?.id,
        ];
        const channel = await API.stream.getOrCreateChannel(members);
        setChannel(channel);
      }
    } catch (error) {
      logError(error);
    }
  };

  const handleSelectAll = () => {
    if (selectedDoctors.length === doctors.length) {
      setSelectedDoctors([]);
    } else {
      setSelectedDoctors(doctors);
    }
  };

  let doctorsContent = <></>;

  if (doctors.length < 1) {
    doctorsContent = (
      <Block align="center">
        <Typography mT="xxxl">No other care team found!</Typography>
      </Block>
    );
  } else {
    doctorsContent = (
      <>
        {doctors.map((doctor, index) => {
          const handleDoctorPress = () => {
            const exists = selectedDoctors.find((d) => d.id === doctor.id);
            if (exists) {
              const updatedDoctors = selectedDoctors.filter((d) => d.id !== doctor.id);
              setSelectedDoctors(updatedDoctors);
            } else {
              setSelectedDoctors([...selectedDoctors, doctor]);
            }
          };

          const checked = !!selectedDoctors.find((d) => d.id === doctor.id);

          return (
            <DoctorRow
              key={doctor.id}
              bC="lightest"
              doctor={doctor}
              onPress={handleDoctorPress}
              renderActionButton={<CheckBox onChange={handleDoctorPress} checked={checked} />}
              bBW={index === doctors.length - 1 ? 0 : 1}
            />
          );
        })}
      </>
    );
  }

  return (
    <ScrollView>
      <Typography variation="title2" color="darkest" mB="xl">
        Patient
      </Typography>

      <PatientRow
        doctorsCount={patient.doctors?.length}
        healthIssuesCount={patient.health_issues?.length}
        name={`${patient.first_name} ${patient.last_name}`}
        imageUrl={patient.patient_image_resized[3].image_url}
      />

      {patient.doctors.length > 1 && (
        <Block flexDirection="row" justify="space-between">
          <Typography variation="title2" color="darkest" mV="xxl">
            Message your care team
          </Typography>

          <CheckBox
            checked={selectedDoctors.length === doctors.length}
            onChange={handleSelectAll}
          />
        </Block>
      )}

      {doctorsContent}

      <Block mT="5xl">
        <Button
          icon="chat"
          loading={loading}
          onPress={handleMessage}
          title={
            patient.doctors.length === 1 ? `Just you & ${patient.first_name}` : 'Message Care Team'
          }
        />
      </Block>
    </ScrollView>
  );
};

export default MessageCareTeam;
