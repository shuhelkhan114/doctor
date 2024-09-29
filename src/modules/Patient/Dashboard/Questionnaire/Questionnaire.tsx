import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import Typography from '@components/Typography/Typography';
import toast from '@core/lib/toast';
import useAppTheme from '@hooks/useTheme';
import React from 'react';

interface QuestionnaireProps {}

const Questionnaire: React.FC<QuestionnaireProps> = (props) => {
  const theme = useAppTheme();

  return <Block />;

  const handleStartQuestionnaire = () => {
    toast.success('Coming soon...');
  };

  return (
    <Block pH="xxxl">
      <Block bgColor="mainBlue" mT="4xl" pH="xxxl" pV="xxxl" rounded="xxl">
        <Typography center variation="title3" color="white">
          Hey, let's learn more about your health habits.
        </Typography>
        <Button
          variation="secondary"
          title="Start questionnaire"
          onPress={handleStartQuestionnaire}
          style={{ marginTop: theme.spacing.xl }}
          textStyle={{ color: theme.colors.text }}
        />
      </Block>
    </Block>
  );
};

export default Questionnaire;
