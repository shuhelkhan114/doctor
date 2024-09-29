import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import LogoHorizontalWhite from '@components/Icons/LogoHorizontalWhite';
import PencilIcon from '@components/Icons/PencilIcon';
import PrimaryNavigationBar from '@components/NavigationBar/PrimaryNavigationBar/PrimaryNavigationBar';
import Typography from '@components/Typography/Typography';
import { useChat } from '@context/ChatContext';
import { Screens } from '@core/config/screens';
import { chatClient } from '@core/lib/stream-chat';
import toast from '@core/lib/toast';
import API from '@core/services';
import { logError } from '@core/utils/logger';
import { getSize } from '@core/utils/responsive';
import useAppTheme from '@hooks/useTheme';
import BasicInfoRow from '@modules/Patient/Profile/BasicInfoRow/BasicInfoRow';
import { ProfileStackScreens } from '@navigation/Patient/ProfileStack';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { logout, refetchPatient } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet } from 'react-native';
import { useQueryClient } from 'react-query';

type ProfileScreenProps = NativeStackScreenProps<ProfileStackScreens, Screens.ProfileScreen>;

export type ProfileScreenParams = object;

const ProfileScreen: React.FC<ProfileScreenProps> = (props) => {
  const { navigation } = props;
  const [loggingOut, setLoggingOut] = useState(false);
  const [updatingImage, setUpdatingImage] = useState(false);
  const queryClient = useQueryClient();

  const height = useBottomTabBarHeight();
  const theme = useAppTheme();
  const { setChannel } = useChat();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        imageContainer: {
          alignItems: 'center',
          marginTop: -56 / 2,
          zIndex: 9,
          position: 'relative',
        },
        image: {
          width: getSize(56),
          height: getSize(56),
          borderRadius: 56,
        },
        logoutButton: {
          borderRadius: 8,
          backgroundColor: theme.colors.lightest2,
        },
        logoutButtonText: {
          color: theme.colors.negativeAction,
        },
        editIcon: {
          bottom: -2,
          right: -2,
          backgroundColor: 'white',
          borderRadius: 100,
          padding: 2,
          borderWidth: 1,
          borderColor: theme.colors.mainBlue,
        },
      }),
    []
  );

  const pickImage = async () => {
    try {
      setUpdatingImage(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        const url = result.assets[0].uri;
        const fileExtension = url.split('.').pop();
        const destinationUri = `${FileSystem.documentDirectory}${Date.now()}.${fileExtension}`;
        await FileSystem.moveAsync({
          from: url,
          to: destinationUri,
        });
        const uploadRes = await API.patient.auth.uploadImage(destinationUri);
        await API.patient.auth.updateProfile({
          patient_image: uploadRes.image_url,
        });
        await dispatch(refetchPatient());
        toast.success('Image updated successfully');
      } else {
        toast.success('No image picked!');
      }
    } catch (error) {
      logError(error);
      console.log(JSON.stringify(error, null, 2));
      toast.error('Error uploading image, please try again!');
    } finally {
      setUpdatingImage(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    queryClient.clear();
    await chatClient.disconnectUser();
    setChannel(null as any);
    dispatch(logout());
    setLoggingOut(false);
  };

  const { patient } = auth;

  let subscriptionText = 'No subscription set!';
  let subscriptionSubtext = 'N/A';

  if (patient?.on_free_trial) {
    subscriptionText = 'Free trial';
    // TODO: add days left in free trial
    subscriptionSubtext = `${patient.doctors.length} doctors added`;
  } else if (patient?.current_plan === 'BASIC') {
    subscriptionText = 'Basic';
    subscriptionSubtext = `${patient.doctors.length} doctors added, BASIC Plan`;
  } else if (patient?.current_plan === 'UNLIMITED') {
    subscriptionText = 'Unlimited';
    subscriptionSubtext = `${patient.doctors.length} doctors added, UNLIMITED Plan`;
  }

  const handleSubscriptionPress = () => {
    if (!patient?.on_free_trial) {
      navigation.navigate(Screens.SubscriptionScreen);
    } else {
      navigation.navigate(Screens.UpgradePlanScreen);
    }
  };

  return (
    <Block flex1 pB={height}>
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
          <Block />
        </Block>
      </PrimaryNavigationBar>

      <Block style={styles.imageContainer}>
        {updatingImage ? (
          <Block
            bgColor="white"
            height={56}
            width={56}
            rounded="6xl"
            justify="center"
            bW={1}
            bC="lightest2"
            align="center">
            <ActivityIndicator color={theme.colors.mainBlue} />
          </Block>
        ) : (
          <Block onPress={pickImage}>
            <Image
              source={{ uri: patient?.patient_image_resized[3].image_url }}
              style={styles.image}
            />
            <Block absolute style={styles.editIcon}>
              <PencilIcon width={16} height={16} />
            </Block>
          </Block>
        )}
      </Block>

      <Block>
        <Typography center variation="title1" mT="md">
          {patient?.first_name} {patient?.last_name}
        </Typography>

        <Typography center color="dark" variation="description1">
          Patient profile
        </Typography>
      </Block>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Block pH="4xl">
          <Typography variation="title2" color="darkest" mT="4xl">
            Personal information
          </Typography>

          <BasicInfoRow
            borderBottom
            title="Address"
            {...(patient?.city
              ? {
                  description: patient.address || '',
                  description2: `${patient.apartment ? patient.apartment + ' ' : ''}${
                    patient.city
                  }`,
                  description3: `${patient.state} ${patient.zip}`,
                }
              : { description: 'No address set!' })}
            onPress={() => navigation.navigate(Screens.UpdateAddressScreen)}
          />

          <BasicInfoRow
            borderBottom
            title="Contact information"
            description={patient?.phone_number || ''}
            description2={patient?.email}
            onPress={() => navigation.navigate(Screens.UpdateContactScreen)}
          />

          <BasicInfoRow
            title="Date of Birth"
            description={format(
              new Date(parse(patient?.date_of_birth!, 'dd-MM-yyyy', new Date()) || null),
              'LLL dd yyyy'
            )}
            onPress={() => navigation.navigate(Screens.UpdateDOBScreen)}
          />

          <Typography mT="xxxl" variation="title2" color="darkest">
            Your plan
          </Typography>

          <BasicInfoRow
            title={subscriptionText}
            description={subscriptionSubtext}
            onPress={handleSubscriptionPress}
          />

          <Block mB="5xl" mT="6xl">
            <Button
              title="Logout"
              variation="secondary"
              loading={loggingOut}
              disabled={loggingOut}
              onPress={handleLogout}
              style={styles.logoutButton}
              textStyle={styles.logoutButtonText}
            />
          </Block>
        </Block>
      </ScrollView>
    </Block>
  );
};

export default ProfileScreen;
