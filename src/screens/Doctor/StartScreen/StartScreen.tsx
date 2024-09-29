import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import MCIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TourGuideZone, useTourGuideController } from 'rn-tourguide';

import { Screens } from '@core/config/screens';
import { getSize } from '@core/utils/responsive';
import useAppTheme from '@hooks/useTheme';
import { StartStackScreens } from '@navigation/Doctor/StartStack';
import { doneDoctorTour, refetchDoctor, setDoctorNPINumberAsked } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@store/store';

import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import Icon from '@components/Icon/Icon';
import CampaignIcon from '@components/Icons/CampaignIcon';
import ChevronRightIcon from '@components/Icons/ChevronRightIcon';
import LogoHorizontalWhite from '@components/Icons/LogoHorizontalWhite';
import Image from '@components/Image/Image';
import Modal from '@components/Modal/Modal';
import PrimaryNavigationBar from '@components/NavigationBar/PrimaryNavigationBar/PrimaryNavigationBar';
import ScrollView from '@components/ScrollView/ScrollView';
import Typography from '@components/Typography/Typography';
import toast from '@core/lib/toast';
import { getChatAvailabilityText } from '@core/utils/chatAvailability';
import PersonalCode from '@modules/Doctor/DoctorProfile/PersonalCode/PersonalCode';
import UpdateNPINumber from '@modules/Doctor/Profile/UpdateNumberCode/UpdateNumberCode';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

type StartScreenProps = NativeStackScreenProps<StartStackScreens, Screens.StartScreen>;

export type StartScreenParams = object;

