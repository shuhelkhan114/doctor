import Block from '@components/Block/Block';
import Chip from '@components/Chip/Chip';
import ErrorText from '@components/ErrorText/ErrorText';
import Image from '@components/Image/Image';
import KeyboardView from '@components/KeyboardView/KeyboardView';
import Spinner from '@components/Loaders/Spinner';
import ModalHandle from '@components/ModalHandle/ModalHandle';
import ScrollView from '@components/ScrollView/ScrollView';
import Search from '@components/Search/Search';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import toastConfig from '@core/config/toastConfig';
import API from '@core/services';
import DoctorRow from '@modules/Patient/AddDoctor/DoctorRow/DoctorRow';
import { CareTeamStackScreens } from '@navigation/Patient/CareTeamStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppSelector } from '@store/store';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useQuery } from 'react-query';

type AddDoctorScreenProps = NativeStackScreenProps<CareTeamStackScreens, Screens.AddDoctorScreen>;

export type AddDoctorScreenParams = undefined;

const AddDoctorScreen: React.FC<AddDoctorScreenProps> = () => {
  const [search, setSearch] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState('');

  const config = useAppSelector((state) => state.auth.config);

  const { isLoading, error, data } = useQuery(
    ['patient/doctors', search, selectedSpeciality],
    () =>
      API.patient.doctor.searchDoctors({
        ...(search && { search }),
        ...(selectedSpeciality && { speciality: selectedSpeciality }),
      }),
    { enabled: !!search || !!selectedSpeciality }
  );

  let content: React.ReactNode = null;

  if (isLoading) {
    content = <Spinner />;
  } else if (error) {
    content = <ErrorText error={error} />;
  } else if (data?.doctors.length === 0) {
    content = (
      <Block align="center" mT="5xl">
        <Image width={133} height={126.62} source={require('@assets/no-doctors.png')} />
        <Typography mT="xl" variation="description1" center>
          The doctor you are looking for is not on Doc Hello
        </Typography>
      </Block>
    );
  } else {
    content = (
      <ScrollView mT="xl">
        {data?.doctors.map((doctor, index) => {
          return (
            <DoctorRow
              bC="lightest"
              key={doctor.id}
              doctor={doctor}
              bBW={index === data?.doctors.length - 1 ? 0 : 1}
            />
          );
        })}
      </ScrollView>
    );
  }

  return (
    <KeyboardView>
      <Block absolute width="100%" top={0} left={0} zIndex={999999999999999999999}>
        <Toast config={toastConfig} />
      </Block>
      <Block flex1>
        <ModalHandle />
        <Block pH="xxxl" flex1>
          <Typography variation="title2Bolder">Search doctors</Typography>

          <Search
            mT="xxl"
            value={search}
            onClear={setSearch}
            onSearch={setSearch}
            placeholder="Search doctors"
          />

          <Block>
            <ScrollView horizontal mT="sm">
              {config.specialities.map((speciality) => {
                return (
                  <Chip
                    mR="xl"
                    key={speciality}
                    text={speciality}
                    selectedBgColor="accent"
                    selectedTextColor="secondaryBlue"
                    selected={selectedSpeciality === speciality}
                    onPress={() =>
                      selectedSpeciality === speciality
                        ? setSelectedSpeciality('')
                        : setSelectedSpeciality(speciality)
                    }
                  />
                );
              })}
            </ScrollView>
          </Block>

          <Block flex1>{content}</Block>
        </Block>
      </Block>
    </KeyboardView>
  );
};

export default AddDoctorScreen;
