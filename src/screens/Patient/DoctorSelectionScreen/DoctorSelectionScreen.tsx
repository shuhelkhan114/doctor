import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Checkbox from 'expo-checkbox';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image } from 'react-native';

import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import ErrorText from '@components/ErrorText/ErrorText';
import Icon from '@components/Icon/Icon';
import DisabledIcon from '@components/Icons/DisabledIcon';
import VerifiedIcon from '@components/Icons/VerifiedIcon';
import KeyboardView from '@components/KeyboardView/KeyboardView';
import Modal from '@components/Modal/Modal';
import ScrollView from '@components/ScrollView/ScrollView';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import API from '@core/services';
import { logError } from '@core/utils/logger';
import { getSize } from '@core/utils/responsive';
import useAppTheme from '@hooks/useTheme';
import DoctorConfirmation from '@modules/Patient/DoctorSelection/DoctorConfimation/DoctorConfirmation';
import FHIROnboardingHeader from '@modules/Shared/FHIROnboardingHeader/FHIROnboardingHeader';
import { AuthStackScreens } from '@navigation/AuthStack';
import { fetchFHIRDoctors, updateDoctor } from '@store/slices/patientOnboardingSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { FHIRDoctor } from '@typings/api-responses/fhir/doctor';
import { useMutation } from 'react-query';

type DoctorSelectionScreenProps = NativeStackScreenProps<
  AuthStackScreens,
  Screens.DoctorSelectionScreen
>;

export type DoctorSelectionParams = {
  isManualSignup?: boolean;
};

