import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import ErrorText from '@components/ErrorText/ErrorText';
import Icon from '@components/Icon/Icon';
import DisabledIcon from '@components/Icons/DisabledIcon';
import KeyboardView from '@components/KeyboardView/KeyboardView';
import Modal from '@components/Modal/Modal';
import ScrollView from '@components/ScrollView/ScrollView';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import API from '@core/services';
import { logError } from '@core/utils/logger';
import useAppTheme from '@hooks/useTheme';
import HealthIssueConfirmation from '@modules/Patient/HealthIssueSelection/HealthIssueConfirmation/HealthIssueConfirmation';
import FHIROnboardingHeader from '@modules/Shared/FHIROnboardingHeader/FHIROnboardingHeader';
import { AuthStackScreens } from '@navigation/AuthStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchFHIRHealthIssues, updateHealthIssue } from '@store/slices/patientOnboardingSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { FHIRHealthIssue } from '@typings/api-responses/fhir/healthIssue';
import Checkbox from 'expo-checkbox';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image } from 'react-native';
import { useMutation } from 'react-query';

type HealthIssuesSelectionScreenProps = NativeStackScreenProps<
  AuthStackScreens,
  Screens.HealthIssuesSelectionScreen
>;

export type HealthIssuesSelectionScreenParams = {
  isManualSignup?: boolean;
};

const HealthIssuesSelectionScreen: React.FC<HealthIssuesSelectionScreenProps> = (props) => {
  const { navigation, route } = props;
  const { isManualSignup } = route.params || {};

  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  const {
    mutateAsync: addHealthIssue,
    isLoading,
    isError,
    error,
  } = useMutation(API.patient.healthIssue.addPatientHealthIssue);
  const [selectedHealthIssue, setSelectedHealthIssue] = useState<FHIRHealthIssue | null>(null);

  const fhirHealthIssuesState = useAppSelector((state) => state.patientOnboarding.healthIssues);
  const patientId = useAppSelector((state) => state.patientOnboarding.patientId);

  useEffect(() => {
    if (patientId && !isManualSignup) {
      dispatch(fetchFHIRHealthIssues(patientId));
    }
  }, [patientId]);

  const handleConfirmHealthIssue = () => {
    dispatch(
      updateHealthIssue({
        id: selectedHealthIssue?.id!,
        status: 'confirmed',
      })
    );
    setSelectedHealthIssue(null);
  };

  const handleCancelHealthIssue = () => {
    dispatch(
      updateHealthIssue({
        id: selectedHealthIssue?.id!,
        status: 'rejected',
      })
    );
    setSelectedHealthIssue(null);
  };

  const handleContinue = async () => {
    try {
      const confirmedHealthIssues = fhirHealthIssuesState.data.filter(
        (healthIssue) => healthIssue.status === 'confirmed'
      );
      if (confirmedHealthIssues.length > 0) {
        await Promise.all(
          confirmedHealthIssues.map((healthIssue) =>
            addHealthIssue({
              name: healthIssue.name,
              severity: 'low',
              description: 'test description',
            })
          )
        );
      }
      navigation.navigate(Screens.GaeaSearchingScreen, {
        title: 'Back to health issues',
        nextScreen: 'PatientDashboardScreen',
        description: 'Putting your profile together',
        setOnboardingDone: true,
      });
    } catch (error) {
      logError(error);
    }
  };

  const handleClose = () => {
    setSelectedHealthIssue(null);
  };

  const navigationToAddHealthIssue = () => {
    navigation.navigate(Screens.SearchHealthIssuesScreen, { onboarding: true });
  };

  let content = <></>;

  if (fhirHealthIssuesState.fetching) {
    content = <ActivityIndicator color={theme.colors.mainBlue} />;
  } else if (fhirHealthIssuesState.error) {
    content = (
      <Block>
        <ErrorText error={{ message: 'Unable to fetch data from FHIR' }} />
      </Block>
    );
  } else if (fhirHealthIssuesState.data.length < 1) {
    content = (
      <Block align="center">
        <Image
          source={require('@assets/no-healthissues.png')}
          style={{ width: '50%' }}
          resizeMode="contain"
        />
        <Typography center variation="title3" mB="5xl">
          It seems like you don't have any health issues. Add them or hit continue
        </Typography>
      </Block>
    );
  } else {
    content = (
      <>
        {fhirHealthIssuesState.data.map((healthIssue, index) => {
          const { name, status } = healthIssue;
          const handleCheck = () => {
            setSelectedHealthIssue(healthIssue);
          };

          let asideItem = <></>;

          if (status === 'undetermined') {
            asideItem = <Checkbox onValueChange={handleCheck} />;
          } else if (status === 'confirmed') {
            asideItem = <Icon name="tick" size={24} />;
          } else {
            asideItem = <DisabledIcon />;
          }

          return (
            <Block
              pV="xl"
              flexDirection="row"
              align="center"
              justify="space-between"
              bC="lightest"
              bBW={index === fhirHealthIssuesState.data.length - 1 ? 0 : 1}
              key={healthIssue.id}
              onPress={handleCheck}>
              <Block>
                <Typography variation="title2">{name}</Typography>
              </Block>

              {asideItem}
            </Block>
          );
        })}
      </>
    );
  }

  const disabled =
    fhirHealthIssuesState.fetching ||
    (fhirHealthIssuesState.data?.length > 0
      ? fhirHealthIssuesState.data?.some((medicine) => medicine.status === 'undetermined')
      : false);

  return (
    <KeyboardView>
      <Modal visible={!!selectedHealthIssue} onClose={handleClose}>
        {selectedHealthIssue && (
          <HealthIssueConfirmation
            closeModal={handleClose}
            healthIssue={selectedHealthIssue}
            onConfirm={handleConfirmHealthIssue}
            onCancel={handleCancelHealthIssue}
          />
        )}
      </Modal>

      <FHIROnboardingHeader title="I found these health issues" />

      <Block flex1 pH="xxxl" pV="xxxl" bgColor="white">
        {isError && <ErrorText error={error} />}

        <Block mB="auto" flex1>
          <ScrollView>
            {content}

            <Button
              title="Add health issue"
              mT="xxxl"
              variation="secondary"
              mB="xxl"
              onPress={navigationToAddHealthIssue}
            />
          </ScrollView>
        </Block>

        <Button disabled={disabled} loading={isLoading} title="Continue" onPress={handleContinue} />
      </Block>
    </KeyboardView>
  );
};

export default HealthIssuesSelectionScreen;
