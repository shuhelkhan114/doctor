import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, StatusBar } from 'react-native';
import { useQuery } from 'react-query';

import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import ErrorText from '@components/ErrorText/ErrorText';
import Image from '@components/Image/Image';
import Link from '@components/Link/Link';
import StaticNavigationBar from '@components/NavigationBar/StaticNavigationBar';
import ScrollView from '@components/ScrollView/ScrollView';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import API from '@core/services';
import useAppTheme from '@hooks/useTheme';
import ArticleCard from '@modules/Doctor/NewsFeed/NewsFeedCard/NewsFeedCard';
import { NewsFeedStackScreens } from '@navigation/Doctor/NewsFeedStack';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAppSelector } from '@store/store';

type NewsFeedScreenProps = NativeStackScreenProps<NewsFeedStackScreens, Screens.NewsFeedScreen>;

export type NewsFeedScreenParams = undefined;

const NewsFeedScreen: React.FC<NewsFeedScreenProps> = (props) => {
  const { navigation } = props;
  const height = useBottomTabBarHeight();
  const theme = useAppTheme();
  const auth = useAppSelector((state) => state.auth);
  const { isLoading, isError, data, refetch, isRefetching, isRefetchError } = useQuery(
    'doctor/articles',
    API.doctor.article.fetchArticles
  );

  const handleTourStart = () => {
    toast.success('Coming soon!', undefined, undefined, 'top');
  };

  let content: React.ReactNode = null;

  if (isLoading) {
    content = (
      <Block flex1>
        <ActivityIndicator color={theme.colors.mainBlue} />
      </Block>
    );
  } else if (isError) {
    content = (
      <Block>
        <ErrorText error={{ message: 'Unable to fetch Articles' }} />
      </Block>
    );
  } else if (data) {
    if (data.data.length < 1) {
      content = (
        <Block align="center">
          <Image
            size={235}
            resizeMode="contain"
            source={require('@assets/empty-states/newsfeed-empty-state.png')}
          />
          <Typography color="darker" center mT="xxxl" variation="title2Bolder">
            You still haven't shared any articles.
          </Typography>
          <Typography color="dark" mT="xl" center>
            Articles are super easy to share and keeps your patients engaged and informed.
          </Typography>
          <Link color="mainBlue" mT="xl" onPress={handleTourStart}>
            Learn how to share articles.
          </Link>
        </Block>
      );
    } else {
      content = data?.data.map((item) => {
        return <ArticleCard mB="xl" key={item.id} article={item} />;
      });
    }
  }

  return (
    <Block flex1 pB={height}>
      <StatusBar barStyle="dark-content" />
      <StaticNavigationBar title="NewsFeed" />

      <ScrollView pH="xxxl" pB="7xl" refreshing={isRefetching} onRefresh={refetch}>
        {content}
      </ScrollView>

      <Block pH="4xl" mB="xl">
        <Button
          icon="chat"
          title="New article"
          onPress={() => navigation.navigate(Screens.PublishArticleScreen)}
        />
      </Block>
    </Block>
  );
};

export default NewsFeedScreen;
