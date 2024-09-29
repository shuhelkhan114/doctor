import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import TrusteeIcon from '@components/Icons/TrusteeIcon';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import useAppTheme from '@hooks/useTheme';
import TrusteeRow from '@modules/Patient/PatientDashboard/TrusteeRow/TrusteeRow';
import { DashboardStackScreens } from '@navigation/Patient/DashboardStack';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppSelector } from '@store/store';
import React from 'react';
import { ActivityIndicator } from 'react-native';

interface TrusteesProps {}

const trustees: any[] = [];

const Trustees: React.FC<TrusteesProps> = (props) => {
  const theme = useAppTheme();
  const navigation =
    useNavigation<StackNavigationProp<DashboardStackScreens, Screens.DashboardScreen>>();
  const auth = useAppSelector((state) => state.auth);

  if (trustees.length < 1) {
    return (
      <Block pH="xxxl">
        <Block
          mT="xl"
          pH="xxxl"
          pV="xxxl"
          flexDirection="row"
          rounded="xxl"
          bW={1}
          align="center"
          bC="lightest"
          bgColor="white"
          shadow="sm"
          onPress={() => {
            toast.success('Coming soon!');
          }}>
          <TrusteeIcon />
          <Typography mL="xl" variation="title3Bolder">
            Add people your trust
          </Typography>
        </Block>
      </Block>
    );
  }

  let content = <></>;

  if (auth.fetchingProfile) {
    content = <ActivityIndicator />;
  } else if (trustees.length < 1) {
    content = (
      <Block pH="sm">
        <Typography>No people with external access</Typography>
      </Block>
    );
  } else {
    content = (
      <>
        {trustees.map((item, index) => {
          return (
            <TrusteeRow
              key={item.id}
              bBW={index !== 1 ? 1 : 0}
              bC="lightest"
              name={item.name}
              imageUrl={item.imageUrl}
              permission={item.permission}
            />
          );
        })}
      </>
    );
  }

  const handleAddPerson = () => {
    toast.success('Coming sooo!');
  };

  return (
    <Block pH="xxxl">
      <Typography variation="title3Bolder" mT="4xl" mB="xl">
        People with Access
      </Typography>

      {content}

      <Button
        title="Add person"
        variation="secondary"
        onPress={handleAddPerson}
        style={{ marginTop: theme.spacing.md }}
      />
    </Block>
  );
};

export default Trustees;
