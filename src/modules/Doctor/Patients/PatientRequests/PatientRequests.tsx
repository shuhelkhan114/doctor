import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';

import Block from '@components/Block/Block';
import Icon from '@components/Icon/Icon';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import { PatientRequestEntity } from '@core/services/doctor/request';
import useAppTheme from '@hooks/useTheme';
import { PatientsStackScreens } from '@navigation/Doctor/PatientsStack';
import RequestCard from '../PatientRequest/PatientRequestCard';

interface PatientRequestsProps {
  requests: PatientRequestEntity[];
  requestsCount: number;
}

const PatientRequests: React.FC<PatientRequestsProps> = (props) => {
  const { requests = [], requestsCount = 0 } = props;
  const theme = useAppTheme();

  const navigation =
    useNavigation<StackNavigationProp<PatientsStackScreens, Screens.PatientsScreen>>();

  const navigateToPatientRequestsScreen = () => {
    navigation.navigate(Screens.RequestsScreen);
  };

  return (
    <Block>
      {requests.length > 0 && (
        <Block>
          <Block
            flexDirection="row"
            align="center"
            justify="space-between"
            onPress={navigateToPatientRequestsScreen}>
            <Typography variation="title3Bolder">
              {requestsCount} Requests to be your patient
            </Typography>
            <Icon size={24} name="arrow-right" color={theme.colors.secondaryBlue} />
          </Block>

          <Block bgColor="mainBlue" mT="xl" mL="sm">
            {requests.slice(0, 2).map((request, index) => (
              <Block
                key={request.id}
                bgColor="white"
                // TODO: Refactor this
                style={{
                  ...(index > 0 && {
                    position: 'absolute',
                    bottom: 3,
                    left: -3,
                    width: '100%',
                  }),
                }}>
                <RequestCard request={request} />
              </Block>
            ))}
          </Block>
        </Block>
      )}
    </Block>
  );
};

export default PatientRequests;
