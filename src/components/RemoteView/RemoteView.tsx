import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView, WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';

import { Screens } from '@core/config/screens';
import { getSize } from '@core/utils/responsive';
import useAppTheme from '@hooks/useTheme';
import { AuthStackScreens } from '@navigation/AuthStack';
import Block from '../Block/Block';
import Typography from '../Typography/Typography';

interface RemoteViewProps {
  uri: string;
  style?: ViewStyle;
  onMessage?: (data: string) => void;
  injectedJavascript?: string;
  incognito?: boolean;
  onNavigationStateChange?: (event: WebViewNavigation) => void;
}

const RemoteView: React.FC<RemoteViewProps> = (props) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<StackNavigationProp<AuthStackScreens, Screens.LandingScreen>>();
  const [loadingWebView, setLoadingWebView] = useState(true);
  const { uri, style, onMessage, injectedJavascript, incognito, onNavigationStateChange } = props;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          ...style,
        },
        header: {
          backgroundColor: '#F8F8F8',
          paddingTop: insets.top,
          paddingBottom: theme.spacing.md,
        },
      }),
    [style]
  );

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleMessageReceive = (event: WebViewMessageEvent) => {
    onMessage?.(event.nativeEvent.data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography center variation="description1">
          Doc Hello
        </Typography>
        <Block absolute right={getSize(10)} bottom={theme.spacing.md} onPress={handleGoBack}>
          <Typography color="mainBlue">Close</Typography>
        </Block>
      </View>

      <WebView
        cacheEnabled={false}
        source={{ uri }}
        style={{ flex: 1 }}
        incognito={incognito}
        onMessage={handleMessageReceive}
        onLoad={() => setLoadingWebView(false)}
        injectedJavaScript={injectedJavascript}
        onNavigationStateChange={onNavigationStateChange}
      />

      {loadingWebView && (
        <Block absolute top="50%" left="50%" zIndex={99}>
          <ActivityIndicator color={theme.colors.mainBlue} />
        </Block>
      )}
    </View>
  );
};

export default RemoteView;
