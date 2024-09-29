import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { useQuery } from 'react-query';

import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import KeyboardView from '@components/KeyboardView/KeyboardView';
import Modal from '@components/Modal/Modal';
import NavigationBar from '@components/NavigationBar/NavigationBar';
import ScrollView from '@components/ScrollView/ScrollView';
import Search from '@components/Search/Search';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import API from '@core/services';
import DoctorRow from '@modules/Patient/SearchDoctors/DoctorRow';
import ReferDetail from '@modules/Shared/SearchDoctor/ReferDetail/ReferDetail';
import { AuthStackScreens } from '@navigation/AuthStack';
import { CareTeamStackScreens } from '@navigation/Patient/CareTeamStack';
import { addDoctor, removeDoctor } from '@store/slices/patientOnboardingSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { PatientRowData } from '@typings/common';
import { Doctor, DoctorAvailability } from '@typings/model/doctor';

type SearchDoctorScreenProps = NativeStackScreenProps<
  AuthStackScreens | CareTeamStackScreens,
  Screens.SearchDoctorScreen
>;

export type SearchDoctorScreenParams = {
  from?: 'PATIENT' | 'DOCTOR';
  patient?: PatientRowData;
  onboarding?: boolean;
};

const SearchDoctorScreen: React.FC<SearchDoctorScreenProps> = (props) => {
  const { navigation, route } = props;
  const { from, patient, onboarding } = route.params || {};
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const dispatch = useAppDispatch();
  const fhirDoctorsState = useAppSelector((state) => state.patientOnboarding.doctors);

  const { data } = useQuery(
    ['common/doctors', search],
    async () => {
      if (from === 'PATIENT' || onboarding) {
        return API.patient.doctor.searchDoctors({ search });
      } else {
        return API.doctor.doctor.searchDoctors({ patientId: patient?.id!, search });
      }
    },
    { enabled: !!search }
  );

  useEffect(() => {
    return () => {
      setSearch('');
    };
  }, []);

  return (
    <KeyboardView>
      <Block flex1>
        <Modal visible={!!selectedDoctor} onClose={() => setSelectedDoctor(null)}>
          {selectedDoctor && patient && (
            <ReferDetail
              patient={patient}
              doctor={selectedDoctor}
              onClose={() => setSelectedDoctor(null)}
            />
          )}
        </Modal>
        <NavigationBar variation="transparent" title="Search doctors" />
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <Block flex1 mT="xs" pB="md" pH="xxxl" flexDirection="column">
            <Search
              value={search}
              onSearch={setSearch}
              onClear={() => setSearch('')}
              placeholder="Doctor's name or code"
            />

            {search && data && data?.doctors.length < 1 && (
              <Block align="center" mT="5xl">
                <Image
                  source={require('@assets/no-doctors.png')}
                  style={{ width: '50%' }}
                  resizeMode="contain"
                />
                <Typography variation="title3" center>
                  The doctor you are looking for is not on Doc Hello
                </Typography>
              </Block>
            )}

            <Block mB="auto" mT="xl">
              {data?.doctors.map((doctor, index) => {
                const found = fhirDoctorsState.data.find((d) => d.id === doctor.id);

                const handlePress = () => {
                  if (doctor.availablity !== DoctorAvailability.ACCEPTING) {
                    toast.error(
                      `${doctor.first_name} ${doctor.last_name} is not currently accepting new patients`
                    );
                  } else {
                    if (onboarding) {
                      if (found) {
                        dispatch(removeDoctor(doctor.id));
                      } else {
                        dispatch(
                          addDoctor({
                            id: doctor.id,
                            imageUrl: doctor.doctor_image,
                            name: doctor.first_name + ' ' + doctor.last_name,
                            speciality: doctor.speciality,
                            status: 'confirmed',
                            isFHIRDoctor: false,
                          })
                        );
                      }
                    } else if (from === 'DOCTOR') {
                      setSelectedDoctor(doctor);
                    }
                  }
                };

                return (
                  <DoctorRow
                    key={doctor.id}
                    physician={doctor}
                    selected={!!found}
                    onPress={handlePress}
                    sendRequest={from === 'PATIENT'}
                  />
                );
              })}
            </Block>
            <Block pB="md">
              <Button title="Save" onPress={() => navigation.goBack()} />
            </Block>
          </Block>
        </ScrollView>
      </Block>
    </KeyboardView>
  );
};

export default SearchDoctorScreen;
