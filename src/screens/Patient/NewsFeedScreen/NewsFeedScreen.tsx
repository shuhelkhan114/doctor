import Block from '@components/Block/Block';
import Spinner from '@components/Loaders/Spinner';
import DefaultNavigationBar from '@components/NavigationBar/DefaultNavigationBar';
import ScrollView from '@components/ScrollView/ScrollView';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import API from '@core/services';
import useAppTheme from '@hooks/useTheme';
import ArticleCard from '@modules/Doctor/NewsFeed/NewsFeedCard/NewsFeedCard';
import { DashboardStackScreens } from '@navigation/Patient/DashboardStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef } from 'react';
import { ScrollView as NativeScrollView, View } from 'react-native';
import { useQuery } from 'react-query';

type NewsFeedScreenProps = NativeStackScreenProps<DashboardStackScreens, Screens.NewsFeedScreen>;

export type NewsfeedScreenParams =
  | undefined
  | {
      selectedArticleId?: string;
    };

const NewsFeedScreen: React.FC<NewsFeedScreenProps> = (props) => {
  const { route } = props;
  const scrollViewRef = useRef<NativeScrollView>(null);
  const targetViewRef = useRef<View>(null);
  const selectedArticleId = route.params?.selectedArticleId;

  const theme = useAppTheme();

  const {
    isLoading,
    isError,
    data: articles,
  } = useQuery('patient/newsfeed', API.patient.newsfeed.fetchNewsfeed);

  const scrollToArticle = () => {
    targetViewRef.current?.measureLayout(
      scrollViewRef.current as any,
      (x: number, y: number) => {
        scrollViewRef.current?.scrollTo({ x: 0, y, animated: true });
      },
      () => {}
    );
  };

  useEffect(() => {
    if (selectedArticleId) {
      scrollToArticle();
    }
  }, [selectedArticleId, targetViewRef.current, scrollViewRef.current]);

  let content: React.ReactNode = null;

  if (isLoading) {
    content = <Spinner />;
  } else if (isError) {
    content = (
      <Block flex1 justify="center" align="center">
        <Typography>Unable to fetch articles!</Typography>
      </Block>
    );
  } else if (articles) {
    if (articles?.data.length === 0) {
      content = (
        <Block>
          <Typography>No articles found!</Typography>
        </Block>
      );
    } else {
      content = articles.data.map((article) => {
        return (
          <Block
            pV="xl"
            pH="4xl"
            key={article.id}
            // @ts-ignore
            ref={selectedArticleId === article.id ? targetViewRef : undefined}
            style={{
              backgroundColor:
                selectedArticleId === article.id ? `${theme.colors.accent}33` : undefined,
            }}>
            <ArticleCard article={article} />
          </Block>
        );
      });
    }
  }

  return (
    <Block flex1>
      <DefaultNavigationBar title="Articles shared with you" />
      <Block flex1>
        <ScrollView
          // @ts-ignore
          ref={scrollViewRef}>
          {content}
        </ScrollView>
      </Block>
    </Block>
  );
};

export default NewsFeedScreen;
