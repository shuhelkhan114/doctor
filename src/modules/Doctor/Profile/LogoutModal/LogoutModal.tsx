import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import Typography from '@components/Typography/Typography';
import { useChat } from '@context/ChatContext';
import { chatClient } from '@core/lib/stream-chat';
import useAppTheme from '@hooks/useTheme';
import { logout } from '@store/slices/authSlice';
import { useAppDispatch } from '@store/store';
import React, { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import Modal from 'react-native-modal/dist/modal';
import { useQueryClient } from 'react-query';

interface LogoutProps {
  visible: boolean;
  closeModal?: (visible: false) => void;
}

const LogoutModal: React.FC<LogoutProps> = (props) => {
  const { visible, closeModal } = props;
  const [loggingOut, setLoggingOut] = useState(false);

  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { setChannel } = useChat();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        button: {
          width: undefined,
          flex: 1,
          borderRadius: 8,
        },
        logoutButton: {
          backgroundColor: theme.colors.negativeAction,
        },
      }),
    []
  );

  const handleLogout = async () => {
    setLoggingOut(true);
    queryClient.clear();
    await chatClient.disconnectUser();
    await chatClient.disconnect();
    setChannel(null as any);
    dispatch(logout());
    setLoggingOut(false);
  };

  const handleClose = () => {
    closeModal?.(false);
  };

  return (
    <Block>
      <Modal isVisible={visible} onSwipeComplete={handleClose} onBackdropPress={handleClose}>
        <Block bgColor="white" rounded="xl" pH="xxxl" pV="5xl">
          <Typography variation="description1">
            Are you sure you want to log out of Doc Hello
          </Typography>

          <Block mT="6xl" flexDirection="row">
            <Button
              mR="xl"
              title="Cancel"
              onPress={handleClose}
              style={styles.button}
              variation="primary-light"
              textStyle={{ color: theme.colors.darkest }}
            />

            <Button
              title="Logout"
              loading={loggingOut}
              onPress={handleLogout}
              style={{ ...styles.button, ...styles.logoutButton }}
            />
          </Block>
        </Block>
      </Modal>
    </Block>
  );
};

export default LogoutModal;
