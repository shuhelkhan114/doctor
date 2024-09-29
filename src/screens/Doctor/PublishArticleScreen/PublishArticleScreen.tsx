import Clipboard from '@react-native-community/clipboard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FormikProvider, useFormik } from 'formik';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, TextInput } from 'react-native';

import AudioRecorder from '@components/AudioRecorder/AudioRecorder';
import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import DropDown from '@components/DropDown/DropDown';
import ErrorText from '@components/ErrorText/ErrorText';
import Icon from '@components/Icon/Icon';
import ClearIcon from '@components/Icons/ClearIcon';
import KeyboardView from '@components/KeyboardView/KeyboardView';
import PublishArticleToModal from '@components/Modals/PublishArticleToModal';
import DefaultNavigationBar from '@components/NavigationBar/DefaultNavigationBar';
import ScrollView from '@components/ScrollView/ScrollView';
import Typography from '@components/Typography/Typography';
import { defaultArticleImages } from '@core/config/article';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import API from '@core/services';
import { getRandomInteger, isValidLink } from '@core/utils/common';
import { logError } from '@core/utils/logger';
import { publishArticleValidationSchema } from '@core/validation/publishArticle';
import useAppTheme from '@hooks/useTheme';
import ArticlePreview from '@modules/Doctor/PublishArticle/ArticlePreview/ArticlePreview';
import { NewsFeedStackScreens } from '@navigation/Doctor/NewsFeedStack';
import { useAppSelector } from '@store/store';
import { Audio } from 'expo-av';
import { useMutation, useQueryClient } from 'react-query';

type PublishArticleScreenProps = NativeStackScreenProps<
  NewsFeedStackScreens,
  Screens.PublishArticleScreen
>;

export type PublishArticleScreenParams = undefined;

const initialValues = {
  gender: 'both',
  healthIssues: '',
  ageFrom: 0,
  ageTo: 100,
  about: '',
  link: '',
  recording: '',
  article_title: '',
  article_image_url: '',
};

const getHealthIssuesText = (healthIssues: string) => {
  if (healthIssues === '*') {
    return 'All of them';
  }

  if (healthIssues === '') {
    return 'None of them';
  }

  const healthIssuesArr = healthIssues.split(',');

  if (healthIssuesArr.length > 1) {
    return `${healthIssuesArr[0]} +${healthIssuesArr.length - 1}`;
  }

  return healthIssues;
};

const recording: Audio.Recording | null = new Audio.Recording();

