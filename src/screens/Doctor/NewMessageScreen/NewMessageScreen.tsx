import Block from '@components/Block/Block';
import DefaultNavigationBar from '@components/NavigationBar/DefaultNavigationBar';
import Search from '@components/Search/Search';
import { useChat } from '@context/ChatContext';
import { Screens } from '@core/config/screens';
import API from '@core/services';
import { logError } from '@core/utils/logger';
import PatientRow from '@modules/Doctor/Patients/PatientRow/PatientRow';
import { MessagesStackScreens } from '@navigation/Doctor/MessagesStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppSelector } from '@store/store';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { useQuery } from 'react-query';

type NewMessageScreenProps = NativeStackScreenProps<MessagesStackScreens, Screens.NewMessageScreen>;

export type NewMessageScreenParams = undefined;

const NewMessageScreen: React.FC<NewMessageScreenProps> = (props) => {
  const { navigation } = props;
  const { setChannel } = useChat();
  const auth = useAppSelector((state) => state.auth);
  const [search, setSearch] = useState('');
  const { data } = useQuery(['patients', search], () => API.doctor.patient.fetchPatients(search));

  return (
    <Block flex1>
      <DefaultNavigationBar title="New Message" />

      <Block pH="xxxl" pV="xxxl" flex1>
        <Search
          onSearch={setSearch}
          onClear={setSearch}
          placeholder="Search patients, doctors or messages"
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Block mT="xxxl">
            {data?.patients.map((patient, index) => {
              const handleSendMessage = async () => {
                try {
                  if (auth.doctor) {
                    navigation.navigate(Screens.ChatScreen, {
                      name: `${patient.first_name} ${patient.last_name}`,
                      imageUrls: [patient.patient_image_resized[3].image_url],
                    });
                    const channel = await API.stream.getOrCreateChannel([
                      auth.doctor.id,
                      patient.id,
                    ]);
                    setChannel(channel);
                  }
                } catch (error) {
                  logError(error);
                }
              };

              return (
                <PatientRow
                  key={patient.id}
                  onPress={handleSendMessage}
                  doctorsCount={patient.total_doctors}
                  healthIssuesCount={patient.total_health_issues}
                  bottomBorder={index !== data.patients.length - 1}
                  name={patient.first_name + ' ' + patient.last_name}
                  imageUrl={patient.patient_image_resized[3].image_url}
                />
              );
            })}
          </Block>
        </ScrollView>
      </Block>
    </Block>
  );
};

export default NewMessageScreen;
