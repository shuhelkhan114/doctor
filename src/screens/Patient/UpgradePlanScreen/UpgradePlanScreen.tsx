import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import TickIcon from '@components/Icons/TickIcon';
import Image from '@components/Image/Image';
import Link from '@components/Link/Link';
import DefaultNavigationBar from '@components/NavigationBar/DefaultNavigationBar';
import ScrollView from '@components/ScrollView/ScrollView';
import Typography from '@components/Typography/Typography';
import { truDocConfig } from '@core/config/app';
import { Screens } from '@core/config/screens';
import { plans } from '@core/config/subscription';
import useRevenueCat from '@hooks/useRevenueCat';
import useAppTheme from '@hooks/useTheme';
import { ProfileStackScreens } from '@navigation/Patient/ProfileStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppSelector } from '@store/store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type UpgradePlanScreenProps = NativeStackScreenProps<
  ProfileStackScreens,
  Screens.UpgradePlanScreen
>;

export type UpgradePlanScreenParams = undefined;

const UpgradePlanScreen: React.FC<UpgradePlanScreenProps> = (props) => {
  const { navigation } = props;

  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  const { patient } = useAppSelector((state) => state.auth);
  const { customerInfo } = useRevenueCat();

  const currentPlan = plans.find((plan) => plan.name.toUpperCase() === patient?.current_plan);

  return (
    <Block flex1>
      <DefaultNavigationBar title="Your Plan" />

      <ScrollView>
        <Block mT="xl" pH="xxxl">
          <Block pT="xl" pB="xxxl" bW={1} bC="lighter" rounded="xl">
            <Block pH="xxxl" flexDirection="row" align="center">
              <Block
                pH="sm"
                pV="sm"
                rounded="xl"
                align="center"
                justify="center"
                style={{ backgroundColor: `${theme.colors[currentPlan?.color!]}33` }}>
                {currentPlan?.icon}
              </Block>
              <Typography mL="md" variation="title1">
                {currentPlan?.name} plan
              </Typography>
            </Block>

            <Block
              pV="lg"
              bBW={1}
              mT="xl"
              pH="xxxl"
              bC="lightest"
              align="center"
              flexDirection="row"
              justify="space-between">
              <Typography variation="description1" color="darkest">
                View Meds Prescription
              </Typography>
              <TickIcon fill={theme.colors.positiveAction} />
            </Block>

            <Block
              pV="lg"
              bBW={1}
              pH="xxxl"
              bC="lightest"
              align="center"
              flexDirection="row"
              justify="space-between">
              <Typography variation="description1" color="darkest">
                Unlimited Messages
              </Typography>
              <TickIcon fill={theme.colors.positiveAction} />
            </Block>

            <Block pV="lg" pH="xxxl" align="center" flexDirection="row" justify="space-between">
              <Typography variation="description1" color="darkest">
                Unlimited doctors
              </Typography>
              <TickIcon
                fill={
                  currentPlan?.numberOfDoctors === 1
                    ? theme.colors.lighter
                    : theme.colors.positiveAction
                }
              />
            </Block>

            <Block mT="xxxl" pH="xxxl">
              <Typography variation="description1Bolder" color="positiveAction">
                ${currentPlan?.cost} a month
              </Typography>
              <Typography variation="description1" color="dark">
                {/* TODO: fix the date. */}
                next payment on the 28th of the month
              </Typography>
              <Button
                mT="xxxl"
                style={{
                  borderRadius: 8,
                  backgroundColor:
                    patient?.current_plan === 'BASIC'
                      ? theme.colors.mainBlue
                      : theme.colors.negativeAction,
                }}
                onPress={() =>
                  navigation.navigate(Screens.SubscriptionScreen, {
                    selectedPlanName: patient?.current_plan === 'BASIC' ? 'UNLIMITED' : 'BASIC',
                  })
                }
                title={
                  patient?.current_plan === 'BASIC' ? 'Upgrade to Unlimited' : 'Downgrade to Basic'
                }
              />
            </Block>
          </Block>
          <Block pH="xxxl" pB="xxl" pT="xxxl">
            <Block flexDirection="row" align="center" justify="center">
              <Typography variation="description2" center color="darker">
                By subscribing you agree to our
              </Typography>
              <Link
                variation="description2"
                color="mainBlue"
                onPress={() =>
                  navigation.navigate(Screens.WebViewScreen, {
                    uri: `${truDocConfig.primaryDomain}/privacy-policy`,
                  })
                }>
                {' '}
                privacy policy
              </Link>
            </Block>
            <Block flexDirection="row" justify="center">
              <Link
                variation="description2"
                color="mainBlue"
                onPress={() =>
                  navigation.navigate(Screens.WebViewScreen, {
                    uri: `${truDocConfig.primaryDomain}/terms-of-service`,
                  })
                }>
                {' '}
                terms of service
              </Link>
              <Typography variation="description2" color="darker">
                {' '}
                and
              </Typography>
              <Link
                variation="description2"
                color="mainBlue"
                onPress={() =>
                  navigation.navigate(Screens.WebViewScreen, {
                    uri: `https://www.apple.com/legal/internet-services/itunes/dev/stdeula/`,
                  })
                }>
                {' '}
                terms of use
              </Link>
            </Block>
          </Block>
        </Block>

        <Block pH="xxxl">
          <Typography variation="title2" mV="xl">
            Doctors
          </Typography>

          {patient?.doctors.map((doctor) => {
            return (
              <Block
                pV="xl"
                bBW={1}
                bC="lightest"
                align="center"
                key={doctor.id}
                flexDirection="row">
                <Image mR="xl" uri={doctor.doctor_image} size={56} circular />
                <Block>
                  <Typography variation="title3">
                    {doctor.first_name} {doctor.last_name}
                  </Typography>
                  <Typography variation="title3">{doctor.speciality}</Typography>
                </Block>
              </Block>
            );
          })}
        </Block>
      </ScrollView>
    </Block>
  );
};

export default UpgradePlanScreen;
