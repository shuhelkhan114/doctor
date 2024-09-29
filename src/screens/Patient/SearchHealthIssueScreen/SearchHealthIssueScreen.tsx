import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';

import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import CheckBox from '@components/CheckBox/CheckBox';
import Chip from '@components/Chip/Chip';
import ArrowLeftIcon from '@components/Icons/ArrowLeftIcon';
import Image from '@components/Image/Image';
import KeyboardView from '@components/KeyboardView/KeyboardView';
import NavigationBar from '@components/NavigationBar/NavigationBar';
import ScrollView from '@components/ScrollView/ScrollView';
import Search from '@components/Search/Search';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import API from '@core/services';
import { ConfigHealthIssue } from '@core/services/config';
import { getSize } from '@core/utils/responsive';
import { AuthStackScreens } from '@navigation/AuthStack';
import { DashboardStackScreens } from '@navigation/Patient/DashboardStack';
import { refetchDoctor, refetchPatient } from '@store/slices/authSlice';
import { addHealthIssue, removeHealthIssue } from '@store/slices/patientOnboardingSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { UserRole } from '@typings/common';
import { HealthIssue } from '@typings/model/healthIssue';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from 'react-query';

type SearchHealthIssuesScreenProps = NativeStackScreenProps<
  AuthStackScreens | DashboardStackScreens,
  Screens.SearchHealthIssuesScreen
>;

export type SearchHealthIssuesScreenParams = {
  patientId?: string;
  from?: 'DOCTOR' | 'PATIENT';
  onboarding?: boolean;
  patient?: {
    id: string;
    name: string;
    imageUrl: string;
    healthIssues: HealthIssue[];
  };
};

