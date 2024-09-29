import Block from '@components/Block/Block';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import { PatientsStackScreens } from '@navigation/Doctor/PatientsStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ReferPatientScreenProps = NativeStackScreenProps<
  PatientsStackScreens,
  Screens.ReferPatientScreen
>;

export type ReferPatientScreenParams = object;

const ReferPatientScreen: React.FC<ReferPatientScreenProps> = (props) => {
  const { navigation } = props;
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingTop: insets.top,
        },
      }),
    []
  );

  return (
    <Block style={styles.container}>
      <Typography>Hello</Typography>
    </Block>
  );
};

export default ReferPatientScreen;
