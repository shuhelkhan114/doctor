import React, { useState } from 'react';

import Block, { BlockProps } from '@components/Block/Block';
import ThreeDotsVertical from '@components/Icons/ThreeDotsVertical';
import Image from '@components/Image/Image';
import Modal from '@components/Modal/Modal';
import Typography from '@components/Typography/Typography';
import { useAppSelector } from '@store/store';
import { DoctorNote } from '@typings/model/doctorNote';
import format from 'date-fns/format';

interface NoteProps extends BlockProps {
  note: DoctorNote;
}

// TODO: Move to it's own screen modal

const Note: React.FC<NoteProps> = (props) => {
  const { note, ...restProps } = props;
  console.log(note);
  const [noteDetailShown, setNoteDetailShown] = useState(false);
  const auth = useAppSelector((state) => state.auth);

  const handleNotePress = () => {
    setNoteDetailShown(true);
  };

  return (
    <Block {...restProps}>
      <Modal visible={noteDetailShown} onClose={setNoteDetailShown}>
        <Block flexDirection="row" align="center">
          <Image size={48} circular uri={note.doctor?.doctor_image} />
          <Block mL="xl">
            <Typography color="darker" variation="description2">
              {note.health_issue ? note.health_issue.name : 'General Note'}
            </Typography>
            <Typography color="darkest" variation="title3Bolder">
              {auth.doctor?.id === note.doctor?.id
                ? 'Your note'
                : `${note.doctor?.first_name} ${note.doctor?.last_name}`}
            </Typography>
            <Typography color="dark">
              {format(new Date(note.created_at), 'MMM dd, yyyy')}
            </Typography>
          </Block>
        </Block>
        <Typography mT="xl" color="darker">
          {note.description}
        </Typography>
      </Modal>
      <Block pV="xl" flexDirection="row" onPress={handleNotePress} align="center">
        <Image size={48} circular uri={note.doctor?.doctor_image} />
        <Block mL="xl" flex1>
          <Typography color="darker" variation="description2">
            {note.health_issue ? note.health_issue.name : 'General Note'}
          </Typography>
          <Block flexDirection="row" justify="space-between">
            <Typography color="darkest" variation="title3Bolder">
              {auth.doctor?.id === note.doctor?.id
                ? 'Your note'
                : `${note.doctor?.first_name} ${note.doctor?.last_name}`}
            </Typography>
            <Typography color="dark">
              {format(new Date(note.created_at), 'MMM dd, yyyy')}
            </Typography>
          </Block>
          <Block flexDirection="row">
            <Typography color="dark" numberOfLines={2} flex1>
              {note.description}
            </Typography>
            <ThreeDotsVertical />
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Note;
