import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import LogoHorizontalWhite from '@components/Icons/LogoHorizontalWhite';
import Image from '@components/Image/Image';
import PrimaryNavigationBar from '@components/NavigationBar/PrimaryNavigationBar/PrimaryNavigationBar';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import { AuthStackScreens } from '@navigation/AuthStack';

type FHIRLoginErrorScreenProps = NativeStackScreenProps<
  AuthStackScreens,
  Screens.FHIRLoginErrorScreen
>;

export type FHIRLoginErrorScreenParams = {
  message?: string;
};

const FHIRLoginErrorScreen: React.FC<FHIRLoginErrorScreenProps> = (props) => {
  const { navigation, route } = props;
  const { message = 'An unknown error has occurred, please try again.' } = route.params || {};

  return (
    <Block flex1>
      <PrimaryNavigationBar>
        <Block justify="center" align="center" pV="xxxl">
          <LogoHorizontalWhite />
        </Block>
      </PrimaryNavigationBar>
      <Block pV="5xl" pH="xxxl" flex1>
        <Block align="center" mB="auto">
          <Image width={256} height={85} source={require('@assets/mychart.png')} />
          <Typography mT="5xl" variation="title3Bolder">
            Something went wrong
          </Typography>
          <Typography color="negativeAction" mT="xxxl">
            {`__#${message}`.split('__#').join('\n- ')}
          </Typography>
        </Block>

        <Button title="Try again" onPress={navigation.goBack} />
      </Block>
    </Block>
  );
};

export default FHIRLoginErrorScreen;
