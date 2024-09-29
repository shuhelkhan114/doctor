import Toast, { ToastPosition } from 'react-native-toast-message';

interface ToastParams {
  type: 'success' | 'error';
  text1: string;
  position?: ToastPosition;
  duration?: number;
  props: {
    actionText?: string;
    actionOnPress?: () => void;
  };
}

const showToast = (params: ToastParams) => {
  Toast.show({
    type: params.type,
    text1: params.text1,
    position: params.position,
    visibilityTime: params.duration || 4000,
    ...(params.props.actionText && {
      props: {
        actionText: params.props.actionText,
        actionOnPress: params.props.actionOnPress,
      },
    }),
  });
};

const toast = {
  success: (
    text: string,
    actionText?: string,
    actionOnPress?: () => void,
    position?: ToastPosition,
    duration?: number
  ) => {
    showToast({
      duration,
      text1: text,
      type: 'success',
      position: position || 'top',
      props: { actionText, actionOnPress },
    });
  },
  error: (
    text: string,
    actionText?: string,
    actionOnPress?: () => void,
    position?: ToastPosition,
    duration?: number
  ) => {
    showToast({
      duration,
      text1: text,
      type: 'error',
      position,
      props: {
        actionText,
        actionOnPress,
      },
    });
  },
};

export default toast;