const StartScreen: React.FC<StartScreenProps> = (props) => {
  const { navigation } = props;

  const theme = useAppTheme();
  const height = useBottomTabBarHeight();
  const { canStart, start, eventEmitter } = useTourGuideController();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const [personalCodeModalVisible, setPersonalCodeModalVisible] = useState(false);
  const [npiNumberModalVisible, setNPInumberModalVisible] = useState(false);
  const doctorTourDone = useAppSelector((state) => state.auth.doctorTourDone);
  const npiNumberAsked = useAppSelector((state) => state.auth.doctorNPINumberAsked);

  useEffect(() => {
    if (canStart && !doctorTourDone) start();
  }, [canStart]);

  useEffect(() => {
    if (!npiNumberAsked && !auth.doctor?.npi) {
      setNPInumberModalVisible(true);
    }
  }, [npiNumberAsked]);

  useEffect(() => {
    eventEmitter?.on('stop', () => dispatch(doneDoctorTour()));
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          paddingBottom: height,
        },
        header: {
          height: '15%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.mainBlue,
        },
        doctorImageContainer: {
          alignItems: 'center',
          marginTop: -56 / 2,
          zIndex: 9,
        },
        contentContainer: {
          paddingHorizontal: theme.spacing.xxxl,
          paddingTop: theme.spacing['xxl'],
          paddingBottom: theme.spacing.xxxl,
        },
        iconContainer: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        icon: {
          width: getSize(24),
          height: getSize(24),
          marginRight: theme.spacing.md,
        },
        cardContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: theme.spacing.xl,
        },
        card: {
          backgroundColor: 'white',
          ...theme.shadow.sm,
          width: '48%',
          borderRadius: 16,
          padding: getSize(16),
        },
      }),
    []
  );

  const navigationToProfileScreen = () => navigation.navigate(Screens.DoctorProfileScreen);
  const handleRefresh = () => dispatch(refetchDoctor());

  const chatAvailabilityText = useMemo(
    () => getChatAvailabilityText(auth.doctor?.chat_availibility!),
    [auth.doctor]
  );

  return (
    <View style={styles.container} testID="start-screen">
      <Modal onClose={setPersonalCodeModalVisible} visible={personalCodeModalVisible}>
        <PersonalCode
          personalCode={auth.doctor?.personal_code?.toString() || ''}
          closeModal={setPersonalCodeModalVisible}
        />
      </Modal>

      <Modal
        visible={npiNumberModalVisible}
        onClose={() => {
          setNPInumberModalVisible(false);
          dispatch(setDoctorNPINumberAsked(true));
          toast.success('You can always update your NPI number in your profile');
        }}>
        <UpdateNPINumber closeModal={setNPInumberModalVisible} />
      </Modal>

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
          <Block onPress={navigationToProfileScreen}>
            <Icon name="profile" size={24} color="white" />
          </Block>
        </Block>
      </PrimaryNavigationBar>

      <View style={styles.doctorImageContainer}>
        <Image circular uri={auth.doctor?.doctor_image} size={56} />
      </View>

      <Block pB="xl">
        <Typography
          center
          variation="title1"
          style={{
            ...theme.fonts.medium,
            fontSize: getSize(24),
            marginTop: theme.spacing.md,
            lineHeight: 36,
          }}>
          {auth.doctor?.first_name + ' ' + auth.doctor?.last_name}
        </Typography>
        <Typography variation="description1" center color="dark">
          {auth.doctor?.speciality}
        </Typography>
      </Block>

      <ScrollView
        pH="xxxl"
        pT="xxl"
        pB="xxxl"
        onRefresh={handleRefresh}
        refreshing={auth.refetchingProfile}>
        {auth.doctor?.inapp_notifications_count! > 0 && (
          <Block
            pH="xxxl"
            pV="xl"
            mB="xl"
            shadow="sm"
            rounded="xxl"
            align="center"
            bgColor="white"
            flexDirection="row"
            onPress={() => navigation.navigate(Screens.NotificationsScreen)}>
            <CampaignIcon />
            <Block mL="xl" flex1>
              <Typography variation="title3" color="darkest">
                Missed notifications
              </Typography>
              <Typography variation="description1" numberOfLines={1} color="dark">
                {auth.doctor?.inapp_notifications_count} notifications not seen
              </Typography>
            </Block>
            <ChevronRightIcon />
          </Block>
        )}

        <Typography variation="title3Bolder">Your Patients</Typography>

        <TourGuideZone
          zone={1}
          maskOffset={0}
          shape="rectangle"
          tooltipBottomOffset={60}
          text="Invite your patients to join Doc Hello">
          <Block shadow="sm" bgColor="white" pH="xxxl" pV="xl" rounded="xxl" mT="xxl">
            <Block flexDirection="row" justify="space-between" align="center">
              <Block>
                <Typography variation="title3Bolder" color="darkest">
                  Your personal code
                </Typography>
                <Typography variation="description1" color="dark" mT="xs">
                  Share it with your patients
                </Typography>
              </Block>
              <Typography color="dark" variation="title3Bolder">
                {auth.doctor?.personal_code}
              </Typography>
            </Block>

            <Button
              mT="md"
              icon="user-add"
              iconColor="white"
              title="Invite Patients"
              style={{ borderRadius: 6, paddingVertical: 12 }}
              onPress={() => navigation.navigate(Screens.InvitePatientsScreen)}
            />
          </Block>
        </TourGuideZone>

        <Block mB="xl" />

        <TourGuideZone
          zone={2}
          text="Invite your patients to join Doc Hello"
          tooltipBottomOffset={260}>
          <Block
            flexDirection="row"
            shadow="sm"
            bgColor="white"
            pL="xxxl"
            pR="xl"
            pV="xxl"
            rounded="xxl"
            onPress={() => navigation.navigate(Screens.MonetizationScreen)}
            align="center">
            <Icon name="paid" />
            <Block mL="xl" mR="auto">
              {auth.doctor?.paypal_payment_id || auth.doctor?.venmo_payment_id ? (
                <>
                  <Typography color="darkest" variation="title3Bolder">
                    Patient monthly revenue
                  </Typography>
                  <Typography color="positiveAction" variation="description1">
                    {/* TODO: Fix this */}
                    No revenue yet!
                  </Typography>
                </>
              ) : (
                <Typography mT="xs" variation="description1">
                  Setup monetization
                </Typography>
              )}
            </Block>
            <MCIcons size={28} name="chevron-right" color={theme.colors.mainBlue} />
          </Block>
        </TourGuideZone>

        <View style={styles.cardContainer}>
          <Block
            style={styles.card}
            // @ts-ignore
            onPress={() => navigation.navigate('PatientsStack')}>
            <Typography color="darkest" variation="description1Bolder" center>
              Patients
            </Typography>
            <Typography
              center
              color="dark"
              variation="title1Bolder"
              style={{ ...theme.fonts.bold }}>
              {auth.doctor?.total_patient || 0}
            </Typography>
            {auth.doctor?.total_patient! > 0 && (
              <Typography variation="description1" center mT="md">
                View all
              </Typography>
            )}
          </Block>

          <Block style={styles.card} onPress={() => navigation.navigate(Screens.RequestsScreen)}>
            <Typography color="darkest" variation="description1Bolder" center>
              Patient requests
            </Typography>
            <Typography
              center
              variation="title1Bolder"
              color="dark"
              style={{ ...theme.fonts.bold }}>
              {auth.doctor?.total_request || 0}
            </Typography>
            {auth.doctor?.total_request! > 0 && (
              <Typography variation="description1" center mT="md">
                View all
              </Typography>
            )}
          </Block>
        </View>

        <Block pB="xl" />

        <TourGuideZone
          zone={3}
          text="Invite your patients to join Doc Hello"
          tooltipBottomOffset={150}>
          <Block
            flexDirection="row"
            shadow="sm"
            bgColor="white"
            pL="xxxl"
            pR="xl"
            pV="xxl"
            rounded="xxl"
            align="center"
            onPress={() => navigation.navigate(Screens.ChatAvailabilityScreen)}>
            <MCIcons size={28} name="calendar-month-outline" color={theme.colors.dark} />
            <Block mL="xl" style={{ marginRight: 'auto' }}>
              <Typography variation="title3Bolder" color="darkest">
                Set your chat availability
              </Typography>
              <Typography
                variation="description1"
                color={auth.doctor?.chat_availibility?.length! < 1 ? 'negativeAction' : 'dark'}
                mT="xs">
                {chatAvailabilityText}
              </Typography>
            </Block>
            <MCIcons size={28} name="chevron-right" color={theme.colors.mainBlue} />
          </Block>
        </TourGuideZone>
      </ScrollView>
    </View>
  );
};

export default StartScreen;
