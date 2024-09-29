import Block, { BlockProps } from '@components/Block/Block';
import Button from '@components/Button/Button';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import Note from '@modules/Doctor/Notes/Note/Note';
import { PatientsStackScreens } from '@navigation/Doctor/PatientsStack';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PatientRowData } from '@typings/common';
import { DoctorNote } from '@typings/model/doctorNote';
import { HealthIssue } from '@typings/model/healthIssue';
import React from 'react';

interface DoctorNotesProps extends BlockProps {
  patient: PatientRowData;
  hasSentRequest: boolean;
  doctorNotes: DoctorNote[];
  healthIssues: HealthIssue[];
}

const DoctorNotes: React.FC<DoctorNotesProps> = (props) => {
  const { patient, doctorNotes = [], hasSentRequest, healthIssues, ...restProps } = props;

  const navigation =
    useNavigation<StackNavigationProp<PatientsStackScreens, Screens.PatientDetailScreen>>();

  const handleViewNotes = () => {
    navigation.navigate(Screens.NotesScreen, { patient, healthIssues });
  };

  const handleAddNote = () => {
    navigation.navigate(Screens.AddNoteScreen, { patient, healthIssues });
  };

  let content: React.ReactNode = null;

  if (doctorNotes.length < 1) {
    content = (
      <Typography variation="description1" color="dark" mT="md">
        Yours and other physicians notes will appear here. They can be anything that others in the
        care team need to know.
      </Typography>
    );
  } else {
    content = doctorNotes.map((note, index) => {
      return (
        <Note
          note={note}
          bC="lightest"
          key={note.id}
          bBW={index === doctorNotes.length - 1 ? 0 : 1}
        />
      );
    });
  }

  return (
    <Block {...restProps}>
      <Block flexDirection="row" align="center" justify="space-between" onPress={handleViewNotes}>
        <Typography variation="title2" color="black">
          Doctor's Notes
        </Typography>
        {doctorNotes.length > 0 && (
          <Typography color="mainBlue" variation="description1Bolder">
            View All
          </Typography>
        )}
      </Block>
      {content}
      {!hasSentRequest && (
        <Button mT="xl" title="Add Note" variation="secondary" onPress={handleAddNote} />
      )}
    </Block>
  );
};

export default DoctorNotes;
