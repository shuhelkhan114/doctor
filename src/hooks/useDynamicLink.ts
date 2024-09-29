import { deepLinkUrls } from '@core/config/app';
import { Screens } from '@core/config/screens';
import dynamicLinks, { FirebaseDynamicLinksTypes } from '@react-native-firebase/dynamic-links';
import { useNavigation } from '@react-navigation/native';
import { setInvitedBy, verifyEmail } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { useEffect } from 'react';

export const useDynamicLink = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const navigation = useNavigation<any>();

  const handleDynamicLink = (link: FirebaseDynamicLinksTypes.DynamicLink | null) => {
    if (link) {
      const isForgotPasswordUrl = new URLSearchParams(link?.url)
        .get('continueUrl')
        ?.startsWith(deepLinkUrls.forgotPassword);
      if (link?.url?.startsWith(deepLinkUrls.emailVerification)) {
        if (!auth.emailVerified) {
          dispatch(verifyEmail());
        }
      } else if (isForgotPasswordUrl) {
        navigation.navigate(Screens.ResetPasswordScreen, {
          link: link.url,
        });
      } else if (link?.url?.startsWith(deepLinkUrls.doctorInvitation)) {
        const url = new URLSearchParams(new URL(link.url).search);
        const doctorId = url.get('doctorId') as string;
        dispatch(setInvitedBy(doctorId));
      }
    }
  };

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    dynamicLinks().getInitialLink().then(handleDynamicLink);
  }, []);
};
