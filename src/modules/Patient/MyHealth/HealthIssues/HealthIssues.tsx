import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';

import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import ThreeDotsVertical from '@components/Icons/ThreeDotsVertical';
import Image from '@components/Image/Image';
import Modal from '@components/Modal/Modal';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import useAppTheme from '@hooks/useTheme';
import { useAppSelector } from '@store/store';
import { HealthIssue } from '@typings/model/healthIssue';
import { MyHealthStackScreens } from 'src/navigation/Patient/MyHealthStack';
import Notes from './Notes/Notes';

interface HealthIssuesProps {}

const HealthIssues: React.FC<HealthIssuesProps> = () => {
  const [selectedHealthIssue, setSelectedHealthIssue] = useState<HealthIssue | null>(null);

  const auth = useAppSelector((state) => state.auth);
  const theme = useAppTheme();
  const navigation =
    useNavigation<StackNavigationProp<MyHealthStackScreens, Screens.MyHealthScreen>>();

  const health_issues = auth.patient?.health_issues || [];

  let content: React.ReactNode = null;

  if (health_issues.length < 1) {
    content = (
      <Block align="center">
        <Image resizeMode="contain" size={200} source={require('@assets/no-healthissues.png')} />
        <Typography variation="title3">No health issues informed</Typography>
      </Block>
    );
  } else {
    content = health_issues.map((healthIssue, index) => {
      const handlePress = () => {
        setSelectedHealthIssue(healthIssue);
      };

      return (
        <Block
          pV="xl"
          bC="lightest"
          flexDirection="row"
          key={healthIssue.id}
          onPress={handlePress}
          bBW={health_issues.length - 1 === index ? 0 : 1}>
          <Block mR="auto">
            <Typography variation="title3">{healthIssue.name}</Typography>
            <Typography variation="description2" color="dark">
              Severity: {healthIssue.severity}
            </Typography>
          </Block>
          <ThreeDotsVertical />
        </Block>
      );
    });
  }

  return (
    <Block>
      <Typography color="darkest" variation="title3Bolder" mT="4xl" mB="md">
        Health issues
      </Typography>

      <Modal visible={!!selectedHealthIssue} onClose={() => setSelectedHealthIssue(null)}>
        {selectedHealthIssue && <Notes healthIssue={selectedHealthIssue} />}
      </Modal>

      {content}

      <Button
        variation="secondary"
        title="Add health issue"
        onPress={() =>
          navigation.navigate(Screens.SearchHealthIssuesScreen, {
            from: 'PATIENT',
            patient: {} as any,
          })
        }
        style={{ marginTop: theme.spacing.xl }}
      />
    </Block>
  );
};

export default HealthIssues;
