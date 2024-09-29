import React, { useMemo } from 'react';

import Block from '@components/Block/Block';
import Icon from '@components/Icon/Icon';
import PrimaryNavigationBar from '@components/NavigationBar/PrimaryNavigationBar/PrimaryNavigationBar';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import { AuthStackScreens } from '@navigation/AuthStack';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Video } from 'expo-av';
import { StyleSheet } from 'react-native';

interface FHIROnboardingHeaderProps {
  title: string;
}

const FHIROnboardingHeader: React.FC<FHIROnboardingHeaderProps> = (props) => {
  const { title } = props;
  const navigation =
    useNavigation<StackNavigationProp<AuthStackScreens, Screens.MedicationSelectionScreen>>();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        video: {
          width: 120,
          height: 120,
          borderRadius: 120,
        },
      }),
    []
  );

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <PrimaryNavigationBar>
      <Block pH="xxl" pB="md" flexDirection="column" justify="space-between">
        <Block flexDirection="row" justify="space-between">
          <Block onPress={handleGoBack} mT="md">
            <Icon name="arrow-left" size={28} />
          </Block>
          <Video
            isLooping
            shouldPlay
            style={styles.video}
            useNativeControls={false}
            source={require('@assets/gaea-video.mp4')}
          />
          <Block />
        </Block>

        <Typography center variation="title3Bolder" color="white" mT="md">
          {title}
        </Typography>
      </Block>
    </PrimaryNavigationBar>
  );
};

export default FHIROnboardingHeader;
