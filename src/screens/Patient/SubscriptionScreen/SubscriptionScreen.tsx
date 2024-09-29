import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import ArrowLeftIcon from '@components/Icons/ArrowLeftIcon';
import ChevronDownIcon from '@components/Icons/ChevronDownIcon';
import LogoHorizontalWhite from '@components/Icons/LogoHorizontalWhite';
import TickIcon from '@components/Icons/TickIcon';
import Image from '@components/Image/Image';
import Input from '@components/Input/Input';
import Link from '@components/Link/Link';
import Spinner from '@components/Loaders/Spinner';
import PrimaryNavigationBar from '@components/NavigationBar/PrimaryNavigationBar/PrimaryNavigationBar';
import RadioButton from '@components/RadioButton/RadioButton';
import ScrollView from '@components/ScrollView/ScrollView';
import Typography from '@components/Typography/Typography';
import { truDocConfig } from '@core/config/app';
import { Screens } from '@core/config/screens';
import { Plan, plans } from '@core/config/subscription';
import toast from '@core/lib/toast';
import API from '@core/services';
import { gradientColors } from '@core/styles/theme';
import { logError } from '@core/utils/logger';
import useRevenueCat from '@hooks/useRevenueCat';
import useAppTheme from '@hooks/useTheme';
import { DashboardStackScreens } from '@navigation/Patient/DashboardStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchPatient } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { SubscriptionPlan } from '@typings/common';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import Purchases from 'react-native-purchases';
import { useMutation } from 'react-query';

type SubscriptionScreenProps = NativeStackScreenProps<
  DashboardStackScreens,
  Screens.SubscriptionScreen
>;

export type SubscriptionScreenParams =
  | {
      selectedPlanName?: string;
    }
  | undefined;

