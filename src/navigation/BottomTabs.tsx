import Block from '@components/Block/Block';
import Typography from '@components/Typography/Typography';
import { appConfig, truDocConfig } from '@core/config/app';
import { defaultBottomTabItemStyle } from '@core/config/navigation';
import { Screens } from '@core/config/screens';
import toastConfig from '@core/config/toastConfig';
import { auth as firebaseAuth } from '@core/lib/firebase';
import toast from '@core/lib/toast';
import { logError } from '@core/utils/logger';
import { getSize } from '@core/utils/responsive';
import useAppTheme from '@hooks/useTheme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useAppSelector } from '@store/store';
import { UserRole } from '@typings/common';
import intervalToDuration from 'date-fns/intervalToDuration';
import { User, sendEmailVerification } from 'firebase/auth';
import React, { useMemo, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import DoximityStack from './Doctor/DoximityStack';
import MessagesStack from './Doctor/MessagesStack';
import NewsFeedStack from './Doctor/NewsFeedStack';
import PatientsStack from './Doctor/PatientsStack';
import StartStack from './Doctor/StartStack';
import CareTeamStack from './Patient/CareTeamStack';
import DashboardStack from './Patient/DashboardStack';
import PatientMessagesStack from './Patient/MessagesStack';
import MyHealthStack from './Patient/MyHealthStack';
import PatientProfileStack from './Patient/ProfileStack';

export type BottomTabScreenStacks = {
  // Doctor
  StartStack: undefined;
  PatientsStack: undefined;
  MessagesStack: undefined;
  DoximityStack: undefined;
  NewsFeedStack: undefined;
  // Patient
  DashboardStack: undefined;
  MyHealthStack: undefined;
  CareTeamStack: undefined;
  PatientMessagesStack: undefined;
  PatientProfileStack: undefined;
};

const Tab = createBottomTabNavigator<BottomTabScreenStacks>();

interface BottomTab {
  name: keyof BottomTabScreenStacks;
  defaultScreen: string;
  component: any;
  title: string;
  icon: any;
}

const doctorTabs: BottomTab[] = [
  {
    name: 'StartStack',
    defaultScreen: Screens.StartScreen,
    component: StartStack,
    title: 'Start',
    icon: require('@assets/icons/start.png'),
  },
  {
    name: 'PatientsStack',
    defaultScreen: Screens.PatientsScreen,
    component: PatientsStack,
    title: 'Patients',
    icon: require('@assets/icons/patients.png'),
  },
  {
    name: 'MessagesStack',
    defaultScreen: Screens.MessagesScreen,
    component: MessagesStack,
    title: 'Messages',
    icon: require('@assets/icons/messages.png'),
  },
  {
    name: 'DoximityStack',
    defaultScreen: Screens.DoximityScreen,
    component: DoximityStack,
    title: 'Doximity',
    icon: require('@assets/icons/doximity.png'),
  },
  {
    name: 'NewsFeedStack',
    defaultScreen: Screens.NewsFeedScreen,
    component: NewsFeedStack,
    title: 'Newsfeed',
    icon: require('@assets/icons/newsfeed.png'),
  },
];

const patientsTabs: BottomTab[] = [
  {
    name: 'DashboardStack',
    defaultScreen: Screens.DashboardScreen,
    component: DashboardStack,
    title: 'Dashboard',
    icon: require('@assets/icons/start.png'),
  },
  {
    name: 'MyHealthStack',
    defaultScreen: Screens.MyHealthScreen,
    component: MyHealthStack,
    title: 'My Health',
    icon: require('@assets/icons/my-health.png'),
  },
  {
    name: 'CareTeamStack',
    defaultScreen: Screens.CareTeamScreen,
    component: CareTeamStack,
    title: 'Care Team',
    icon: require('@assets/icons/care-team.png'),
  },
  {
    name: 'PatientMessagesStack',
    defaultScreen: Screens.MessagesScreen,
    component: PatientMessagesStack,
    title: 'Messages',
    icon: require('@assets/icons/messages.png'),
  },
  {
    name: 'PatientProfileStack',
    defaultScreen: Screens.ProfileScreen,
    component: PatientProfileStack,
    title: 'Profile',
    icon: require('@assets/icons/profile.png'),
  },
];

const BottomTabs = () => {
  const theme = useAppTheme();
  const [resending, setResending] = useState(false);
  const auth = useAppSelector((state) => state.auth);

  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        tabIcon: {
          height: getSize(24),
          width: getSize(24),
          tintColor: theme.colors.text,
        },
        emailVerificationBanner: {
          backgroundColor: '#FFF6D8',
          paddingTop: insets.top,
        },
      }),
    []
  );

  const handleResend = async () => {
    try {
      setResending(true);
      await sendEmailVerification(firebaseAuth.currentUser as User, {
        url: `${truDocConfig.domain}/verify-email?email=${auth.patient?.email}`,
        iOS: {
          bundleId: appConfig.ios.bundleId,
        },
        android: {
          packageName: appConfig.android.bundleId,
          installApp: true,
        },
      });
      toast.success('Verification email sent successfully!');
    } catch (error) {
      logError(error);
      toast.error('Unable to resend verification email, please try again!');
    } finally {
      setResending(false);
    }
  };

  const tabs = auth.role === 'Doctor' ? doctorTabs : patientsTabs;

  const signedUpAgo =
    intervalToDuration({
      start: auth.patient?.created_at ? new Date(auth.patient?.created_at) : new Date(),
      end: new Date(),
    }).days || 0;

  return (
    <Block flex1>
      <Block absolute width="100%" top={0} left={0} zIndex={999999999999999999999}>
        <Toast config={toastConfig} />
      </Block>
      {auth.role === UserRole.Patient && !auth.patient?.email_verified && signedUpAgo > 3 && (
        <Block
          pB="lg"
          pH="xxxl"
          align="center"
          flexDirection="row"
          justify="space-between"
          style={styles.emailVerificationBanner}>
          <Block>
            <Typography variation="title3" color="darkest">
              Please verify that your email is
            </Typography>

            <Typography variation="title3" color="darkest">
              {auth.patient?.email}
            </Typography>
          </Block>
          <Block bgColor="mainBlue" pH="lg" pV="md" rounded="xl" onPress={handleResend}>
            <Typography color="white">{resending ? 'Sending...' : 'Resend'}</Typography>
          </Block>
        </Block>
      )}
      <Tab.Navigator
        id="main-tab"
        initialRouteName={tabs[0].name}
        screenOptions={{ headerShown: false }}>
        {tabs.map((tab) => (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={tab.component}
            options={({ navigation, route }) => {
              const isFocused = navigation.isFocused();

              return {
                title: tab.title,
                tabBarHideOnKeyboard: true,
                tabBarStyle: ((route) => {
                  const routeName = getFocusedRouteNameFromRoute(route) ?? tab.defaultScreen;
                  return {
                    ...defaultBottomTabItemStyle,
                    ...(routeName !== tab.defaultScreen && {
                      display: 'none',
                    }),
                  };
                })(route),
                tabBarItemStyle: {
                  borderTopWidth: 3,
                  opacity: isFocused ? 1 : 0.6,
                  paddingTop: theme.spacing.md,
                  borderTopColor: isFocused ? theme.colors.secondaryBlue : 'transparent',
                },
                tabBarLabelStyle: {
                  fontSize: getSize(12),
                  color: theme.colors.text,
                  marginTop: theme.spacing.sm,
                },
                tabBarIcon: () => <Image style={styles.tabIcon} source={tab.icon} />,
              };
            }}
          />
        ))}
      </Tab.Navigator>
    </Block>
  );
};

export default BottomTabs;
