import notifee, { EventType } from '@notifee/react-native';
import { registerRootComponent } from 'expo';
import TrackPlayer from 'react-native-track-player';
import App from './App';

import NewRelic from 'newrelic-react-native-agent';
import { Platform } from 'react-native';
import * as appVersion from './package.json';

let appToken;

if (Platform.OS === 'ios') {
  appToken = 'AAdff16dfb47603645448d5cb19da3be5c0a28bf73-NRMA';
} else {
  appToken = 'AA92b9f813e9f36220fc97f6714375078b29776fc3-NRMA';
}

// TODO: out source into config file
const agentConfiguration = {
  //Android Specific
  // Optional:Enable or disable collection of event data.
  analyticsEventEnabled: true,

  // Optional:Enable or disable crash reporting.
  crashReportingEnabled: true,

  // Optional:Enable or disable interaction tracing. Trace instrumentation still occurs, but no traces are harvested. This will disable default and custom interactions.
  interactionTracingEnabled: true,

  // Optional:Enable or disable reporting successful HTTP requests to the MobileRequest event type.
  networkRequestEnabled: true,

  // Optional:Enable or disable reporting network and HTTP request errors to the MobileRequestError event type.
  networkErrorRequestEnabled: true,

  // Optional:Enable or disable capture of HTTP response bodies for HTTP error traces, and MobileRequestError events.
  httpResponseBodyCaptureEnabled: true,

  // Optional:Enable or disable agent logging.
  loggingEnabled: true,

  // Optional:Specifies the log level. Omit this field for the default log level.
  // Options include: ERROR (least verbose), WARNING, INFO, VERBOSE, AUDIT (most verbose).
  logLevel: NewRelic.LogLevel.INFO,

  // iOS Specific
  // Optional:Enable/Disable automatic instrumentation of WebViews
  webViewInstrumentation: true,

  // Optional:Set a specific collector address for sending data. Omit this field for default address.
  // collectorAddress: "",

  // Optional:Set a specific crash collector address for sending crashes. Omit this field for default address.
  // crashCollectorAddress: ""
};

NewRelic.startAgent(appToken, agentConfiguration);
NewRelic.setJSAppVersion(appVersion.version);

// TODO: handle this as well..
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  if (type === EventType.ACTION_PRESS) {
    console.log('User pressed a button on the notification', pressAction.id);
  }
});

TrackPlayer.registerPlaybackService(() => require('./service'));
function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    return null;
  }

  // Render the app component on foreground launch
  return <App />;
}

registerRootComponent(HeadlessCheck);
