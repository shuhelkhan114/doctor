import Block from '@components/Block/Block';
import ScrollView from '@components/ScrollView/ScrollView';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import API from '@core/services';
import ArticleCard from '@modules/Doctor/NewsFeed/NewsFeedCard/NewsFeedCard';
import { DashboardStackScreens } from '@navigation/Patient/DashboardStack';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Dimensions } from 'react-native';
import { useQuery } from 'react-query';

interface ArticlesProps {}

const Articles: React.FC<ArticlesProps> = () => {
  const navigation =
    useNavigation<StackNavigationProp<DashboardStackScreens, Screens.DashboardScreen>>();

  const {
    isLoading,
    isError,
    data: articles,
  } = useQuery('patient/newsfeed', API.patient.newsfeed.fetchNewsfeed);

  let content: React.ReactNode = null;

  if (isLoading) {
    content = <ActivityIndicator />;
  } else if (isError) {
    content = (
      <Block>
        <Typography>Unable to fetch articles, please try again!</Typography>
      </Block>
    );
  } else if (articles) {
    if (articles?.data?.length < 1) {
      content = null;
    } else {
      content = (
        <Block>
          <Block
            pH="xxxl"
            mT="4xl"
            flexDirection="row"
            justify="space-between"
            onPress={() => navigation.navigate(Screens.NewsFeedScreen)}>
            <Typography mL="sm" variation="title3Bolder" mB="xl">
              Articles shared with you
            </Typography>
            <Typography color="mainBlue">VIEW ALL</Typography>
          </Block>
          <ScrollView horizontal>
            {articles.data.slice(0, 5).map((article) => {
              return (
                <ArticleCard
                  mB="xl"
                  mL="xxxl"
                  key={article.id}
                  article={article}
                  width={Dimensions.get('screen').width * 0.8}
                />
              );
            })}
          </ScrollView>
        </Block>
      );
    }
  }

  return <>{content}</>;
};

export default Articles;
