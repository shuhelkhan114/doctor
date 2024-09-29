import React, { useMemo } from 'react';

import AudioPlayer from '@components/AudioPlayer/AudioPlayer';
import Block, { BlockProps } from '@components/Block/Block';
import Image from '@components/Image/Image';
import Typography from '@components/Typography/Typography';
import { openLink } from '@core/utils/rn-link';
import { Article } from '@typings/model/article';
import { StyleSheet } from 'react-native';

interface ArticleCardProps extends BlockProps {
  hideFooter?: boolean;
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = (props) => {
  const { article, hideFooter, ...restProps } = props;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        coverImage: {
          width: '100%',
          height: 88,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        },
        footer: {
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
        },
      }),
    []
  );

  return (
    <Block shadow="sm" {...restProps}>
      <Block absolute top={8} left={8} zIndex={9}>
        <Block pH="md" pV="sm" rounded="xxxl" bgColor="mainBlue">
          <Typography uppercase color="white" variation="description3Bolder">
            {article.about}
          </Typography>
        </Block>
      </Block>

      <Block
        absolute
        top={8}
        right={8}
        zIndex={9}
        pH="md"
        pV="sm"
        rounded="xxxl"
        onPress={() => openLink(article.article_url)}
        bgColor="mainBlue">
        <Typography uppercase color="white" variation="description3Bolder">
          VISIT
        </Typography>
      </Block>

      <Image uri={article.article_image_url} imageStyle={styles.coverImage} />

      <Block pH="xl" pV="xl" bgColor="white" style={hideFooter ? styles.footer : undefined}>
        <Typography color="darkest" variation="title3">
          {article.article_title}
        </Typography>

        <Block flexDirection="row" mT="md" align="center">
          <Image uri={article.doctor?.doctor_image} size={19} circular />
          <Typography color="darkest" mL="md">
            {article.doctor?.first_name + ' ' + article.doctor?.last_name}
          </Typography>
        </Block>
      </Block>

      {!hideFooter && (
        <Block pV="md" pH="md" bgColor="white" bTW={1} bC="lightest" style={styles.footer}>
          <Typography color="dark" mL="md">
            Hear doctor's notes
          </Typography>

          {article.voice_note_url && (
            <AudioPlayer title={article.article_title} theme="light" url={article.voice_note_url} />
          )}
        </Block>
      )}
    </Block>
  );
};

export default ArticleCard;
