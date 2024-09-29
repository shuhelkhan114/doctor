import Block from '@components/Block/Block';
import Icon from '@components/Icon/Icon';
import ArrowLeftIcon from '@components/Icons/ArrowLeftIcon';
import Image from '@components/Image/Image';
import KeyboardView from '@components/KeyboardView/KeyboardView';
import ScrollView from '@components/ScrollView/ScrollView';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import API from '@core/services';
import { getSize } from '@core/utils/responsive';
import useAppTheme from '@hooks/useTheme';
import { PatientsStackScreens } from '@navigation/Doctor/PatientsStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from 'react-query';

type AddDoctorGeneralNoteScreenProps = NativeStackScreenProps<
  PatientsStackScreens,
  Screens.AddGeneralNoteScreen
>;

export type AddGeneralNoteScreenParams = {
  patient: {
    id: string;
    name: string;
    imageUrl: string;
  };
  healthIssue?: {
    id: string;
    name: string;
  };
  from?: 'patient' | 'healthIssue';
};

const AddGeneralNoteScreen: React.FC<AddDoctorGeneralNoteScreenProps> = (props) => {
  const { navigation, route } = props;
  const { patient } = route.params || {};
  const [note, setNote] = useState('');
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const theme = useAppTheme();

  const { isLoading: creatingGeneralNote, mutate: createGeneralNote } = useMutation(
    API.doctor.note.createPatientNote,
    {
      onSuccess() {
        toast.success('Note created successfully');
        queryClient.refetchQueries(['doctor/patient', patient.id]);
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
        navigationBar: {
          paddingTop: insets.top,
        },
        input: {
          flex: 1,
        },
      }),
    []
  );

  const handleSave = () => {
    createGeneralNote({
      description: note,
      patientId: patient.id,
    });
  };

  return (
    <KeyboardView>
      <Block flex1>
        <Block pH="xxxl" pB="xl" flexDirection="row" align="center" style={styles.navigationBar}>
          <Block pR="md" onPress={navigation.goBack}>
            <ArrowLeftIcon />
          </Block>
          <Image mR="md" uri={patient.imageUrl} size={48} circular />
          <Block mR="auto">
            <Typography variation="title3Bolder">General Note</Typography>
            <Typography variation="description1" style={{ marginTop: getSize(-4) }}>
              {patient.name}
            </Typography>
          </Block>
          {note.length > 5 && (
            <Block onPress={handleSave}>
              {creatingGeneralNote ? <ActivityIndicator /> : <Icon name="checked" />}
            </Block>
          )}
        </Block>

        <ScrollView>
          <Block pH="xxxl" flex1>
            <Typography mB="xxxl" variation="title2">
              New Note
            </Typography>

            <TextInput
              multiline
              value={note}
              onChangeText={setNote}
              placeholder="Start Typing..."
              placeholderTextColor={theme.colors.dark}
              style={styles.input}
            />
          </Block>
        </ScrollView>
      </Block>
    </KeyboardView>
  );
};

export default AddGeneralNoteScreen;
