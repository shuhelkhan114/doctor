import Block from '@components/Block/Block';
import ErrorText from '@components/ErrorText/ErrorText';
import KeyboardView from '@components/KeyboardView/KeyboardView';
import Spinner from '@components/Loaders/Spinner';
import ModalHandle from '@components/ModalHandle/ModalHandle';
import Search from '@components/Search/Search';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import API from '@core/services';
import PatientRow from '@modules/Doctor/Patients/PatientRow/PatientRow';
import DoctorRow from '@modules/Patient/SearchDoctors/DoctorRow';
import { PatientsStackScreens } from '@navigation/Doctor/PatientsStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PatientRowData, SubscriptionPlan } from '@typings/common';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

type ReferDoctorScreenProps = NativeStackScreenProps<
  PatientsStackScreens,
  Screens.ReferDoctorScreen
>;

export type ReferDoctorScreenParams = {
  patient: PatientRowData;
  currentPlan: SubscriptionPlan;
};

const ReferDoctorScreen: React.FC<ReferDoctorScreenProps> = (props) => {
  const { navigation, route } = props;
  const { patient, currentPlan } = route.params;

  const [search, setSearch] = useState('');

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery(
    ['common/doctors', search],
    async () =>
      search === ''
        ? { count: 0, doctors: [] }
        : API.doctor.doctor.searchDoctors({ patientId: patient.id, search }),
    { enabled: search !== '' }
  );

  const {
    isLoading: referringDoctor,
    error: referringDoctorError,
    mutate: referDoctor,
  } = useMutation(API.doctor.request.referPatient, {
    onSuccess(data: { request_id: string }) {
      navigation.goBack();
      toast.success('Patient referred', 'ADD NOTE', () => {
        navigation.navigate(Screens.AddReferNoteScreen, { requestId: data.request_id });
      });
      queryClient.refetchQueries(['common/doctors']);
    },
    onError(error: AxiosError) {
      console.log('error', error);
      if (error.response?.status === 409) {
        toast.error('Patient already referred to this doctor');
      } else {
        toast.error('Unable to refer patient, please try again!');
      }
      navigation.goBack();
      queryClient.refetchQueries(['common/doctors']);
    },
  });

  let content: React.ReactNode = null;

  if (isLoading || referringDoctor) {
    content = <Spinner />;
  } else if (error) {
    content = <ErrorText error={error} />;
  } else if (data) {
    if (data?.doctors.length === 0) {
      content = (
        <Block mT="xxl" align="center">
          <Typography>No doctors found</Typography>
        </Block>
      );
    } else if (data) {
      content = data.doctors.map((doctor) => {
        const handlePress = () => {
          if (currentPlan !== SubscriptionPlan.Unlimited) {
            toast.error(
              "Can't refer patient with BASIC plan, patient must upgrade the plan.",
              undefined,
              undefined,
              'top',
              10000
            );
            navigation.goBack();
          } else {
            referDoctor({
              doctorId: doctor.id,
              patientId: patient.id,
            });
          }
        };

        return <DoctorRow key={doctor.id} physician={doctor} onPress={handlePress} />;
      });
    }
  }

  return (
    <Block flex1 pH="xxxl">
      <KeyboardView>
        <ModalHandle />

        <Block>
          <Block flexDirection="row" justify="space-between" align="center">
            <Typography variation="title2">Refer Patient</Typography>
          </Block>

          <PatientRow
            mT="lg"
            name={patient.name}
            imageUrl={patient.imageUrl}
            doctorsCount={patient.doctorsCount}
            healthIssuesCount={patient.healthIssuesCount}
          />
        </Block>

        <Search
          mT="xxl"
          value={search}
          onClear={setSearch}
          onSearch={setSearch}
          placeholder="Search Doctors"
        />

        {content}
      </KeyboardView>
    </Block>
  );
};

export default ReferDoctorScreen;
