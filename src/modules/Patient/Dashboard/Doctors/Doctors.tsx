import Block, { BlockProps } from '@components/Block/Block';
import Button from '@components/Button/Button';
import Icon from '@components/Icon/Icon';
import Modal from '@components/Modal/Modal';
import Typography from '@components/Typography/Typography';
import { useChat } from '@context/ChatContext';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import API from '@core/services';
import { logError } from '@core/utils/logger';
import { useChatClient } from '@hooks/useChatClient';
import useAppTheme from '@hooks/useTheme';
import DoctorDetail from '@modules/Patient/CareTeam/DoctorDetail/DoctorDetail';
import DoctorCard from '@modules/Patient/PatientDashboard/DoctorCard/DoctorCard';
import { DashboardStackScreens } from '@navigation/Patient/DashboardStack';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppSelector } from '@store/store';
import { Doctor } from '@typings/model/doctor';
import React, { useState } from 'react';

interface DoctorsProps extends BlockProps {}

const Doctors: React.FC<DoctorsProps> = (props) => {
  const { ...restProps } = props;

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const { clientIsReady } = useChatClient();
  const theme = useAppTheme();
  const navigation =
    useNavigation<StackNavigationProp<DashboardStackScreens, Screens.DashboardScreen>>();
  const { setChannel } = useChat();
  const patient = useAppSelector((state) => state.auth.patient);

  const navigateToCareTeamScreen = () => {
    // @ts-ignore
    navigation.navigate('CareTeamStack');
  };

  const handleCloseModal = () => {
    setSelectedDoctor(null);
  };

  if (!clientIsReady || patient?.doctors.length! < 1) {
    return <></>;
  }

  return (
    <Block {...restProps}>
      <Modal visible={!!selectedDoctor} onClose={handleCloseModal}>
        {selectedDoctor && <DoctorDetail doctor={selectedDoctor} closeModal={handleCloseModal} />}
      </Modal>

      <Block
        mB="xxl"
        align="center"
        flexDirection="row"
        justify="space-between"
        onPress={navigateToCareTeamScreen}>
        <Typography variation="title3Bolder">Your care team</Typography>
        <Icon name="arrow-right" size={24} />
      </Block>

      {patient?.doctors?.length! > 0 ? (
        patient?.doctors?.map((doctor, index) => {
          const handleSendMessage = async () => {
            try {
              navigation.navigate(Screens.ChatScreen, {
                name: `${doctor.first_name} ${doctor.last_name}`,
                imageUrls: [doctor.doctor_image],
              });

              const channel = await API.stream.getOrCreateChannel([patient.id, doctor.id]);
              setChannel(channel);
            } catch (error) {
              logError(error);
              toast.error('Failed to send message');
            }
          };

          return (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onChatPress={handleSendMessage}
              onPress={() => setSelectedDoctor(doctor)}
              style={{ marginBottom: theme.spacing.xl }}
            />
          );
        })
      ) : (
        <Typography mB="xl">No doctors found!</Typography>
      )}

      <Button
        title="Add Doctor"
        variation="secondary"
        onPress={() => navigation.navigate(Screens.AddDoctorScreen)}
      />
    </Block>
  );
};

export default Doctors;