const SubscriptionScreen: React.FC<SubscriptionScreenProps> = (props) => {
  const { navigation, route } = props;
  const theme = useAppTheme();
  const [purchasing, setPurchasing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[0]);
  const [coupon, setCoupon] = useState('');
  const [couponInputVisible, setCouponInputVisible] = useState(false);

  const dispatch = useAppDispatch();

  const { mutate: updateProfile } = useMutation(API.patient.auth.updateProfile, {
    onSuccess() {
      dispatch(fetchPatient());
      navigation.goBack();
    },
  });

  const { offerings } = useRevenueCat();

  const patient = useAppSelector((state) => state.auth.patient);
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
        },
        scrollView: {
          flex: 1,
        },
      }),
    []
  );

  useEffect(() => {
    if (route.params?.selectedPlanName) {
      setSelectedPlan(
        plans.find((plan) => plan.name.toUpperCase() === route.params?.selectedPlanName)!
      );
    }
  }, []);

  const handlePurchase = async () => {
    try {
      setPurchasing(true);
      await Purchases.purchasePackage(offerings?.[selectedPlan.identifier]!.monthly!);

      updateProfile({
        on_free_trial: true,
        current_plan: selectedPlan.identifier.toUpperCase() as SubscriptionPlan,
      });
    } catch (error: any) {
      logError(error);
      toast.error('Unable to purchase subscription, please try again later');
    } finally {
      setPurchasing(false);
    }
  };

  const toggleCouponVisible = () => {
    setCouponInputVisible((prev) => !prev);
  };

  const handleApplyCoupon = async () => {
    if (coupon) {
      toast.success('Coming soon!');
    }
  };

  let content: React.ReactNode = null;

  if (!offerings) {
    content = <Spinner />;
  } else {
    content = (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Block pH="xxxl" mB="auto">
          <Typography center mT="xl" variation="title1">
            14 days free trial
          </Typography>

          <Typography center variation="title3">
            Cancel at any time
          </Typography>

          <Block>
            <Block flexDirection="row" justify="space-between" mT="xxxl">
              {plans.map((plan, index) => {
                const selected = plan.id === selectedPlan.id;
                return (
                  <Block
                    flex1
                    pH="xl"
                    pV="xl"
                    bW={1}
                    pB="4xl"
                    shadow="sm"
                    rounded="xl"
                    key={plan.id}
                    bgColor="white"
                    onPress={() => setSelectedPlan(plan)}
                    bC={selected ? 'mainBlue' : 'transparent'}
                    mR={index === plans.length - 1 ? undefined : 'xl'}>
                    <Block flexDirection="row" justify="space-between">
                      <Block
                        pH="md"
                        pV="md"
                        rounded="xl"
                        align="center"
                        justify="center"
                        style={{ backgroundColor: `${theme.colors[plan.color]}33` }}>
                        {plan.icon}
                      </Block>
                      <RadioButton selected={selected} />
                    </Block>
                    <Typography variation="title2" color="darker">
                      {plan.name}
                    </Typography>

                    <Block flexDirection="row" align="center" mT="md">
                      <Typography mR="md" variation="title1Bolder" color="darker">
                        ${plan.cost}
                      </Typography>
                      <Typography variation="description2">a month</Typography>
                    </Block>
                    <Typography mT="xl" variation="description2">
                      {plan.numberOfDoctors === Infinity
                        ? 'Add as many doctors as you need'
                        : `Add ${plan.numberOfDoctors} physician`}
                    </Typography>
                    {plan.recommended && (
                      <Block
                        pH="md"
                        pV="sm"
                        absolute
                        right={0}
                        bottom={0}
                        bgColor="mainBlue"
                        style={{
                          borderTopLeftRadius: theme.rounded.xl,
                          borderBottomRightRadius: theme.rounded.lg,
                        }}>
                        <Typography variation="description2" color="white">
                          Recommended
                        </Typography>
                      </Block>
                    )}
                  </Block>
                );
              })}
            </Block>

            <Block
              mT="xxl"
              pH="xl"
              pV="xl"
              shadow="sm"
              rounded="xxl"
              bgColor={couponInputVisible ? 'white' : undefined}>
              <Block justify="center" flexDirection="row" onPress={toggleCouponVisible}>
                <Typography variation="description1Bolder">Do you have a coupon?</Typography>
                <ChevronDownIcon />
              </Block>
              {couponInputVisible && (
                <Block mT="xxxl" flexDirection="row">
                  <Input value={coupon} onChangeText={setCoupon} flex1 placeholder="Coupon Code" />
                  <Block
                    mL="xxl"
                    width={54}
                    height={56}
                    rounded="4xl"
                    align="center"
                    justify="center"
                    bgColor="mainBlue"
                    opacity={coupon ? 1 : 0.5}
                    onPress={handleApplyCoupon}>
                    <TickIcon />
                  </Block>
                </Block>
              )}
            </Block>
          </Block>
        </Block>

        <Block>
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
                    uri: `${truDocConfig.domain}/privacy-policy`,
                  })
                }>
                {' '}
                privacy policy,
              </Link>
            </Block>
            <Block flexDirection="row" justify="center">
              <Link
                variation="description2"
                color="mainBlue"
                onPress={() =>
                  navigation.navigate(Screens.WebViewScreen, {
                    uri: `${truDocConfig.domain}/terms-of-service`,
                  })
                }>
                {' '}
                terms of service
              </Link>
              <Typography variation="description2" color="darker">
                {' '}
                &
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

          <Block bgColor="white" pV="xxl" pH="xxxl">
            <Button
              title="Start 14 days Free-Trial"
              loading={purchasing}
              onPress={handlePurchase}
            />
            <Typography mT="xl" variation="description2" center>
              Then pay ${selectedPlan.cost} a month
            </Typography>
          </Block>
        </Block>
      </ScrollView>
    );
  }

  return (
    <Block flex1>
      <LinearGradient colors={gradientColors} style={styles.container}>
        <PrimaryNavigationBar>
          <Block pH="xxxl" flexDirection="row" pB="5xl" pT="lg" justify="space-between">
            <Block onPress={() => navigation.goBack()}>
              <ArrowLeftIcon fill="#fff" />
            </Block>
            <LogoHorizontalWhite />
            <Block />
          </Block>
        </PrimaryNavigationBar>

        <Block zIndex={9} mT={-56 / 2} align="center">
          <Image uri={patient?.patient_image_resized[3].image_url} size={56} circular />
        </Block>

        {content}
      </LinearGradient>
    </Block>
  );
};

export default SubscriptionScreen;
