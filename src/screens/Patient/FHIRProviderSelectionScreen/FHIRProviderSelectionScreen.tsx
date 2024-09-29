import Block from '@components/Block/Block';
import KeyboardView from '@components/KeyboardView/KeyboardView';
import DefaultNavigationBar from '@components/NavigationBar/DefaultNavigationBar';
import ScrollView from '@components/ScrollView/ScrollView';
import Search from '@components/Search/Search';
import Typography from '@components/Typography/Typography';
import { providers } from '@core/config/fhir';
import { Screens } from '@core/config/screens';
import { fhirInstance } from '@core/lib/axios';
import { AuthStackScreens } from '@navigation/AuthStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StatusBar } from 'react-native';

type FHIRProviderSelectionScreenProps = NativeStackScreenProps<
  AuthStackScreens,
  Screens.FHIRProviderSelectionScreen
>;

export type FHIRProviderSelectionScreenParams = undefined;

const FHIRProviderSelectionScreen: React.FC<FHIRProviderSelectionScreenProps> = (props) => {
  const { navigation } = props;
  const [organizations, setOrganizations] = useState<typeof providers>(providers);

  const handleSearch = (text: string) => {
    const filteredOrganizations = providers.filter((provider) => {
      return provider.name.toLowerCase().includes(text.toLowerCase());
    });

    setOrganizations(filteredOrganizations);
  };

  const handleClear = () => {
    setOrganizations(providers);
  };

  return (
    <KeyboardView>
      <Block flex1>
        <StatusBar barStyle="dark-content" />

        <DefaultNavigationBar title="Select your organization" />

        <Block pH="xxxl" flex1>
          <Search
            mB="xl"
            placeholder="Search organization"
            onSearch={handleSearch}
            onClear={handleClear}
          />

          <ScrollView>
            {organizations.map((provider, index) => {
              const handleSelect = () => {
                navigation.navigate(Screens.FHIRLoginScreen, {
                  provider: provider.address,
                });
                fhirInstance.defaults.baseURL = provider.address.replace('R4/', '');
              };

              return (
                <Block
                  onPress={handleSelect}
                  key={provider.id}
                  pV="xl"
                  pH="lg"
                  bC="lightest"
                  bBW={providers.length - 1 === index ? 0 : 1}>
                  <Typography>{provider.name}</Typography>
                </Block>
              );
            })}
          </ScrollView>
        </Block>
      </Block>
    </KeyboardView>
  );
};

export default FHIRProviderSelectionScreen;
