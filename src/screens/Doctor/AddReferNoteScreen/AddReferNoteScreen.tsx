import Block from '@components/Block/Block';
import ErrorText from '@components/ErrorText/ErrorText';
import Icon from '@components/Icon/Icon';
import KeyboardView from '@components/KeyboardView/KeyboardView';
import ModalHandle from '@components/ModalHandle/ModalHandle';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import API from '@core/services';
import useAppTheme from '@hooks/useTheme';
import { PatientsStackScreens } from '@navigation/Doctor/PatientsStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput } from 'react-native';
import { useMutation } from 'react-query';

type AddReferNoteScreenProps = NativeStackScreenProps<
  PatientsStackScreens,
  Screens.AddReferNoteScreen
>;

export type AddReferNoteScreenParams = {
  requestId: string;
};

const AddReferNoteScreen: React.FC<AddReferNoteScreenProps> = (props) => {
  const { navigation, route } = props;
  const { requestId } = route.params;

  const [note, setNote] = useState('');

  const {
    isLoading,
    error,
    mutate: addReferNote,
  } = useMutation(API.doctor.request.addReferNote, {
    onSuccess() {
      toast.success('Refer note added successfully!');
      navigation.goBack();
    },
    onError(error: any) {
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('An error occurred, please try again!');
      }
    },
  });

  const theme = useAppTheme();

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
    addReferNote({ requestId, note: note.trim() });
    navigation.goBack();
  };

  return (
    <Block flex1 pH="xxxl">
      <KeyboardView>
        <ModalHandle />

        <Block>
          <Block flexDirection="row" justify="space-between" align="center">
            <Typography variation="title2">Add Note to referral</Typography>

            <ErrorText error={error} />

            <Block height={32} width={32}>
              {note.trim().length > 5 && (
                <Block onPress={handleSave}>
                  {isLoading ? <ActivityIndicator /> : <Icon name="checked" />}
                </Block>
              )}
            </Block>
          </Block>
        </Block>

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

export default AddReferNoteScreen;
