import toast from '@core/lib/toast';
import { Linking } from 'react-native';
import { logError } from './logger';

export const openLink = async (url: string) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      toast.error('URL not supported, Please try again later.');
    } else {
      return Linking.openURL(url);
    }
  } catch (error) {
    logError(error);
    toast.error('Unable to open URL, Please try again later.');
  }
};