const DoctorSelectionScreen: React.FC<DoctorSelectionScreenProps> = (props) => {
  const { navigation, route } = props;
  const { isManualSignup } = route.params || {};

  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  const { mutateAsync: addDoctor, isLoading } = useMutation(API.patient.request.sendRequest);
  const {
    isLoading: sendingRequestToNonDocHelloDoctor,
    mutateAsync: sendRequestToNonDocHelloDoctor,
  } = useMutation(API.patient.request.sendDoctorRequestInactive);
  const fhirDoctorsState = useAppSelector((state) => state.patientOnboarding.doctors);
  const patientId = useAppSelector((state) => state.patientOnboarding.patientId);

  const [selectedDoctor, setSelectedDoctor] = useState<FHIRDoctor | null>(null);

  useEffect(() => {
    if (patientId && !isManualSignup) {
      dispatch(fetchFHIRDoctors(patientId));
    }
  }, [patientId]);

  const handleContinue = async () => {
    try {
      const confirmedDoctors = fhirDoctorsState.data.filter(
        (doctor) => doctor.status === 'confirmed'
      );
      const confirmedNonFHIRDoctors = confirmedDoctors.filter((doctor) => !doctor.isFHIRDoctor);
      const confirmedFHIRDoctors = confirmedDoctors.filter((doctor) => doctor.isFHIRDoctor);

      // Send request to doctors who are in Doc Hello
      if (confirmedNonFHIRDoctors.length > 0) {
        // TODO: use API endpoint with batch send request
        await Promise.all(
          confirmedDoctors
            .filter((doctor) => !doctor.isFHIRDoctor)
            .map((doctor) => addDoctor(doctor.id))
        );
      }

      // Send request to doctors who are not in Doc Hello (inactive)
      if (confirmedFHIRDoctors.length > 0) {
        await sendRequestToNonDocHelloDoctor(
          confirmedDoctors
            .filter((doctor) => doctor.isFHIRDoctor)
            .map((doctor) => {
              const nameSplit = doctor.name.split(' ');
              return {
                first_name: nameSplit[0],
                last_name: nameSplit[nameSplit.length - 1],
              };
            })
        );
      }
      if (isManualSignup) {
        navigation.navigate(Screens.HealthIssuesSelectionScreen, {
          isManualSignup,
        });
      } else {
        navigation.navigate(Screens.GaeaSearchingScreen, {
          title: 'Back to care team',
          nextScreen: 'HealthIssuesSelectionScreen',
          description: 'Searching for you health issues',
        });
      }
    } catch (error) {
      logError(error);
    }
  };

  const handleClose = () => {
    setSelectedDoctor(null);
  };

  const handleConfirmDoctor = () => {
    if (selectedDoctor) {
      dispatch(updateDoctor({ id: selectedDoctor.id, status: 'confirmed' }));
      setSelectedDoctor(null);
    }
  };

  const handleCancelDoctor = () => {
    if (selectedDoctor) {
      dispatch(updateDoctor({ id: selectedDoctor.id, status: 'rejected' }));
      setSelectedDoctor(null);
    }
  };

  const navigateToSearchDoctor = () => {
    navigation.navigate(Screens.SearchDoctorScreen, {
      onboarding: true,
    });
  };

  let content = <></>;

  if (fhirDoctorsState.fetching) {
    content = <ActivityIndicator color={theme.colors.mainBlue} />;
  } else if (fhirDoctorsState.error) {
    content = (
      <Block>
        <ErrorText error={{ message: 'Unable to fetch data from FHIR' }} />
      </Block>
    );
  } else if (fhirDoctorsState.data.length < 1) {
    content = (
      <Block align="center">
        <Image
          source={require('@assets/no-careteam.png')}
          style={{ width: '50%' }}
          resizeMode="contain"
        />
        <Typography center variation="title3">
          It seems like your don't have any doctors in your care team.
        </Typography>
        <Button
          mT="xxxl"
          mB="xxl"
          title="Add Doctor"
          variation="secondary"
          onPress={navigateToSearchDoctor}
        />
      </Block>
    );
  } else {
    content = (
      <>
        <Typography variation="title3Bolder">Are they part of your team?</Typography>
        {!isManualSignup && (
          <Typography variation="description1Bolder" mT="4xl">
            Physicians on Doc Hello
          </Typography>
        )}
        {fhirDoctorsState.data.filter((doctor) => !doctor.isFHIRDoctor).length < 1 ? (
          <Typography>No doctors found!</Typography>
        ) : (
          fhirDoctorsState.data
            .filter((doctor) => !doctor.isFHIRDoctor)
            .map((doctor) => {
              const handleCheck = () => {
                setSelectedDoctor(doctor);
              };

              let asideItem = <></>;

              if (doctor.status === 'undetermined') {
                asideItem = <Checkbox />;
              } else if (doctor.status === 'confirmed') {
                asideItem = <Icon name="tick" size={24} />;
              } else {
                asideItem = <DisabledIcon />;
              }

              return (
                <Block
                  pV="md"
                  key={doctor.id}
                  flexDirection="row"
                  align="center"
                  justify="space-between"
                  onPress={handleCheck}>
                  <Block flexDirection="row" align="center" maxWidth="90%">
                    <Image
                      source={{
                        uri: doctor.imageUrl,
                      }}
                      style={{
                        height: getSize(56),
                        width: getSize(56),
                        borderRadius: 56,
                      }}
                    />
                    <Block mL="xxl" maxWidth="80%">
                      <Block flexDirection="row" align="center">
                        <Typography numberOfLines={1} variation="title3" mR="md">
                          {doctor.name}
                        </Typography>
                        <VerifiedIcon />
                      </Block>
                      <Typography numberOfLines={1} variation="description1" color="dark">
                        {doctor.speciality}
                      </Typography>
                    </Block>
                  </Block>

                  {asideItem}
                </Block>
              );
            })
        )}

        <Button
          mT="xxxl"
          mB="xxl"
          title="Add Doctor"
          variation="secondary"
          onPress={navigateToSearchDoctor}
        />

        {!isManualSignup && (
          <>
            <Typography variation="description1Bolder" mT="4xl">
              Physicians not on Doc Hello
            </Typography>

            {fhirDoctorsState.data
              .filter((doctor) => doctor.isFHIRDoctor)
              .map((doctor) => {
                const handleCheck = () => {
                  setSelectedDoctor(doctor);
                };

                let asideItem = <></>;

                if (doctor.status === 'undetermined') {
                  asideItem = <Checkbox onValueChange={handleCheck} />;
                } else if (doctor.status === 'confirmed') {
                  asideItem = <Icon name="tick" size={24} />;
                } else {
                  asideItem = <DisabledIcon />;
                }

                return (
                  <Block
                    pV="md"
                    key={doctor.id}
                    align="center"
                    flexDirection="row"
                    onPress={handleCheck}
                    justify="space-between">
                    <Block flexDirection="row" align="center" flex1 overflow="hidden" mR="xl">
                      <Image
                        source={{
                          uri: doctor.imageUrl,
                        }}
                        style={{
                          height: getSize(56),
                          width: getSize(56),
                          borderRadius: 56,
                        }}
                      />
                      <Block mL="lg">
                        <Typography numberOfLines={1} variation="title3">
                          {doctor.name}
                        </Typography>
                        <Typography numberOfLines={1} variation="description1" color="dark">
                          {doctor.speciality}
                        </Typography>
                      </Block>
                    </Block>

                    <Block>{asideItem}</Block>
                  </Block>
                );
              })}
          </>
        )}
      </>
    );
  }

  const disabled =
    fhirDoctorsState.fetching ||
    (fhirDoctorsState.data?.length > 0
      ? fhirDoctorsState.data?.some((doctor) => doctor.status === 'undetermined')
      : false);

  return (
    <KeyboardView>
      <Modal visible={!!selectedDoctor} onClose={handleClose}>
        {selectedDoctor && (
          <DoctorConfirmation
            closeModal={handleClose}
            doctor={selectedDoctor}
            onConfirm={handleConfirmDoctor}
            onCancel={handleCancelDoctor}
          />
        )}
      </Modal>

      <FHIROnboardingHeader
        title={isManualSignup ? 'Please search and add your doctors' : 'I found these physicians'}
      />

      <Block pH="xxxl" pV="xxxl" bgColor="white" style={{ flex: 1 }}>
        <Block mB="auto">
          <ScrollView>{content}</ScrollView>
        </Block>

        <Button
          disabled={disabled}
          loading={isLoading || sendingRequestToNonDocHelloDoctor}
          title="Confirm and Continue"
          onPress={handleContinue}
        />
      </Block>
    </KeyboardView>
  );
};

export default DoctorSelectionScreen;
