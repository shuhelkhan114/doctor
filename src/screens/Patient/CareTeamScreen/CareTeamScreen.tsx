import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import Modal from '@components/Modal/Modal';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import DoctorDetail from '@modules/Patient/CareTeam/DoctorDetail/DoctorDetail';
import DoctorRow from '@modules/Patient/CareTeam/DoctorRow/DoctorRow';
import MessageTeam from '@modules/Patient/CareTeam/MessageTeam/MessageTeam';
import RequestDetail from '@modules/Patient/CareTeam/RequestDetail/RequestDetail';
import RequestRow from '@modules/Patient/CareTeam/RequestRow/RequestRow';
import { CareTeamStackScreens } from '@navigation/Patient/CareTeamStack';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { refetchPatient } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { PatientRequest } from '@typings/api-responses/responses';
import { Doctor } from '@typings/model/doctor';
import { useCallback, useState } from 'react';
import {
  Image,
  ListRenderItem,
  RefreshControl,
  SectionList,
  SectionListData,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CareTeamScreenProps = NativeStackScreenProps<CareTeamStackScreens, Screens.CareTeamScreen>;

export type CareTeamScreenParams = undefined;

const CareTeamScreen: React.FC<CareTeamScreenProps> = (props) => {
  const { navigation } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<PatientRequest | null>(null);

  const insets = useSafeAreaInsets();
  const height = useBottomTabBarHeight();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const { patient } = auth;

  const handleAddDoctor = () => {
    navigation.navigate(Screens.AddDoctorScreen);
  };

  const handleCloseModal = () => {
    selectedDoctor && setSelectedDoctor(null);
    selectedRequest && setSelectedRequest(null);
  };

  const handleRefresh = async () => {
    dispatch(refetchPatient());
  };

  const showMessageModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleCloseMessageModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const renderDoctorRow: ListRenderItem<Doctor> = (props) => {
    const { item: doctor } = props;

    const handleDoctorRowPress = () => {
      setSelectedDoctor(doctor);
    };

    return <DoctorRow doctor={doctor} onPress={handleDoctorRowPress} />;
  };

  const renderRequestRow: ListRenderItem<PatientRequest> = (props) => {
    const { item: request } = props;
    const { doctor } = request;

    return (
      <RequestRow
        key={request.id}
        city={doctor.city}
        state={doctor.state}
        imageUrl={doctor.doctor_image}
        speciality={doctor.speciality}
        requestSentOn={request.created_at}
        onPress={() => setSelectedRequest(request)}
        name={`${doctor.first_name} ${doctor.last_name}`}
      />
    );
  };

  const sections: SectionListData<any, any> = [
    {
      key: 'doctors',
      title: 'Your care team',
      data: patient?.doctors,
      keyExtractor: (item: Doctor) => item.id,
      renderItem: renderDoctorRow,
      ItemSeparatorComponent: () => <Block height={1} bgColor="lightest" />,
    },
  ];

  if (patient?.requests.length! > 0) {
    sections.push({
      key: 'requests',
      title: 'Requests',
      data: patient?.requests as any,
      keyExtractor: (item: PatientRequest) => item.id,
      renderItem: renderRequestRow as any,
      ItemSeparatorComponent: () => <Block height={1} bgColor="lightest" />,
    });
  }

  return (
    <Block flex1 pT={insets.top} pB={height}>
      <StatusBar barStyle="dark-content" />

      <Modal visible={!!selectedDoctor || !!selectedRequest} onClose={handleCloseModal}>
        {selectedDoctor && <DoctorDetail doctor={selectedDoctor} closeModal={handleCloseModal} />}
        {selectedRequest && (
          <RequestDetail request={selectedRequest} closeModal={handleCloseModal} />
        )}
      </Modal>

      <Modal visible={modalVisible} onClose={handleCloseMessageModal}>
        <MessageTeam closeModal={handleCloseMessageModal} />
      </Modal>

      <Block pH="xxxl" pB="md" flex1>
        <SectionList
          refreshControl={
            <RefreshControl refreshing={auth.fetchingProfile} onRefresh={handleRefresh} />
          }
          renderItem={() => null}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderSectionHeader={({ section }) => (
            <Typography variation="title2">{section.title}</Typography>
          )}
          stickySectionHeadersEnabled={false}
          renderSectionFooter={({ section }) => {
            if (section.key === 'doctors') {
              return (
                <Block>
                  {section.data.length === 0 && (
                    <Block align="center">
                      <Image
                        style={{ width: '50%' }}
                        resizeMode="contain"
                        source={require('@assets/no-careteam.png')}
                      />
                      <Typography>No care team found!</Typography>
                    </Block>
                  )}
                  <Button
                    mT="xxxl"
                    mB="xxl"
                    title="Add Doctor"
                    variation="secondary"
                    onPress={handleAddDoctor}
                  />
                </Block>
              );
            }
            return null;
          }}
          sections={sections}
        />

        {patient?.doctors.length! >= 1 && (
          <Block pH="4xl">
            <Button onPress={showMessageModal} icon="chat" title="Message Care Team" />
          </Block>
        )}
      </Block>
    </Block>
  );
};

export default CareTeamScreen;
