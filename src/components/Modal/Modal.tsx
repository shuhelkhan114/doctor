import { PropsWithChildren, useMemo } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import NativeModal from 'react-native-modal';

import { getSize } from '@core/utils/responsive';
import useAppTheme from '@hooks/useTheme';
import Block from '../Block/Block';

interface ModalProps extends PropsWithChildren {
  visible: boolean;
  disabledSwipe?: boolean;
  minHeight?: string;
  onClose: (visible: false) => void;
}

const Modal: React.FC<ModalProps> = (props) => {
  const { children, visible, disabledSwipe = false, minHeight, onClose } = props;
  const theme = useAppTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        modal: {
          flex: 1,
          margin: 0,
          justifyContent: 'flex-end',
        },
        container: {
          backgroundColor: 'white',
          borderTopRightRadius: 34,
          borderTopLeftRadius: 34,
          padding: theme.spacing['4xl'],
          paddingTop: theme.spacing.xl,
          maxHeight: '90%',
          ...(minHeight && { height: minHeight }),
        },
      }),
    [minHeight]
  );

  const handleClose = () => {
    onClose?.(false);
  };

  return (
    <NativeModal
      isVisible={visible}
      style={styles.modal}
      onSwipeComplete={handleClose}
      onBackdropPress={handleClose}
      swipeDirection={disabledSwipe ? undefined : ['down']}>
      <Block onPress={handleClose} style={{ height: '20%' }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container]}>
        <Block align="center" mB="xxl">
          <Block width={48} height={4} bgColor="lighter" rounded="6xl" />
        </Block>
        {children}
        <Block height={getSize(48)} />
      </KeyboardAvoidingView>
    </NativeModal>
  );
};

export default Modal;
