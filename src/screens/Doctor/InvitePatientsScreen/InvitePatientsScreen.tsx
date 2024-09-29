import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import Image from '@components/Image/Image';
import DefaultNavigationBar from '@components/NavigationBar/DefaultNavigationBar';
import ScrollView from '@components/ScrollView/ScrollView';
import Search from '@components/Search/Search';
import Typography from '@components/Typography/Typography';
import { appConfig, truDocConfig } from '@core/config/app';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import { getImageUrl } from '@core/utils/common';
import { logError } from '@core/utils/logger';
import { StartStackScreens } from '@navigation/Doctor/StartStack';
import dynaminLink from '@react-native-firebase/dynamic-links';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppSelector } from '@store/store';
import * as Clipboard from 'expo-clipboard';
import * as Contacts from 'expo-contacts';
import { Contact } from 'expo-contacts';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Platform, Share } from 'react-native';

type InvitePatientsScreenProps = NativeStackScreenProps<
  StartStackScreens,
  Screens.InvitePatientsScreen
>;

export type InvitePatientsScreenParams = undefined;

const InvitePatientsScreen: React.FC<InvitePatientsScreenProps> = (props) => {
  const [initializing, setInitializing] = useState(false);
  const [link, setLink] = useState('');
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);

  const doctor = useAppSelector((state) => state.auth.doctor);

  const mount = async () => {
    try {
      setInitializing(true);
      const link = await dynaminLink().buildShortLink({
        link: `${truDocConfig.dynamicLinkBaseUrl}/invite-patient?doctorId=${doctor?.id}`,
        domainUriPrefix: truDocConfig.dynamicLinkBaseUrl,
        analytics: {
          campaign: 'banner',
        },
        ios: {
          bundleId: appConfig.ios.bundleId,
        },
        android: {
          packageName: appConfig.android.bundleId,
        },
      });
      setLink(link);
      const { status, canAskAgain } = await Contacts.requestPermissionsAsync();

      if (!canAskAgain) {
        toast.error('Unable to access contact, please enable in your device settings!');
      }

      if (status === 'granted') {
        setPermissionGranted(true);
        const { data } = await Contacts.getContactsAsync({});

        setAllContacts(data);
        setFilteredContacts(data);
      } else {
        setPermissionGranted(false);
      }
    } catch (error) {
      toast.error('Unable to fetch contacts, please try again!');
      logError(error);
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    mount();
  }, []);

  const handleSearch = (term: string) => {
    setFilteredContacts(
      allContacts.filter((contact) => {
        return contact.name?.toLowerCase().includes(term.toLowerCase());
      })
    );
  };

  const copyCodeToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(link);
      toast.success('Code copied to clipboard');
    } catch (error) {
      logError(error);
      toast.error('Unable to copy to clipboard, please try again');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: link });
    } catch (err) {
      logError(err);
      toast.error(
        'Unable to share link, Please try again or copy it manually',
        'Copy Instead',
        copyCodeToClipboard
      );
    }
  };

  const handleSendSMS = async (phoneNumbers: string[]) => {
    // const isAvailable = await isAvailableAsync();

    const separator = Platform.OS === 'ios' ? '&' : '?';
    const url = `sms:${phoneNumbers.join(
      ','
    )}${separator}body=I would like to invite you to Doc Hello: ${link}
    
- ${doctor?.first_name}`;
    await Linking.openURL(url);
  };

  let sections: {
    title: string;
    data: Contact[];
  }[] = [];

  filteredContacts.forEach((contact) => {
    const firstLetter = contact.name?.charAt(0).toUpperCase();

    if (firstLetter) {
      const existingSection = sections.find((section) => section.title === firstLetter);

      if (existingSection) {
        existingSection.data.push(contact);
      } else {
        sections.push({
          title: firstLetter,
          data: [contact],
        });
      }
    }
  });

  sections = sections.sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }

    if (a.title > b.title) {
      return 1;
    }

    return 0;
  });

  let content: React.ReactNode = null;

  if (initializing) {
    content = (
      <Block flex1 align="center" justify="center">
        <ActivityIndicator />
      </Block>
    );
  } else if (!permissionGranted) {
    content = (
      <Block flex1 align="center" justify="center">
        <Typography variation="title3" center color="negativeAction">
          Permission Denied, Please allow permission from settings
        </Typography>
      </Block>
    );
  } else if (allContacts.length < 1) {
    content = (
      <Block flex1 align="center" justify="center">
        <Typography variation="title2">No contacts found</Typography>
      </Block>
    );
  } else {
    content = (
      <Block pH="xxxl" flex1>
        <Search
          mV="xl"
          placeholder="Search contacts"
          onSearch={handleSearch}
          onClear={handleSearch}
        />

        <ScrollView pB="xl">
          <Button
            onPress={handleShare}
            title="Share Invite Link"
            variation="secondary"
            icon="share"
          />

          {sections.map((section) => {
            return (
              <Block key={section.title}>
                <Block pV="sm" pB="sm" bgColor="white">
                  <Typography variation="title3Bolder">{section.title}</Typography>
                </Block>

                {section.data.map((contact, index) => {
                  const handleSend = () => {
                    if (contact.phoneNumbers?.[0].number) {
                      handleSendSMS(
                        contact.phoneNumbers!.map((phoneNumber) => phoneNumber.number!)
                      );
                    } else {
                      toast.error('No phone number found for this contact');
                    }
                  };
                  return (
                    <Block
                      pB="sm"
                      pV="xl"
                      align="center"
                      bC="lightest"
                      bgColor="white"
                      onPress={handleSend}
                      key={contact.id}
                      flexDirection="row"
                      bBW={index === section.data.length - 1 ? 0 : 1}>
                      <Image
                        size={40}
                        circular
                        uri={
                          contact.image?.uri ||
                          getImageUrl(contact.name?.split(' ')[0], contact.name?.split(' ')[1])
                        }
                      />
                      <Block mL="xl">
                        <Typography variation="description1Bolder">{contact.name}</Typography>
                        <Typography>{contact.phoneNumbers?.[0].number}</Typography>
                      </Block>
                    </Block>
                  );
                })}
              </Block>
            );
          })}
        </ScrollView>
      </Block>
    );
  }

  return (
    <Block flex1>
      <DefaultNavigationBar title="Invite Patients" />
      {content}
    </Block>
  );
};

export default InvitePatientsScreen;
