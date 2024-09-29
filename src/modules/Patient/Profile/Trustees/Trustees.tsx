import Block from '@components/Block/Block';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import TrusteeRow from '@modules/Patient/PatientDashboard/TrusteeRow/TrusteeRow';
import { ProfileStackScreens } from '@navigation/Patient/ProfileStack';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';

interface TrusteesProps {}

const trustees: any[] = [];

const Trustees: React.FC<TrusteesProps> = (props) => {
  const navigation =
    useNavigation<StackNavigationProp<ProfileStackScreens, Screens.ProfileScreen>>();

  let content: React.ReactNode = null;

  if (trustees.length < 1) {
    content = (
      <Block>
        <Typography>No people with external access</Typography>
      </Block>
    );
  } else {
    content = trustees.map((trustee, index) => {
      return (
        <TrusteeRow
          key={trustee.id}
          bC="lightest"
          bBW={index !== 1 ? 1 : 0}
          name={trustee.name}
          imageUrl={trustee.imageUrl}
          permission={trustee.permission}
          onPress={() => navigation.navigate(Screens.EditAccessScreen)}
        />
      );
    });
  }

  return (
    <Block>
      <Typography variation="title3Bolder" mT="xxxl" color="darkest">
        People with access
      </Typography>

      {content}
    </Block>
  );
};

export default Trustees;
