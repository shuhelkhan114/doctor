import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import CheckBox from '@components/CheckBox/CheckBox';
import Image from '@components/Image/Image';
import Typography from '@components/Typography/Typography';
import { useChat } from '@context/ChatContext';
import { Screens } from '@core/config/screens';
import API from '@core/services';
import { logError } from '@core/utils/logger';
import { CareTeamStackScreens } from '@navigation/Patient/CareTeamStack';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppSelector } from '@store/store';
import { Doctor } from '@typings/model/doctor';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import DoctorRow from '../DoctorRow/DoctorRow';

interface MessageTeamProps {
  closeModal: () => void;
}

const MessageTeam: React.FC<MessageTeamProps> = (props) => {
  const { closeModal } = props;
  const [loading, setLoading] = useState(false);
  const [selectedDoctors, setSelectedDoctors] = useState<Doctor[]>([]);

  const navigation =
    useNavigation<StackNavigationProp<CareTeamStackScreens, Screens.CareTeamScreen>>();
  const { setChannel } = useChat();
  const auth = useAppSelector((state) => state.auth);

  const handleMessage = async () => {
    setLoading(true);
    if (auth.patient) {
      const members = [...selectedDoctors.map((doctor) => doctor.id), auth.patient.id];

      try {
        navigation.navigate(Screens.ChatScreen, {
          name: `Care Team`,
          imageUrls: selectedDoctors.map((doctor) => doctor.doctor_image),
        });
        const channel = await API.stream.getOrCreateChannel(members);
        setChannel(channel);
        closeModal?.();
      } catch (error) {
        logError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  let careTeamContent = <></>;

  if (auth.patient?.doctors.length! < 1) {
    careTeamContent = (
      <Block align="center">
        <Image
          style={{ width: '50%' }}
          resizeMode="contain"
          source={require('@assets/no-careteam.png')}
        />
        <Typography>No care team found!</Typography>
      </Block>
    );
  } else {
    careTeamContent = (
      <>
        {auth.patient?.doctors.map((doctor, index) => {
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
              bBW={index === auth.patient?.doctors.length! - 1 ? 0 : 1}
            />
          );
        })}
      </>
    );
  }

  return (
    <ScrollView>
      <Typography variation="title2" color="darkest" mB="xxxl">
        Message your care team
      </Typography>

      {careTeamContent}

      <Block mT="5xl">
        <Button
          icon="chat"
          loading={loading}
          onPress={handleMessage}
          title="Message Care Team"
          disabled={selectedDoctors.length < 1}
        />
      </Block>
    </ScrollView>
  );
};

export default MessageTeam;
