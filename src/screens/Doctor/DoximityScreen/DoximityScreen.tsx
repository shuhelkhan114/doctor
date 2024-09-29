import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  NativeModules,
  RefreshControl,
  StatusBar,
} from 'react-native';

import Block from '@components/Block/Block';
import ErrorText from '@components/ErrorText/ErrorText';
import DocsGPTIcon from '@components/Icons/DocsGPTIcon';
import DoximityDialerIcon from '@components/Icons/DoximityDialerIcon';
import StaticNavigationBar from '@components/NavigationBar/StaticNavigationBar';
import Search from '@components/Search/Search';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import API from '@core/services';
import { openLink } from '@core/utils/rn-link';
import useAppTheme from '@hooks/useTheme';
import PatientRow from '@modules/Doctor/Patients/PatientRow/PatientRow';
import { DoximityStackScreens } from '@navigation/Doctor/DoximityStack';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { PatientEntity } from '@typings/model/patient';
import { useQuery } from 'react-query';

type DoximityScreenProps = NativeStackScreenProps<DoximityStackScreens, Screens.DoximityScreen>;

export type DoximityScreenParams = object;

const DoximityScreen: React.FC<DoximityScreenProps> = (props) => {
  const height = useBottomTabBarHeight();
  const theme = useAppTheme();
  const [search, setSearch] = useState('');

  const { isLoading, isError, data, refetch, isRefetchError, isRefetching } = useQuery(
    ['doctor/patients', search],
    () => API.doctor.patient.fetchPatients(search)
  );

  const handlePress = () => {
    openLink('https://www.doximity.com/docs-gpt');
  };

  const renderPatientRow: ListRenderItem<PatientEntity> = ({ item: patient, index }) => {
    const handlePress = () => {
      NativeModules.DocHelloDoximityDialer.openDoximityDialer(patient.phone_number);
    };

    return (
      <PatientRow
        key={patient.id}
        onPress={handlePress}
        doctorsCount={patient.total_doctors}
        healthIssuesCount={patient.total_health_issues}
        asideItem={<DoximityDialerIcon />}
        name={`${patient.first_name} ${patient.last_name}`}
        imageUrl={patient.patient_image_resized[3].image_url}
        bottomBorder={index !== data!.patients.length - 1}
      />
    );
  };

  let content = <></>;

  if (isLoading) {
    content = (
      <Block flex1 justify="center" align="center">
        <ActivityIndicator color={theme.colors.mainBlue} />
      </Block>
    );
  } else if (data) {
    content = (
      <FlatList
        listKey="id"
        style={{ marginTop: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        ListHeaderComponent={
          <Block>
            {isError && (
              <ErrorText error={{ message: 'Unable to fetch data, please try again!' }} />
            )}
            {isRefetchError && (
              <ErrorText error={{ message: 'Unable to refetch, please try again!' }} />
            )}
          </Block>
        }
        ListEmptyComponent={<Block>{!isError && <Typography>No Patients found</Typography>}</Block>}
        data={data.patients}
        renderItem={renderPatientRow}
      />
    );
  }

  return (
    <Block flex1 pB={height}>
      <StatusBar barStyle="dark-content" />

      <StaticNavigationBar
        title="Doximity"
        actionContent={
          <Block onPress={handlePress}>
            <DocsGPTIcon />
          </Block>
        }
      />

      <Block pH="xxxl" flex1>
        <Typography variation="description1" mT="sm" color="dark" mB="xxl">
          {data?.count} patients
        </Typography>

        <Search placeholder="Search patients" onSearch={setSearch} onClear={setSearch} />

        {content}
      </Block>
    </Block>
  );
};

export default DoximityScreen;
