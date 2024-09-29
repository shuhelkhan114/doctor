import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import LogoHorizontalWhite from '@components/Icons/LogoHorizontalWhite';
import Link from '@components/Link/Link';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import { getSize } from '@core/utils/responsive';
import useAppTheme from '@hooks/useTheme';
import { AuthStackScreens } from '@navigation/AuthStack';

type LandingScreenProps = NativeStackScreenProps<AuthStackScreens, Screens.LandingScreen>;

const LandingScreen: React.FC<LandingScreenProps> = (props) => {
  const { navigation } = props;
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: insets.top,
      backgroundColor: theme.colors.mainBlue,
    },
    header: {
      height: '80%',
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: getSize(45),
      paddingVertical: getSize(70),
      position: 'absolute',
      zIndex: 5,
      top: 0,
      left: 0,
      height: '100%',
    },
    footer: {
      backgroundColor: '#F6FBFF',
      height: '20%',
      width: '100%',
      position: 'relative',
      zIndex: 9999,
    },
    buttonsContainer: {
      width: '100%',
      position: 'absolute',
      paddingHorizontal: getSize(42),
      top: -33,
      left: 0,
      zIndex: 9999,
    },
    logo: {
      marginBottom: 'auto',
      marginTop: '60%',
    },
    subtitle1: {
      color: 'white',
      fontWeight: '700',
      fontSize: getSize(15),
      letterSpacing: 8,
      textTransform: 'uppercase',
    },
    subtitle2: {
      color: 'white',
      fontSize: getSize(32),
      fontWeight: '700',
    },
    imagesContainer: {
      position: 'absolute',
      bottom: 0,
      height: '95%',
      left: 0,
      width: '100%',
    },
    gradientBg: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      zIndex: 3,
    },
    assistantBg: {
      height: '90%',
      width: '100%',
      position: 'absolute',
      zIndex: 1,
      bottom: 0,
    },
    doctorImage: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      flex: 1,
      zIndex: 2,
      width: getSize(255),
      height: getSize(600),
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={styles.contentContainer}>
          <Block style={styles.logo}>
            <LogoHorizontalWhite />
          </Block>

          <Block>
            <Text testID="slogan-1" style={styles.subtitle1}>
              Simplifying
            </Text>
            <Text testID="slogan-2" style={styles.subtitle2}>
              your healthcare
            </Text>
          </Block>
        </View>

        <View style={styles.imagesContainer}>
          <Image source={require('@assets/gradient-bg.png')} style={styles.gradientBg} />
          <Image source={require('@assets/assistant-bg.png')} style={styles.assistantBg} />
          <View style={styles.doctorImage}>
            <Image
              resizeMode="contain"
              style={{ flex: 1 }}
              source={require('@assets/doctor.png')}
            />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.buttonsContainer}>
          <Button
            title="Sign in with Doximity"
            onPress={() => navigation.navigate(Screens.DoximityLoginScreen)}
          />

          <Button
            mT="md"
            title="Patient"
            bgColor="secondaryBlue"
            onPress={() => navigation.navigate(Screens.SignupScreen)}
          />

          <Link center mT="xl" onPress={() => navigation.navigate(Screens.LoginScreen)}>
            Already have an account? <Typography variation="description1Bolder">Login</Typography>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default LandingScreen;
