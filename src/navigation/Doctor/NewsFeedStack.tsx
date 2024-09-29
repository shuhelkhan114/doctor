import { Screens } from '@core/config/screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NewsFeedScreen, {
  NewsFeedScreenParams,
} from '@screens/Doctor/NewsFeedScreen/NewsFeedScreen';
import PublishArticleScreen, {
  PublishArticleScreenParams,
} from '@screens/Doctor/PublishArticleScreen/PublishArticleScreen';
import WebViewScreen, { WebViewScreenParams } from '@screens/Shared/WebViewScreen/WebViewScreen';
import React from 'react';

export type NewsFeedStackScreens = {
  [Screens.NewsFeedScreen]: NewsFeedScreenParams;
  [Screens.PublishArticleScreen]: PublishArticleScreenParams;
  [Screens.WebViewScreen]: WebViewScreenParams;
};

const Stack = createNativeStackNavigator<NewsFeedStackScreens>();

const NewsFeedStack = () => {
  const initialScreen = Screens.NewsFeedScreen;

  return (
    <Stack.Navigator initialRouteName={initialScreen} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Screens.NewsFeedScreen} component={NewsFeedScreen} />
      <Stack.Screen name={Screens.PublishArticleScreen} component={PublishArticleScreen} />
      <Stack.Screen name={Screens.WebViewScreen} component={WebViewScreen} />
    </Stack.Navigator>
  );
};

export default NewsFeedStack;
