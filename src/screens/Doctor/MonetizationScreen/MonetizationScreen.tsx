import Block from '@components/Block/Block';
import Icon from '@components/Icon/Icon';
import ChevronRightIcon from '@components/Icons/ChevronRightIcon';
import TickIcon from '@components/Icons/TickIcon';
import Modal from '@components/Modal/Modal';
import DefaultNavigationBar from '@components/NavigationBar/DefaultNavigationBar';
import ScrollView from '@components/ScrollView/ScrollView';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import { getSize } from '@core/utils/responsive';
import useAppTheme from '@hooks/useTheme';
import MonetizationAddress from '@modules/Doctor/Monetization/MonetizationAddress/MonetizationAddress';
import PaymentDetail from '@modules/Doctor/Monetization/PaymentDetail/PaymentDetail';
import { StartStackScreens } from '@navigation/Doctor/StartStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppSelector } from '@store/store';
import React, { useMemo, useState } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

type Modal = 'address' | 'payment';

type MonetizationScreenProps = NativeStackScreenProps<
  StartStackScreens,
  Screens.MonetizationScreen
>;

export type MonetizationScreenParams = undefined;

const MonetizationScreen: React.FC<MonetizationScreenProps> = (props) => {
  const [selectedModal, setSelectedModal] = useState<Modal | null>(null);

  const auth = useAppSelector((state) => state.auth);
  const theme = useAppTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          height: getSize(264),
        },
      }),
    []
  );

  let modalContent: React.ReactNode = null;

  if (selectedModal === 'address') {
    modalContent = <MonetizationAddress closeModal={() => setSelectedModal(null)} />;
  } else if (selectedModal === 'payment') {
    modalContent = <PaymentDetail closeModal={() => setSelectedModal(null)} />;
  }

  return (
    <Block flex1>
      <Modal
        disabledSwipe
        minHeight="90%"
        visible={!!selectedModal}
        onClose={() => setSelectedModal(null)}>
        {modalContent}
      </Modal>

      <ImageBackground
        source={require('@assets/illustrations/monetization.png')}
        style={styles.container}>
        <DefaultNavigationBar title="Doc Hello Monetization" />
      </ImageBackground>

      <ScrollView pH="xxxl">
        <Typography mT="5xl" variation="paragraph" color="darker">
          Doc Hello is nothing without you and we want to make sure you are properly rewarded for
          this.
        </Typography>
        <Block mT="4xl" flexDirection="row" align="center">
          {auth.doctor?.payment_method ? (
            <>
              <TickIcon fill={theme.colors.positiveAction} />
              <Typography mL="lg" variation="description1" color="positiveAction">
                You are participating
              </Typography>
            </>
          ) : (
            <>
              <Icon size={24} name="question" color={theme.colors.darker} />
              <Typography mL="lg" variation="description1" color="darker">
                Fill out your information to participate
              </Typography>
            </>
          )}
        </Block>
        <Typography mT="4xl" variation="title2Bolder" color="darkest">
          Your information
        </Typography>
        <Block mT="xl">
          <Block
            pV="lg"
            bBW={1}
            bC="lightest"
            align="center"
            flexDirection="row"
            onPress={() => setSelectedModal('address')}
            justify="space-between">
            <Block>
              <Typography variation="description1" color="secondaryBlue">
                Office Address 1
              </Typography>
              <Typography variation="description1" color="light">
                {auth.doctor?.payment_city
                  ? `${auth.doctor?.payment_street_address}, ${auth.doctor.payment_city}, ${auth.doctor.payment_state}, ${auth.doctor.payment_zipcode}`
                  : 'Not informed'}
              </Typography>
            </Block>
            <ChevronRightIcon />
          </Block>

          <Block
            pV="lg"
            bBW={1}
            bC="lightest"
            align="center"
            flexDirection="row"
            onPress={() => setSelectedModal('payment')}
            justify="space-between">
            <Block>
              <Typography variation="description1" color="secondaryBlue">
                Payment Details
              </Typography>
              <Typography variation="description1" color="light">
                {auth.doctor?.payment_method ? auth.doctor.payment_method : 'Not informed'}
              </Typography>
            </Block>
            <ChevronRightIcon />
          </Block>

          <Block
            pV="lg"
            bBW={1}
            bC="lightest"
            align="center"
            flexDirection="row"
            // onPress={() => setSelectedModal('address')}
            justify="space-between">
            <Block>
              <Typography variation="description1" color="secondaryBlue">
                Patient Monthly Revenue
              </Typography>
              <Typography variation="description1" color="light">
                No patient signed up yet
              </Typography>
            </Block>
            <ChevronRightIcon />
          </Block>

          <Typography mT="4xl" variation="description1" color="darker">
            Payment is done every last day of the month
          </Typography>
        </Block>
      </ScrollView>
    </Block>
  );
};

export default MonetizationScreen;
