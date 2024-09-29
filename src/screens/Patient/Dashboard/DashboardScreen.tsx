import Block from '@components/Block/Block';
import Icon from '@components/Icon/Icon';
import CareTeamIcon from '@components/Icons/CareTeamIcon';
import ChevronRightIcon from '@components/Icons/ChevronRightIcon';
import EmailVerificationIcon from '@components/Icons/EmailVerificationIcon';
import HealthIssueIcon from '@components/Icons/HealthissueIcon';
import HomeIcon from '@components/Icons/HomeIcon';
import LogoHorizontalWhite from '@components/Icons/LogoHorizontalWhite';
import PhoneIcon from '@components/Icons/PhoneIcon';
import Image from '@components/Image/Image';
import PrimaryNavigationBar from '@components/NavigationBar/PrimaryNavigationBar/PrimaryNavigationBar';
import ScrollView from '@components/ScrollView/ScrollView';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import Articles from '@modules/Patient/Dashboard/Articles/Articles';
import Doctors from '@modules/Patient/Dashboard/Doctors/Doctors';
import OnboardingButton from '@modules/Patient/Dashboard/OnboardingButton/OnboardingButton';
import Questionnaire from '@modules/Patient/Dashboard/Questionnaire/Questionnaire';
import { DashboardStackScreens } from '@navigation/Patient/DashboardStack';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { refetchPatient } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { useEffect } from 'react';
import { ActivityIndicator, StatusBar } from 'react-native';
import { useQueryClient } from 'react-query';

type PatientDashboardScreenProps = NativeStackScreenProps<
  DashboardStackScreens,
  Screens.DashboardScreen
>;

export type PatientDashboardScreenParams = undefined;

const PatientDashboardScreen: React.FC<PatientDashboardScreenProps> = (props) => {
  const { navigation } = props;
  const height = useBottomTabBarHeight();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (auth.patient?.on_free_trial === null) {
      navigation.navigate(Screens.SubscriptionScreen);
    }
  }, []);

  const handleRefresh = async () => {
    queryClient.refetchQueries('patient/newsfeed');
    dispatch(refetchPatient());
  };

  return (
    <Block flex1 pB={height}>
      <StatusBar barStyle="light-content" />
      <PrimaryNavigationBar>
        <Block
          pH="4xl"
          pT="xxxl"
          pB="5xl"
          align="center"
          flexDirection="row"
          justify="space-between">
          <Block />
          <LogoHorizontalWhite />
          {/* @ts-ignore */}
          <Block onPress={() => navigation.navigate('PatientProfileStack')}>
            <Icon name="profile" size={24} color="white" />
          </Block>
        </Block>
      </PrimaryNavigationBar>

      <Block zIndex={9} mT={-56 / 2} align="center">
        <Image uri={auth.patient?.patient_image_resized?.[3]?.image_url} size={56} circular />
      </Block>

      <Typography center variation="title1" mT="md">
        Your Dashboard
      </Typography>

      <ScrollView pT="xl" pB="xxl" refreshing={auth.refetchingProfile} onRefresh={handleRefresh}>
        {/* <Block pH="xxxl">
          <Notifications />
        </Block> */}
        {!auth.patient?.email_verified && (
          <Block pH="xxxl">
            <Block
              pV="xxl"
              pH="xxxl"
              shadow="sm"
              rounded="xxl"
              align="center"
              bgColor="white"
              flexDirection="row"
              justify="space-between">
              <EmailVerificationIcon />

              <Block mH="md" flex1>
                <Typography variation="title3Bolder" color="darkest">
                  Please verify your email
                </Typography>

                <Typography variation="description1" color="dark" numberOfLines={2}>
                  Click the link sent to {auth.patient?.email}
                </Typography>
              </Block>

              {auth.verifyingEmail ? <ActivityIndicator /> : <ChevronRightIcon />}
            </Block>
          </Block>
        )}

        <Doctors pH="xxxl" pT="4xl" />

        <Articles />

        {(auth.patient?.health_issues?.length! < 1 ||
          auth.patient?.medications?.length! < 1 ||
          auth.patient?.doctors?.length! < 1) && (
          <Block pH="xxxl">
            <Typography mT="xxxl" variation="title2Bolder" color="darkest">
              Next Steps
            </Typography>

            <Typography mT="xl" variation="title3Bolder" color="darkest">
              Complete your profile
            </Typography>
          </Block>
        )}

        <Block pH="xxxl">
          {auth.patient?.doctors.length! < 1 && (
            <OnboardingButton
              title="Add Doctors"
              icon={<CareTeamIcon />}
              onPress={() =>
                navigation.navigate(Screens.SearchDoctorScreen, {
                  from: 'PATIENT',
                  patient: {} as any,
                })
              }
            />
          )}

          {auth.patient?.health_issues.length! < 1 && (
            <OnboardingButton
              title="Add Health Issues"
              icon={<HealthIssueIcon />}
              onPress={() =>
                navigation.navigate(Screens.SearchHealthIssuesScreen, { from: 'PATIENT' })
              }
            />
          )}

          {auth.patient?.medications.length! < 1 && (
            <OnboardingButton
              title="Add Medications"
              icon={<HealthIssueIcon />}
              onPress={() => navigation.navigate(Screens.SearchMedicationScreen)}
            />
          )}

          {!auth.patient?.phone_number && (
            <OnboardingButton
              title="Provide Contact Information"
              icon={<PhoneIcon />}
              onPress={() => navigation.navigate(Screens.UpdateContactScreen)}
            />
          )}

          {!auth.patient?.address && (
            <OnboardingButton
              title="Provide Address"
              icon={<HomeIcon />}
              onPress={() => navigation.navigate(Screens.UpdateAddressScreen)}
            />
          )}
        </Block>

        <Questionnaire />
      </ScrollView>
    </Block>
  );
};

export default PatientDashboardScreen;
