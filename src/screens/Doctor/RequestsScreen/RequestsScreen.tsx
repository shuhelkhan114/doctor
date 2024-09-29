import Block from '@components/Block/Block';
import ErrorText from '@components/ErrorText/ErrorText';
import Icon from '@components/Icon/Icon';
import Link from '@components/Link/Link';
import Spinner from '@components/Loaders/Spinner';
import ScrollView from '@components/ScrollView/ScrollView';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import API from '@core/services';
import useAppTheme from '@hooks/useTheme';
import PatientRequestCard from '@modules/Doctor/Patients/PatientRequest/PatientRequestCard';
import { PatientsStackScreens } from '@navigation/Doctor/PatientsStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from 'react-query';

type RequestsScreenProps = NativeStackScreenProps<PatientsStackScreens, Screens.RequestsScreen>;

export type RequestsScreenParams = undefined;

const RequestsScreen: React.FC<RequestsScreenProps> = (props) => {
  const { navigation } = props;
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const {
    isLoading,
    error,
    refetch,
    isRefetching,
    data: patientRequests,
  } = useQuery('doctor/patient-requests', API.doctor.request.fetchPatientRequests);

  let content: React.ReactNode = null;

  if (isLoading) {
    content = <Spinner />;
  } else if (error) {
    content = <ErrorText error={error} />;
  } else if (patientRequests?.requests.length === 0) {
    content = (
      <Block align="center">
        <Image
          source={require('@assets/no-patient-requests.png')}
          style={{ width: '50%' }}
          resizeMode="contain"
        />
        <Typography mV="4xl" variation="title3">
          No patient request
        </Typography>
        <Link variation="title3Bolder" onPress={() => navigation.goBack()}>
          Go back to patient's list
        </Link>
      </Block>
    );
  } else {
    content = (
      <Block mT="xxxl" flex1>
        <ScrollView onRefresh={refetch} refreshing={isRefetching}>
          {patientRequests?.requests.map((request) => (
            <Block key={request.id} mT="xl">
              <PatientRequestCard request={request} />
            </Block>
          ))}
        </ScrollView>
      </Block>
    );
  }

  return (
    <Block style={{ paddingTop: insets.top + 20, flex: 1, paddingHorizontal: 24 }}>
      <Block flexDirection="row" align="center" onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color={theme.colors.secondaryBlue} />
        <Typography variation="title2Bolder" mL="md">
          Requests to be your patient
        </Typography>
      </Block>

      {content}
    </Block>
  );
};

export default RequestsScreen;
