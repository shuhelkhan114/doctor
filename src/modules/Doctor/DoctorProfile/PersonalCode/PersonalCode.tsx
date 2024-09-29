import React from 'react';
import { Share } from 'react-native';

import * as Clipboard from 'expo-clipboard';

import toast from '@core/lib/toast';
import { logError } from '@core/utils/logger';

import Block from '@components/Block/Block';
import Divider from '@components/Divider/Divider';
import Image from '@components/Image/Image';
import Typography from '@components/Typography/Typography';

interface PersonalCodeProps {
  personalCode: string;
  closeModal: (visible: false) => void;
}

const PersonalCode: React.FC<PersonalCodeProps> = (props) => {
  const { personalCode, closeModal } = props;

  const copyCodeToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(personalCode);
      toast.success('Code copied to clipboard');
    } catch (error) {
      logError(error);
      toast.error('Unable to copy to clipboard, please try again');
    } finally {
      closeModal(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: personalCode });
    } catch (err) {
      logError(err);
      toast.error(
        'Unable to share code, Please try again or copy it manually',
        'Copy Instead',
        copyCodeToClipboard
      );
    } finally {
      closeModal(false);
    }
  };

  return (
    <Block>
      <Block pH="4xl" pV="4xl">
        <Typography center variation="title1Bolder">
          Your personal code
        </Typography>
        <Typography variation="description1" center mT="xxxl">
          Share it with your patients so they can easily add you to their Care Team in Doc Hello
        </Typography>
        <Typography center mT="xxxl" color="dark" variation="title1Bolder" letterSpacing={6.4}>
          {personalCode}
        </Typography>
      </Block>

      <Divider />

      <Block flexDirection="row" justify="center" align="center" pH="xxxl" pV="xxxl">
        <Block flexDirection="row" align="center" mR="xxxl" onPress={handleShare}>
          <Image size={24} source={require('@assets/icons/share.png')} />
          <Typography mL="md" variation="title3">
            Share
          </Typography>
        </Block>

        <Block flexDirection="row" align="center" onPress={copyCodeToClipboard}>
          <Image size={24} source={require('@assets/icons/copy.png')} />
          <Typography mL="md" variation="title3">
            Copy
          </Typography>
        </Block>
      </Block>
    </Block>
  );
};

export default PersonalCode;
