import Block, { BlockProps } from '@components/Block/Block';
import Typography from '@components/Typography/Typography';
import { defaultArticleImages } from '@core/config/article';
import API from '@core/services';
import { generateRandomNumber, isValidLink } from '@core/utils/common';
import ArticleCard from '@modules/Doctor/NewsFeed/NewsFeedCard/NewsFeedCard';
import { useAppSelector } from '@store/store';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useQuery } from 'react-query';

interface ArticlePreviewProps extends BlockProps {
  link: string;
  about: string;
  onSuccess: (values: { article_title: string; article_image_url: string }) => void;
}

const ArticlePreview: React.FC<ArticlePreviewProps> = (props) => {
  const { link, about, onSuccess, ...restProps } = props;

  const auth = useAppSelector((state) => state.auth);

  const { isLoading, isError, data } = useQuery('doctor/og', () => API.doctor.og.fetchOg(link), {
    enabled: isValidLink(link),
    onSuccess(data) {
      onSuccess?.({
        article_title: data?.ogTitle || about,
        article_image_url: data?.ogImage?.url || defaultArticleImages[generateRandomNumber(0, 4)],
      });
    },
  });

  let content: React.ReactNode = null;

  if (isLoading) {
    content = <ActivityIndicator />;
  } else {
    let noteText = '';
    if (!isValidLink(link)) {
      noteText =
        'NOTE: Invalid Link, Could not extract required information, please try using different link';
    } else if (isError) {
      noteText = 'NOTE: Could not extract required information, please try using different link';
    } else if (!data?.ogImage?.url) {
      noteText = 'NOTE: No image found in provided link, using default images';
    }
    content = (
      <Block>
        <Typography mB="xl" variation="title3">
          Publication Preview
        </Typography>
        {noteText && (
          <Typography mB="lg" variation="description2" color="light" uppercase>
            {noteText}
          </Typography>
        )}
        <ArticleCard
          hideFooter
          article={
            {
              voice_note_url: '',
              article_title: data?.ogTitle || about,
              article_image_url:
                data?.ogImage?.url || defaultArticleImages[generateRandomNumber(0, 4)],
              about,
              doctor: {
                first_name: auth.doctor?.first_name,
                last_name: auth.doctor?.last_name,
                doctor_image: auth.doctor?.doctor_image,
              },
            } as any
          }
        />
      </Block>
    );
  }
  return <Block {...restProps}>{content}</Block>;
};

export default ArticlePreview;