const SearchHealthIssueScreen: React.FC<SearchHealthIssuesScreenProps> = (props) => {
  const { navigation, route } = props;
  const { from = 'PATIENT', patient, onboarding } = route.params || {};
  const [selectedHealthIssue, setSelectedHealthIssue] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');

  const appConfig = useAppSelector((state) => {
    let filteredHealthIssues: ConfigHealthIssue[] = [];
    if (state.auth.role === UserRole.Patient) {
      const healthIssues =
        state.auth.patient?.health_issues.map((healthIssue) => healthIssue.name.toLowerCase()) ||
        [];
      // TODO: fix nested loop;
      filteredHealthIssues = state.auth.config.health_issues.filter(
        (issue) => !healthIssues.includes(issue.value.toLowerCase())
      );
    } else {
      const healthIssues = patient?.healthIssues.map((healthIssue) =>
        healthIssue.name.toLowerCase()
      );
      filteredHealthIssues = state.auth.config.health_issues.filter(
        (issue) => !healthIssues?.includes(issue.value.toLowerCase())
      );
    }

    return {
      health_issues: filteredHealthIssues,
    };
  });
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const healthIssuesState = useAppSelector((state) => state.patientOnboarding.healthIssues);
  const [search, setSearch] = useState('');
  const [healthIssues, setHealthIssues] = useState(() => appConfig.health_issues);
  const { isLoading: addingHealthIssueByPatient, mutate: addHealthIssueByPatient } = useMutation(
    API.patient.healthIssue.addPatientHealthIssue,
    {
      onSuccess() {
        toast.success(`${selectedHealthIssue} added successfully`);
        dispatch(refetchPatient());
        navigation.goBack();
      },
      onError() {
        toast.error('Unable to add health issue, please try again!');
      },
    }
  );
  const { isLoading: addingHealthIssueDoctor, mutate: addHealthIssueByDoctor } = useMutation(
    API.doctor.healthIssue.addHealthIssue,
    {
      onSuccess() {
        toast.success(`${selectedHealthIssue} added successfully`);
        dispatch(refetchDoctor());
        queryClient.refetchQueries(['doctor/patient', patient?.id]);
        navigation.goBack();
      },
      onError() {
        toast.error('Unable to add health issue, please try again!');
      },
    }
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        navigationBar: {
          paddingTop: insets.top,
        },
      }),
    []
  );

  useEffect(() => {
    return () => {
      setSearch('');
    };
  }, []);

  const handleSearchMedication = (name: string) => {
    setHealthIssues(
      appConfig.health_issues.filter((healthIssue) =>
        healthIssue.value.toLowerCase().includes(name.toLowerCase())
      )
    );
    setSearch(name);
  };

  const handleClear = () => {
    setSearch('');
    setSelectedHealthIssue('');
  };

  const handleSubmit = () => {
    if (onboarding) {
      navigation.goBack();
    } else {
      if (from === 'DOCTOR') {
        addHealthIssueByDoctor({
          patientId: patient?.id!,
          data: [
            {
              name: selectedHealthIssue,
              severity: selectedSeverity,
              // TODO: fix this
              description: 'Test description',
            },
          ],
        });
      } else {
        addHealthIssueByPatient({
          name: selectedHealthIssue,
          severity: selectedSeverity,
          // TODO: fix this
          description: 'Test Description',
        });
      }
    }
  };

  let disabled = false;

  if (from === 'DOCTOR') {
    disabled = !selectedHealthIssue || !selectedSeverity;
  }

  return (
    <KeyboardView>
      {from === 'PATIENT' ? (
        <NavigationBar variation="transparent" title="Search Health Issues" />
      ) : (
        <Block pH="xxxl" pB="xl" flexDirection="row" align="center" style={styles.navigationBar}>
          <Block pR="md" onPress={navigation.goBack}>
            <ArrowLeftIcon />
          </Block>
          <Image mR="md" uri={patient?.imageUrl} size={48} circular />
          <Block>
            <Typography variation="title3Bolder">Add health issue</Typography>
            <Typography variation="description1" style={{ marginTop: getSize(-4) }}>
              {patient?.name}
            </Typography>
          </Block>
        </Block>
      )}

      <Block pH="xxxl" mT="xs" flexDirection="column" pB="md" style={{ flex: 1 }}>
        <Search
          value={search}
          onClear={handleClear}
          onSearch={handleSearchMedication}
          placeholder="Search for health issues"
        />

        <Block flex1 mB="auto">
          {search && !selectedHealthIssue && (
            <ScrollView>
              {healthIssues.map((healthIssue, index) => {
                const added = healthIssuesState.data.some((issue) => issue.id === healthIssue.id);
                const handlePress = () => {
                  if (onboarding) {
                    if (added) {
                      dispatch(removeHealthIssue(healthIssue.id));
                    } else {
                      dispatch(
                        addHealthIssue({
                          name: healthIssue.value,
                          id: healthIssue.id,
                          status: 'confirmed',
                        })
                      );
                    }
                  } else {
                    setSelectedHealthIssue(healthIssue.value);
                    setSearch(healthIssue.value);
                  }
                };

                return (
                  <Block
                    pV="xl"
                    bC="lightest"
                    flexDirection="row"
                    onPress={handlePress}
                    justify="space-between"
                    key={healthIssue.id + healthIssue.value}
                    bBW={index === healthIssues.length - 1 ? 0 : 1}>
                    <Typography flex1>{healthIssue.value}</Typography>
                    {onboarding && <CheckBox checked={added} onChange={handlePress} />}
                  </Block>
                );
              })}
            </ScrollView>
          )}

          {selectedHealthIssue && (
            <Block mT="xxxl">
              <Typography variation="title3Bolder">Severity</Typography>

              <Block flexDirection="row">
                {['High', 'Medium', 'Low'].map((status) => (
                  <Chip
                    mR="md"
                    key={status}
                    text={status}
                    selected={status === selectedSeverity}
                    onPress={() => setSelectedSeverity(status)}
                  />
                ))}
              </Block>
            </Block>
          )}
        </Block>
        <Button
          mV="xxl"
          disabled={disabled}
          onPress={handleSubmit}
          title="Add health issue"
          loading={addingHealthIssueByPatient || addingHealthIssueDoctor}
        />
      </Block>
    </KeyboardView>
  );
};

export default SearchHealthIssueScreen;
