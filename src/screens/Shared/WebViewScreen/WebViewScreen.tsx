import Block from '@components/Block/Block';
import RemoteView from '@components/RemoteView/RemoteView';
import { Screens } from '@core/config/screens';
import { StartStackScreens } from '@navigation/Doctor/StartStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';

type WebViewScreenProps = NativeStackScreenProps<StartStackScreens, Screens.WebViewScreen>;

export type WebViewScreenParams = {
  uri: string;
};

const WebViewScreen: React.FC<WebViewScreenProps> = (props) => {
  const { route } = props;
  const { uri } = route.params;

  return (
    <Block flex1>
      <StatusBar barStyle="dark-content" />
      <RemoteView uri={uri} />
    </Block>
  );
};

export default WebViewScreen;
