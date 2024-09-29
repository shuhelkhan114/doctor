import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import Chip from '@components/Chip/Chip';
import KeyboardView from '@components/KeyboardView/KeyboardView';
import ScrollView from '@components/ScrollView/ScrollView';
import Search from '@components/Search/Search';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import API from '@core/services';
import { ConfigHealthIssue } from '@core/services/config';
import PatientRow from '@modules/Doctor/Patients/PatientRow/PatientRow';
import { PatientsStackScreens } from '@navigation/Doctor/PatientsStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { refetchDoctor } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { PatientRowData, UserRole } from '@typings/common';
import { HealthIssue } from '@typings/model/healthIssue';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

type AddHealthIssueScreenProps = NativeStackScreenProps<
  PatientsStackScreens,
  Screens.AddHealthIssueScreen
>;

export type AddHealthIssueScreenParams = {
  patient: PatientRowData;
  healthIssues: HealthIssue[];
};

const AddHealthIssueScreen: React.FC<AddHealthIssueScreenProps> = (props) => {
  const { navigation, route } = props;
  const { patient, healthIssues: patientHealthIssues } = route.params;

  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const [search, setSearch] = useState('');
  const [selectedHealthIssue, setSelectedHealthIssue] = useState<ConfigHealthIssue | null>(null);

  const healthIssuesState = useAppSelector((state) => state.patientOnboarding.healthIssues);
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
      const healthIssues = patientHealthIssues.map((healthIssue) => healthIssue.name.toLowerCase());
      filteredHealthIssues = state.auth.config.health_issues.filter(
        (issue) => !healthIssues?.includes(issue.value.toLowerCase())
      );
    }

    return {
      health_issues: filteredHealthIssues,
    };
  });

  const [healthIssues, setHealthIssues] = useState(() => appConfig.health_issues);
  const [selectedSeverity, setSelectedSeverity] = useState('');

  const { isLoading: addingHealthIssue, mutate: addHealthIssuue } = useMutation(
    API.doctor.healthIssue.addHealthIssue,
    {
      onSuccess() {
        toast.success(`${selectedHealthIssue?.value} added successfully`);
        dispatch(refetchDoctor());
        queryClient.refetchQueries(['doctor/patient', patient?.id]);
        navigation.goBack();
      },
      onError() {
        toast.error('Unable to add health issue, please try again!');
      },
    }
  );

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
    setSelectedHealthIssue(null);
  };

  const handleSave = () => {
    if (selectedHealthIssue) {
      addHealthIssuue({
        patientId: patient?.id!,
        data: [
          {
            name: selectedHealthIssue?.value,
            severity: selectedSeverity,
            // TODO: fix this
            description: 'Test description',
          },
        ],
      });
    }
  };

  return (
    <Block flex1 pH="xxxl">
      <KeyboardView>
        <Block align="center" mT="xxl" mB="xxxl">
          <Block width={48} height={4} bgColor="lighter" rounded="6xl" />
        </Block>

        <Block>
          <Block flexDirection="row" justify="space-between" align="center">
            <Typography variation="title2">Add Health Issue</Typography>
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
          mT="xl"
          value={search}
          onClear={handleClear}
          onSearch={handleSearchMedication}
          placeholder="Search for health issues"
        />

        <Block flex1 mB="auto" pB="7xl">
          {search && !selectedHealthIssue && (
            <ScrollView pH="lg">
              {healthIssues.map((healthIssue, index) => {
                const added = healthIssuesState.data.some((issue) => issue.id === healthIssue.id);
                const handlePress = () => {
                  setSelectedHealthIssue(healthIssue);
                  setSearch(healthIssue.value);
                };

                return (
                  <Block
                    pV="xl"
                    bC="lightest"
                    flexDirection="row"
                    key={healthIssue.value}
                    onPress={handlePress}
                    justify="space-between"
                    bBW={index === healthIssues.length - 1 ? 0 : 1}>
                    <Typography flex1>{healthIssue.value}</Typography>
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
          onPress={handleSave}
          title="Add health issue"
          loading={addingHealthIssue}
          disabled={!selectedHealthIssue || !selectedSeverity}
        />
      </KeyboardView>
    </Block>
  );
};

export default AddHealthIssueScreen;