const PublishArticleScreen: React.FC<PublishArticleScreenProps> = (props) => {
  const { navigation } = props;
  const theme = useAppTheme();
  const [pastingLink, setPastingLink] = useState(false);
  const [toModalVisible, setToModalVisible] = useState(false);
  const queryClient = useQueryClient();

  const configData = useAppSelector((state) => state.auth.config);

  const {
    isLoading: uploadingAudio,
    isError: uploadingError,
    mutateAsync: uploadAudio,
  } = useMutation(API.doctor.article.uploadAudio);
  const {
    isLoading: publishingArticle,
    isError: publishingError,
    mutateAsync: publishArticle,
  } = useMutation(API.doctor.article.publishArticle, {
    onSuccess: async () => {
      await queryClient.resetQueries('doctor/articles');
    },
  });

  const formik = useFormik({
    initialValues,
    validateOnMount: true,
    validationSchema: publishArticleValidationSchema,
    async onSubmit(values, formik) {
      try {
        let voice_note_url = '';

        if (values.recording) {
          const res = await uploadAudio(values.recording);
          voice_note_url = res.url;
        }

        await publishArticle({
          voice_note_url,
          about: values.about,
          article_url: values.link,
          audience_age_to: values.ageTo,
          audience_age_from: values.ageFrom,
          ...(values.healthIssues !== '' && {
            health_issues:
              values.healthIssues === '*'
                ? (configData as any).healthIssues
                : values.healthIssues.split(','),
          }),
          audience_gender: values.gender?.toLowerCase(),
          article_title: values.article_title || values.about,
          article_image_url:
            values.article_image_url || defaultArticleImages[getRandomInteger(0, 4)],
        });

        toast.success('Article published successfully.');
        navigation.goBack();
      } catch (error) {
        logError(error);
        toast.error('Unable to publish article, please try again.');
      }
    },
  });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        linkInput: {
          flex: 1,
          height: '100%',
          fontSize: 14,
          paddingHorizontal: theme.spacing.md,
        },
      }),
    []
  );

  useEffect(() => {
    Audio.requestPermissionsAsync();
  }, []);

  const handleAboutChange = (text: string) => {
    formik.setFieldValue('about', text);
  };

  const handleLinkChange = (link: string) => {
    formik.setFieldValue('link', link);
  };

  const handlePaste = async () => {
    try {
      setPastingLink(true);
      const link = await Clipboard.getString();
      if (link && isValidLink(link)) {
        formik.setFieldValue('link', link);
      } else {
        toast.error('Invalid URL, please paste a valid URL.');
      }
    } catch (error) {
      logError(error);
      toast.error('Unable to paste URL, please paste it manually.');
    } finally {
      setPastingLink(false);
    }
  };

  const handleClearUrl = () => {
    formik.setFieldValue('link', '');
  };

  const renderAboutField = ({ openModal }: { openModal: () => void }) => (
    <Block flexDirection="row" align="center" pV="xxl" bBW={1} bC="lightest" onPress={openModal}>
      <Typography variation="title3">
        About: <Typography variation="title3Bolder">{values.about}</Typography>
      </Typography>
      <Icon name="chevron-down" size={24} />
    </Block>
  );

  const aboutOptions = configData.article_about.map((aboutItem) => ({
    label: aboutItem.value,
    value: aboutItem.value,
  }));

  const { values } = formik;

  let to = 'All Patients';

  if (values.gender && values.ageFrom && values.ageTo && values.healthIssues) {
    to = `${values.gender}, ${values.ageFrom}-${values.ageTo}, ${getHealthIssuesText(
      values.healthIssues
    )}`;
  }

  const disabled = !formik.isValid;

  return (
    <KeyboardView>
      <FormikProvider value={formik}>
        <StatusBar barStyle="dark-content" />

        <Block flex1>
          <DefaultNavigationBar title="Publish Article" />

          <PublishArticleToModal
            visible={toModalVisible}
            onClose={() => setToModalVisible(false)}
          />

          <ScrollView pH="xxxl">
            <Block>
              <Block>
                <Block
                  pV="xxl"
                  bBW={1}
                  bC="lightest"
                  align="center"
                  flexDirection="row"
                  onPress={() => setToModalVisible(true)}>
                  <Typography variation="title3">
                    To:{' '}
                    <Typography variation={to === 'All Patients' ? 'title3Bolder' : 'title3'}>
                      {to}
                    </Typography>
                  </Typography>
                  <Icon name="chevron-down" size={24} />
                </Block>

                <DropDown
                  placeholder="About"
                  value={values.about}
                  options={aboutOptions}
                  onSelect={handleAboutChange}
                  renderField={renderAboutField}
                />

                <Block
                  mT="4xl"
                  pH="xs"
                  pV="xs"
                  pR="lg"
                  rounded="xl"
                  align="center"
                  flexDirection="row"
                  bgColor="lightest2">
                  <Block
                    pV="lg"
                    pH="lg"
                    rounded="xl"
                    onPress={handlePaste}
                    bgColor={values.link ? 'transparent' : 'mainBlue'}>
                    {pastingLink ? (
                      <ActivityIndicator size={24} color="white" />
                    ) : (
                      <Icon
                        size={24}
                        name="exam-board"
                        color={values.link ? theme.colors.darkest : 'white'}
                      />
                    )}
                  </Block>
                  <TextInput
                    value={values.link}
                    numberOfLines={1}
                    style={styles.linkInput}
                    onChangeText={handleLinkChange}
                    placeholder="Paste link to article"
                    placeholderTextColor={theme.colors.dark}
                  />

                  {values.link && (
                    <Block onPress={handleClearUrl}>
                      <ClearIcon />
                    </Block>
                  )}
                </Block>

                <Block mT="xl">
                  <AudioRecorder
                    recording={recording}
                    onRecordComplete={(record) => {
                      formik.setFieldValue('recording', record?.file);
                    }}
                  />
                </Block>

                {values.link && values.about && (
                  <ArticlePreview
                    onSuccess={(values) => {
                      formik.setFieldValue('article_title', values.article_title);
                      formik.setFieldValue('article_image_url', values.article_image_url);
                    }}
                    mT="xxxl"
                    link={values.link}
                    about={values.about}
                  />
                )}

                {(uploadingError || publishingError) && (
                  <ErrorText
                    error={{ message: 'Unable to publish article, please try again later!' }}
                  />
                )}
              </Block>
            </Block>
          </ScrollView>

          <Block pH="xxxl" mV="xl">
            <Button
              icon="chat"
              disabled={disabled}
              title="Publish Article"
              onPress={formik.submitForm}
              loading={uploadingAudio || publishingArticle}
            />
          </Block>
        </Block>
      </FormikProvider>
    </KeyboardView>
  );
};

export default PublishArticleScreen;
