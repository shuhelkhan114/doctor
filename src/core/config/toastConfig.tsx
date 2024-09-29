import Block from '@components/Block/Block';
import Link from '@components/Link/Link';
import Typography from '@components/Typography/Typography';
import { StyleSheet } from 'react-native';
import { ToastConfig } from 'react-native-toast-message';

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    maxWidth: '90%',
  },
});

const toastConfig: ToastConfig = {
  success: (props) => {
    const { text1, props: additionalProps } = props;
    const { actionText, actionOnPress } = additionalProps || {};

    return (
      <Block
        bW={1}
        flex1
        pH="xl"
        rounded="xl"
        bC="lighter"
        align="center"
        bgColor="white"
        flexDirection="row"
        justify="space-between"
        style={styles.container}>
        <Typography numberOfLines={3} pV="xl" flex1>
          {text1}
        </Typography>
        {actionText && (
          <Link pV="xl" variation="description1Bolder" onPress={actionOnPress}>
            {actionText}
          </Link>
        )}
      </Block>
    );
  },
  error: (props) => {
    const { text1, props: additionalProps } = props;
    const { actionText, actionOnPress } = additionalProps || {};

    return (
      <Block
        bW={1}
        flex1
        pH="xl"
        rounded="xl"
        bC="lighter"
        align="center"
        bgColor="white"
        flexDirection="row"
        justify="space-between"
        width="100%"
        style={styles.container}>
        <Typography mR="xl" flex1 color="negativeAction" numberOfLines={3} pV="xl">
          {text1}
        </Typography>
        {actionText && (
          <Link pV="xl" variation="description1Bolder" onPress={actionOnPress}>
            {actionText}
          </Link>
        )}
      </Block>
    );
  },
};

export default toastConfig;
