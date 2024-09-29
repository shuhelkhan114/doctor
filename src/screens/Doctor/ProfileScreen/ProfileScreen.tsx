import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import Divider from '@components/Divider/Divider';
import ArrowLeftIcon from '@components/Icons/ArrowLeftIcon';
import LogoHorizontalWhite from '@components/Icons/LogoHorizontalWhite';
import Image from '@components/Image/Image';
import Modal from '@components/Modal/Modal';
import PrimaryNavigationBar from '@components/NavigationBar/PrimaryNavigationBar/PrimaryNavigationBar';
import ScrollView from '@components/ScrollView/ScrollView';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import { getChatAvailabilityText } from '@core/utils/chatAvailability';
import useAppTheme from '@hooks/useTheme';
import PersonalCode from '@modules/Doctor/DoctorProfile/PersonalCode/PersonalCode';
import SettingRow from '@modules/Doctor/DoctorProfile/SettingRow/SettingRow';
import AvailabilityDetail from '@modules/Doctor/Profile/AvailabilityDetail/AvailabilityDetail';
import LogoutModal from '@modules/Doctor/Profile/LogoutModal/LogoutModal';
import UpdateNPINumber from '@modules/Doctor/Profile/UpdateNumberCode/UpdateNumberCode';
import { StartStackScreens } from '@navigation/Doctor/StartStack';
import { useAppDispatch, useAppSelector } from '@store/store';
import { DoctorAvailability } from '@typings/model/doctor';
import { useQueryClient } from 'react-query';

type ProfileScreenProps = NativeStackScreenProps<StartStackScreens, Screens.DoctorProfileScreen>;

export type ProfileScreenParams = undefined;

const ProfileScreen: React.FC<ProfileScreenProps> = (props) => {
  const { navigation } = props;
  const [personalCodeModalVisible, setPersonalCodeModalVisible] = useState(false);
  const [npiNumberModalVisible, setNumberCodeModalVisible] = useState(false);
  const [availabilityModalVisible, setAvailabilityModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [loggingOut, setLoggingOut] = useState(false);

  const theme = useAppTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        logoutButton: {
          borderRadius: 8,
          backgroundColor: theme.colors.lightest2,
        },
        logoutButtonText: {
          color: theme.colors.negativeAction,
        },
        profileIcon: {
          marginTop: -56 / 2,
          zIndex: 9,
        },
      }),
    []
  );

  const { doctor } = auth;

  const chatAvailabilityText = useMemo(
    () => getChatAvailabilityText(auth.doctor?.chat_availibility!),
    [auth.doctor]
  );

  let availabilityText = '';

  if (doctor?.availablity === DoctorAvailability.ACCEPTING) {
    availabilityText = 'Accepting new patients on Doc Hello';
  } else if (doctor?.availablity === DoctorAvailability.NOT_ACCEPTING) {
    availabilityText = 'Not accepting new patients on Doc Hello';
  } else if (doctor?.availablity === DoctorAvailability.ONLY_VIA_REFERAL) {
    availabilityText = 'Accepting new patients only via referral';
  } else {
    availabilityText = 'Not set!';
  }

  return (
    <Block flex1>
      <LogoutModal visible={logoutModalVisible} closeModal={setLogoutModalVisible} />
      <PrimaryNavigationBar>
        <Block
          pH="4xl"
          pT="xxxl"
          pB="5xl"
          align="center"
          flexDirection="row"
          justify="space-between">
          <Block onPress={navigation.goBack}>
            <ArrowLeftIcon fill="white" />
          </Block>
          <LogoHorizontalWhite />
          <Block />
        </Block>
      </PrimaryNavigationBar>

      <Modal visible={availabilityModalVisible} onClose={setAvailabilityModalVisible}>
        <AvailabilityDetail closeModal={setAvailabilityModalVisible} />
      </Modal>

      <Modal visible={personalCodeModalVisible} onClose={setPersonalCodeModalVisible}>
        <PersonalCode
          closeModal={setPersonalCodeModalVisible}
          personalCode={doctor?.personal_code.toString() || ''}
        />
      </Modal>

      <Modal visible={npiNumberModalVisible} onClose={setNumberCodeModalVisible}>
        <UpdateNPINumber />
      </Modal>

      <Block align="center" style={styles.profileIcon}>
        <Image circular uri={doctor?.doctor_image} size={56} />
      </Block>

      <View>
        <Typography center variation="title1" mT="md">
          {doctor?.first_name} {doctor?.last_name}
        </Typography>
        <Typography variation="description1" center color="black">
          {doctor?.speciality}
        </Typography>
      </View>

      <ScrollView>
        <Block pH="4xl" mT="5xl" pB="4xl" flex1>
          <Typography color="darkest" variation="title2">
            Settings
          </Typography>

          <SettingRow
            title="NPI Code"
            subtitle={doctor?.npi || 'Not Set'}
            onPress={() => setNumberCodeModalVisible(true)}
          />

          <Divider />

          <SettingRow
            title="Your personal code"
            subtitle={doctor?.personal_code.toString()}
            onPress={() => setPersonalCodeModalVisible(true)}
          />

          <Divider />

          <SettingRow
            title="Chat availability"
            subtitle={chatAvailabilityText}
            onPress={() => navigation.navigate(Screens.ChatAvailabilityScreen)}
          />

          <Divider />

          <SettingRow
            title="New Patients"
            subtitleColor={
              doctor?.availablity === DoctorAvailability.NOT_ACCEPTING ? 'negativeAction' : 'dark'
            }
            subtitle={availabilityText}
            onPress={() => setAvailabilityModalVisible(true)}
          />

          <Typography mT="5xl" color="darkest" variation="title2">
            Your information
          </Typography>

          <SettingRow
            title="Office Address 1"
            {...(doctor?.city
              ? {
                  subtitle: doctor.address || undefined,
                  description1: `${doctor.apartment ? doctor.apartment + ' ' : ''}${doctor.city}`,
                  description2: `${doctor.state} ${doctor.zip}`,
                }
              : { description: 'No address set!' })}
            onPress={() => navigation.navigate(Screens.UpdateAddressScreen)}
          />

          <Divider />

          <SettingRow
            title="Contact information"
            subtitle={doctor?.contact || 'Not set'}
            onPress={() => navigation.navigate(Screens.UpdateContactScreen)}
          />

          <Block mT="6xl">
            <Button
              title="Logout"
              variation="secondary"
              style={styles.logoutButton}
              onPress={() => setLogoutModalVisible(true)}
              textStyle={styles.logoutButtonText}
            />
          </Block>
        </Block>
      </ScrollView>
    </Block>
  );
};

export default ProfileScreen;
