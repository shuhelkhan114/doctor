import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import DropDown, { DropDownOption } from '@components/DropDown/DropDown';
import ArrowLeftIcon from '@components/Icons/ArrowLeftIcon';
import Image from '@components/Image/Image';
import PrimaryNavigationBar from '@components/NavigationBar/PrimaryNavigationBar/PrimaryNavigationBar';
import ScrollView from '@components/ScrollView/ScrollView';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import API from '@core/services';
import { getSize } from '@core/utils/responsive';
import Note from '@modules/Doctor/Notes/Note/Note';
import { PatientsStackScreens } from '@navigation/Doctor/PatientsStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ActivityIndicator, StatusBar } from 'react-native';
import { useQuery } from 'react-query';

type GeneralNotesScreenProps = NativeStackScreenProps<
  PatientsStackScreens,
  Screens.GeneralNotesScreen
>;

export type GeneralNotesScreenParams = {
  patient: {
    id: string;
    name: string;
    imageUrl: string;
  };
};

const filterOptions: DropDownOption[] = [
  {
    label: 'All notes',
    value: 'All notes',
  },
];

const GeneralNotesScreen: React.FC<GeneralNotesScreenProps> = (props) => {
  const { navigation, route } = props;
  const { patient } = route.params || {};
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0].value);

  const { isLoading, isError, data, isRefetching, refetch } = useQuery(
    ['doctor/patient', patient.id],
    () => API.doctor.patient.fetchSinglePatient(patient.id)
  );

  const navigateToNotesScreen = () => {
    navigation.navigate(Screens.AddGeneralNoteScreen, {
      patient: {
        id: patient.id,
        name: patient.name,
        imageUrl: patient.imageUrl,
      },
    });
  };

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
  } else if (data) {
    if (data?.general_notes.length < 1) {
      content = (
        <Block>
          <Typography> No notes found!</Typography>
        </Block>
      );
    } else {
      content = data.general_notes.map((note) => {
        return <Note key={note.id} note={note} />;
      });
    }
  }

  return (
    <Block flex1>
      <StatusBar barStyle="light-content" />
      <PrimaryNavigationBar>
        <Block pH="xxxl" pB="xl" flexDirection="row" align="center">
          <Block pR="md" onPress={navigation.goBack}>
            <ArrowLeftIcon fill="white" />
          </Block>
          <Image mR="md" uri={patient.imageUrl} size={48} circular />
          <Block>
            <Typography variation="title3Bolder" color="white">
              General Notes
            </Typography>
            <Typography variation="description1" color="white" style={{ marginTop: getSize(-4) }}>
              {patient.name}
            </Typography>
          </Block>
        </Block>
      </PrimaryNavigationBar>
      <Block pH="xl" pV="xl" flex1>
        <DropDown
          placeholder="Select Filter"
          value={selectedFilter}
          options={filterOptions}
          onSelect={setSelectedFilter}
        />

        <Block mB="xl" />

        <ScrollView pB="7xl">{content}</ScrollView>
      </Block>
      <Block absolute left={0} bottom={10} justify="center" align="center" width="100%">
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

export default GeneralNotesScreen;
