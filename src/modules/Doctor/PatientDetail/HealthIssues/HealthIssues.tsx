import Block, { BlockProps } from '@components/Block/Block';
import Button from '@components/Button/Button';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import HealthIssueRow from '@modules/Doctor/Patients/HealthIssueRow';
import { PatientsStackScreens } from '@navigation/Doctor/PatientsStack';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PatientRowData } from '@typings/common';
import { HealthIssue } from '@typings/model/healthIssue';
import React from 'react';

interface HealthIssuesProps extends BlockProps {
  healthIssues: HealthIssue[];
  onHealthIssuePress?: (healthIssue: HealthIssue) => void;
  hasSentRequest: boolean;
  patient: PatientRowData;
}

const HealthIssues: React.FC<HealthIssuesProps> = (props) => {
  const { patient, healthIssues, hasSentRequest, onHealthIssuePress, ...restProps } = props;

  const navigation =
    useNavigation<StackNavigationProp<PatientsStackScreens, Screens.PatientDetailScreen>>();

  const handleAddHealthIssus = () => {
    navigation.navigate(Screens.AddHealthIssueScreen, { patient, healthIssues });
  };

  let content: React.ReactNode = null;

  if (healthIssues.length < 1) {
    content = (
      <Typography color="dark" variation="description1">
        Health Issues that you and other doctors inform that this patient has will show here.
      </Typography>
    );
  } else {
    content = healthIssues.map((healthIssue, index) => {
      const handlePress = () => {
        onHealthIssuePress?.(healthIssue);
      };

      return (
        <HealthIssueRow key={healthIssue.id} healthIssue={healthIssue} onPress={handlePress} />
      );
    });
  }

  return (
    <Block {...restProps}>
      <Typography color="black" mB="md" variation="title2">
        Health Issues
      </Typography>
      {content}
      {!hasSentRequest && (
        <Button
          mT="xl"
          variation="secondary"
          title="Add health issue"
          onPress={handleAddHealthIssus}
        />
      )}
    </Block>
  );
};

export default HealthIssues;
