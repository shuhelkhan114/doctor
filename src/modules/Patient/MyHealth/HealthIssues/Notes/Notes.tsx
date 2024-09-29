import Block from '@components/Block/Block';
import ErrorText from '@components/ErrorText/ErrorText';
import ThreeDotsVertical from '@components/Icons/ThreeDotsVertical';
import Image from '@components/Image/Image';
import Spinner from '@components/Loaders/Spinner';
import Modal from '@components/Modal/Modal';
// import ScrollView from '@components/ScrollView/ScrollView';
import Typography from '@components/Typography/Typography';
import API from '@core/services';
import useAppTheme from '@hooks/useTheme';
import { DoctorNote } from '@typings/model/doctorNote';
import { HealthIssue } from '@typings/model/healthIssue';
import format from 'date-fns/format';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useQuery } from 'react-query';

interface NotesProps {
  healthIssue: HealthIssue;
}

const Notes: React.FC<NotesProps> = (props) => {
  const { healthIssue } = props;

  const [selectedNote, setSelectedNote] = useState<DoctorNote | null>(null);

  const theme = useAppTheme();

  const {
    isLoading,
    error,
    data: notes,
  } = useQuery(['notes', healthIssue.id], () =>
    API.patient.note.fetchHealthIssueNote(healthIssue.id)
  );

  let content: React.ReactNode = null;

  if (isLoading) {
    content = (
      <Block height={200}>
        <Spinner />
      </Block>
    );
  } else if (error) {
    content = <ErrorText error={error} />;
  } else if (notes?.length === 0) {
    content = <Typography mT="xxxl">No notes found!</Typography>;
  } else if (notes) {
    content = (
      <ScrollView>
        {notes.map((note, index) => {
          return (
            <Block
              pV="lg"
              key={note.id}
              bC="lightest"
              align="center"
              flexDirection="row"
              onPress={() => setSelectedNote(note)}
              bBW={index === notes.length - 1 ? 0 : 1}>
              <Image mR="xl" uri={note.doctor.doctor_image} size={48} circular />
              <Block flex1>
                <Block flexDirection="row" justify="space-between" align="center">
                  <Typography variation="description2" color="darker">
                    Heart Disease
                  </Typography>
                  <Typography>June 12, 2022</Typography>
                </Block>
                <Block flexDirection="row" justify="space-between" align="center">
                  <Block flex1>
                    <Typography variation="title3Bolder" color="dark">
                      {note.doctor.first_name} {note.doctor.last_name}
                    </Typography>
                    <Typography numberOfLines={2}>{note.description}</Typography>
                  </Block>
                  <ThreeDotsVertical fill={theme.colors.mainBlue} />
                </Block>
              </Block>
            </Block>
          );
        })}
      </ScrollView>
    );
  }

  return (
    <Block>
      <Modal visible={!!selectedNote} onClose={() => setSelectedNote(null)}>
        {selectedNote && (
          <Block>
            <Block flexDirection="row" align="center">
              <Image size={48} circular uri={selectedNote.doctor?.doctor_image} />
              <Block mL="xl">
                <Typography color="darkest" variation="title3Bolder">
                  {selectedNote.doctor?.first_name} ${selectedNote.doctor?.last_name}
                </Typography>
                <Typography color="dark">
                  {format(new Date(selectedNote.created_at), 'MMM dd, yyyy')}
                </Typography>
              </Block>
            </Block>
            <Typography mT="xl" color="darker">
              {selectedNote.description}
            </Typography>
          </Block>
        )}
      </Modal>
      <Typography variation="title2Bolder">Disease Notes</Typography>
      <Typography variation="title3Bolder">{healthIssue.name}</Typography>
      <Block>{content}</Block>
    </Block>
  );
};

export default Notes;
