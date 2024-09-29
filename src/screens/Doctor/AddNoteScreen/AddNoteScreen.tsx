import Block from '@components/Block/Block';
import DropDown from '@components/DropDown/DropDown';
import Icon from '@components/Icon/Icon';
import KeyboardView from '@components/KeyboardView/KeyboardView';
import ModalHandle from '@components/ModalHandle/ModalHandle';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import API from '@core/services';
import useAppTheme from '@hooks/useTheme';
import PatientRow from '@modules/Doctor/Patients/PatientRow/PatientRow';
import { PatientsStackScreens } from '@navigation/Doctor/PatientsStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PatientRowData } from '@typings/common';
import { HealthIssue } from '@typings/model/healthIssue';
import { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput } from 'react-native';
import { useMutation, useQueryClient } from 'react-query';

type AddDoctorNoteScreenProps = NativeStackScreenProps<PatientsStackScreens, Screens.AddNoteScreen>;

export type AddNoteScreenParams = {
  patient: PatientRowData;
  healthIssues: HealthIssue[];
};

const AddNoteScreen: React.FC<AddDoctorNoteScreenProps> = (props) => {
  const { navigation, route } = props;
  const { patient, healthIssues } = route.params;
  const [note, setNote] = useState('');
  const [noteType, setNoteType] = useState('__GN'); // '__GN' means general note
  const queryClient = useQueryClient();
  const theme = useAppTheme();

  const { isLoading: creatingHealthIssueNote, mutate: createHealthIssueNote } = useMutation(
    API.doctor.note.createHealthIssueNote,
    {
      onSuccess() {
        toast.success('Note created successfully');
        queryClient.refetchQueries(['doctor/patient', patient.id]);
        queryClient.refetchQueries(['doctor/notes']);
        navigation.goBack();
      },
      onError() {
        toast.error('An error occurred, please try again!');
      },
    }
  );

  const { isLoading: creatingGeneralNote, mutate: createGeneralNote } = useMutation(
    API.doctor.note.createPatientNote,
    {
      onSuccess() {
        toast.success('Note created successfully');
        queryClient.refetchQueries(['doctor/patient', patient.id]);
        queryClient.refetchQueries(['doctor/notes']);
        navigation.goBack();
      },
      onError() {
        toast.error('An error occurred, please try again!');
      },
    }
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        input: {
          flex: 1,
          paddingBottom: theme.spacing['7xl'],
        },
      }),
    []
  );

  const handleSave = () => {
    if (noteType === '__GN') {
      createGeneralNote({
        patientId: patient.id,
        description: note.trim(),
      });
    } else {
      createHealthIssueNote({
        patientId: patient.id,
        data: {
          description: note.trim(),
          health_issue_id: noteType,
        },
      });
    }
  };

  const noteTypeOptions = useMemo(() => {
    return [
      { label: 'General Note', value: '__GN' },
      ...healthIssues
        .filter((healthIssue) => healthIssue.status !== 'DELETED')
        .map((healthIssue) => ({
          label: healthIssue.name,
          value: healthIssue.id,
        })),
    ];
  }, []);

  return (
    <Block flex1 pH="xxxl">
      <KeyboardView>
        <ModalHandle />

        <Block>
          <Block flexDirection="row" justify="space-between" align="center">
            <Typography variation="title2">New Note</Typography>

            <Block height={32} width={32}>
              {note.trim().length > 5 && (
                <Block onPress={handleSave}>
                  {creatingHealthIssueNote || creatingGeneralNote ? (
                    <ActivityIndicator />
                  ) : (
                    <Icon name="checked" />
                  )}
                </Block>
              )}
            </Block>
          </Block>
          <PatientRow
            name={patient.name}
            imageUrl={patient.imageUrl}
            doctorsCount={patient.doctorsCount}
            healthIssuesCount={patient.healthIssuesCount}
          />
        </Block>

        <DropDown
          mT="xxl"
          mB="xxl"
          value={noteType}
          floatingLabel={false}
          onSelect={setNoteType}
          options={noteTypeOptions}
          placeholder="Select Note Type"
        />

        {/* <ScrollView pB="7xl"> */}
        <TextInput
          multiline
          value={note}
          style={styles.input}
          onChangeText={setNote}
          placeholder="Start Typing..."
          placeholderTextColor={theme.colors.dark}
        />
        {/* </ScrollView> */}
      </KeyboardView>
    </Block>
  );
};

export default AddNoteScreen;
