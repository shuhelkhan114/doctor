import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useQuery } from 'react-query';

import Block from '@components/Block/Block';
import DropDown from '@components/DropDown/DropDown';
import ErrorText from '@components/ErrorText/ErrorText';
import SortIcon from '@components/Icons/SortIcon';
import StaticNavigationBar from '@components/NavigationBar/StaticNavigationBar';
import Search from '@components/Search/Search';
import Typography from '@components/Typography/Typography';
import { patientsSortDropdownOptions } from '@core/config/dropdownOptions';
import { Screens } from '@core/config/screens';
import API from '@core/services';
import useAppTheme from '@hooks/useTheme';
import PatientRequests from '@modules/Doctor/Patients/PatientRequests/PatientRequests';
import PatientRow from '@modules/Doctor/Patients/PatientRow/PatientRow';
import { PatientsStackScreens } from '@navigation/Doctor/PatientsStack';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { PatientEntity } from '@typings/model/patient';

type PatientsScreenProps = NativeStackScreenProps<PatientsStackScreens, Screens.PatientsScreen>;

export type PatientsScreenParams = object;

const PatientsScreen: React.FC<PatientsScreenProps> = (props) => {
  const { navigation } = props;
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('DESC');

  const {
    isLoading: patientRequestsLoading,
    isError: patientRequestsError,
    refetch: patientRequestRefetch,
    isRefetchError: patientRequestsRefetchError,
    data: patientRequests,
  } = useQuery('doctor/patient-requests', API.doctor.request.fetchPatientRequests);
  const { isLoading, isError, data, refetch, isRefetchError, isRefetching } = useQuery(
    ['doctor/patients', search, sortField, sortDirection],
    () => API.doctor.patient.fetchPatients(search, sortField, sortDirection)
  );
  const theme = useAppTheme();
  const height = useBottomTabBarHeight();

  console.log({
    patientRequests,
  });

  const handleRefetch = () => {
    refetch();
    patientRequestRefetch();
  };

  const handleSort = (value: string) => {
    const [field, direction] = value.split('-');
    setSortField(field);
    setSortDirection(direction);
  };

  const renderPatientRow: ListRenderItem<PatientEntity> = ({ item: patient, index }) => {
    const handlePress = () => {
      navigation.navigate(Screens.PatientDetailScreen, {
        patientId: patient.id,
      });
    };

    return (
      <PatientRow
        key={patient.id}
        onPress={handlePress}
        doctorsCount={patient.total_doctors}
        healthIssuesCount={patient.total_health_issues}
        bottomBorder={index !== data!.patients.length - 1}
        name={`${patient.first_name} ${patient.last_name}`}
        imageUrl={patient.patient_image_resized?.[3].image_url}
      />
    );
  };

  let content = <></>;

  if (isLoading || patientRequestsLoading) {
    content = (
      <Block flex1 justify="center" align="center">
        <ActivityIndicator color={theme.colors.mainBlue} />
      </Block>
    );
  } else if (data || patientRequests) {
    content = (
      <FlatList
        listKey="id"
        style={{ marginTop: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={handleRefetch} />}
        ListHeaderComponent={
          <Block>
            {(isError || patientRequestsError) && (
              <ErrorText error={{ message: 'Unable to fetch data, please try again!' }} />
            )}
            {(isRefetchError || patientRequestsRefetchError) && (
              <ErrorText error={{ message: 'Unable to refetch, please try again!' }} />
            )}
            <PatientRequests
              requestsCount={patientRequests!.count}
              requests={patientRequests!.requests}
            />
          </Block>
        }
        ListEmptyComponent={
          <Block>
            {!isError && !patientRequestsError && <Typography>No Patients found</Typography>}
          </Block>
        }
        data={data?.patients}
        renderItem={renderPatientRow}
      />
    );
  }

  return (
    <Block flex1 pB={height}>
      <StatusBar barStyle="light-content" />
      <StaticNavigationBar title="Your Patients" />

      <Block pH="xxxl" flex1>
        <Typography variation="description1" mT="sm" color="dark">
          {data?.count} patients
        </Typography>

        <Block flexDirection="row" align="center">
          <Search
            flex1
            mT="md"
            mR="xxxl"
            value={search}
            onSearch={setSearch}
            onClear={setSearch}
            placeholder="Search patients"
          />
          <DropDown
            renderField={({ openModal }) => (
              <Block onPress={openModal}>
                <SortIcon />
              </Block>
            )}
            onSelect={handleSort}
            options={patientsSortDropdownOptions}
            value={sortField + '-' + sortDirection}
          />
        </Block>

        <Block flex1>{content}</Block>
      </Block>
    </Block>
  );
};

export default PatientsScreen;
