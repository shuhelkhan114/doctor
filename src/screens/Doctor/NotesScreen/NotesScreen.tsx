import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import DropDown from '@components/DropDown/DropDown';
import ModalHandle from '@components/ModalHandle/ModalHandle';
import ScrollView from '@components/ScrollView/ScrollView';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import API from '@core/services';
import Note from '@modules/Doctor/Notes/Note/Note';
import PatientRow from '@modules/Doctor/Patients/PatientRow/PatientRow';
import { PatientsStackScreens } from '@navigation/Doctor/PatientsStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PatientRowData } from '@typings/common';
import { HealthIssue } from '@typings/model/healthIssue';
import { useMemo, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useQuery } from 'react-query';

type NotesScreenProps = NativeStackScreenProps<PatientsStackScreens, Screens.NotesScreen>;

export type NotesScreenParams = {
  patient: PatientRowData;
  healthIssues: HealthIssue[];
};

const NotesScreen: React.FC<NotesScreenProps> = (props) => {
  const { navigation, route } = props;
  const { patient, healthIssues } = route.params;
  const [noteType, setNoteType] = useState('*'); // * means all notes

  const {
    isLoading,
    isError,
    data: notes,
  } = useQuery(['doctor/notes', patient.id, noteType], () => {
    if (noteType === '*') return API.doctor.note.fetchNotes(patient.id);
    else if (noteType === '__GN') return API.doctor.note.fetchGeneralNotes(patient.id);
    return API.doctor.note.fetchHealthIssueNotes(patient.id, noteType);
  });

  const navigateToNotesScreen = () => {
    navigation.navigate(Screens.AddNoteScreen, {
      patient,
      healthIssues,
    });
  };

  const noteTypeOptions = useMemo(() => {
    return [
      { label: 'All Notes', value: '*' },
      { label: 'General Note', value: '__GN' },
      ...healthIssues.map((healthIssue) => ({
        label: healthIssue.name,
        value: healthIssue.id,
      })),
    ];
  }, []);

  let content: React.ReactNode = null;

  if (isLoading) {
    content = (
      <Block>
        <ActivityIndicator />
      </Block>
    );
  } else if (isError) {
    content = (
      <Block>
        <Typography>Unable to fetch notes, please try again</Typography>
      </Block>
    );
  } else if (notes) {
    if (notes.length < 1) {
      content = (
        <Block>
          <Typography> No notes found!</Typography>
        </Block>
      );
    } else {
      content = notes.map((note) => {
        return <Note key={note.id} note={note} />;
      });
    }
  }

  return (
    <Block flex1>
      <ModalHandle />

      <Block pH="xxxl" flex1>
        <Typography variation="title2">Patient's Notes</Typography>

        <PatientRow
          mV="xl"
          name={patient.name}
          imageUrl={patient.imageUrl}
          doctorsCount={patient.doctorsCount}
          healthIssuesCount={patient.healthIssuesCount}
        />

        <DropDown
          value={noteType}
          floatingLabel={false}
          onSelect={setNoteType}
          options={noteTypeOptions}
          placeholder="Select Filter"
        />

        <Block mB="xl" />

        <ScrollView pB="7xl">{content}</ScrollView>
      </Block>

      <Block absolute left={0} bottom={20} justify="center" align="center" width="100%">
        <Button
          pV="xl"
          title="Add Note"
          iconColor="white"
          icon="medication-edit"
          style={{ width: '50%' }}
          onPress={navigateToNotesScreen}
        />
      </Block>
    </Block>
  );
};

export default NotesScreen;
