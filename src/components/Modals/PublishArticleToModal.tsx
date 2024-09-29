import Checkbox from 'expo-checkbox';
import { useFormikContext } from 'formik';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import RangeSlider from 'react-native-range-slider-expo';

import ResetIcon from '@components/Icons/ResetIcon';
import Modal from '@components/Modal/Modal';
import useAppTheme from '@hooks/useTheme';
import { useAppSelector } from '@store/store';
import Block from '../Block/Block';
import DropDown from '../DropDown/DropDown';
import Icon from '../Icon/Icon';
import Typography from '../Typography/Typography';

const genders = ['both', 'male', 'female'];

interface PublishArticleToModalProps {
  visible: boolean;
  onClose: () => void;
}

const PublishArticleToModal: React.FC<PublishArticleToModalProps> = (props) => {
  const { visible, onClose } = props;
  const theme = useAppTheme();
  const formik = useFormikContext<any>();

  const appConfig = useAppSelector((state) => state.auth.config);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        modal: {
          margin: 0,
          justifyContent: 'flex-end',
        },
        container: {
          backgroundColor: 'white',
          borderTopLeftRadius: 34,
          borderTopRightRadius: 34,
          padding: theme.spacing['4xl'],
        },
      }),
    []
  );

  const handleReset = () => {
    formik.setValues({
      gender: 'both',
      healthIssues: '',
      ageFrom: 0,
      ageTo: 100,
    });
  };

  const { values } = formik;

  let rangeText = '';
  if (formik.values.ageFrom === 0 && formik.values.ageTo === 100) {
    rangeText = 'All ages';
  } else {
    rangeText = `Between ${formik.values.ageFrom} and ${formik.values.ageTo} years old`;
  }

  return (
    <Modal visible={visible} onClose={onClose} disabledSwipe>
      <Block flexDirection="row" align="center" justify="space-between">
        <Typography flex1 variation="title2">
          Article target audience
        </Typography>
        <Block flexDirection="row" align="center" mL="xl" onPress={handleReset}>
          <ResetIcon />
          <Typography>RESET</Typography>
        </Block>
      </Block>

      <Typography variation="description1" mT="xxl">
        Gender
      </Typography>

      <Block flexDirection="row" mT="md">
        {genders.map((gender, index) => {
          return (
            <Block
              bW={1}
              key={gender}
              bgColor="accent2"
              bC="secondaryBlue"
              onPress={() => formik.setFieldValue('gender', gender)}
              bRW={genders.length - 1 !== index ? 0 : 1}
              style={{
                flex: 1,
                paddingVertical: 6,
                ...(index === 0 && {
                  borderTopLeftRadius: theme.rounded.xxxl,
                  borderBottomLeftRadius: theme.rounded.xxxl,
                }),
                ...(index === genders.length - 1 && {
                  borderTopRightRadius: theme.rounded.xxxl,
                  borderBottomRightRadius: theme.rounded.xxxl,
                }),
                ...(gender === values.gender && {
                  backgroundColor: theme.colors.secondaryBlue,
                }),
              }}>
              <Typography
                color={gender === values.gender ? 'white' : 'darkest'}
                center
                variation="description1">
                {gender}
              </Typography>
            </Block>
          );
        })}
      </Block>

      <Block bgColor="lightest2" mV="xxl" style={{ height: 1 }} />

      <Block>
        <Block flexDirection="row" justify="space-between" mB="md">
          <Typography variation="description1">Age</Typography>
          <Typography variation="description1">{rangeText}</Typography>
        </Block>
        <RangeSlider
          min={0}
          max={100}
          showRangeLabels={false}
          knobSize={20}
          barHeight={4}
          initialFromValue={formik.values.ageFrom}
          initialToValue={formik.values.ageTo}
          fromKnobColor={theme.colors.secondaryBlue}
          toKnobColor={theme.colors.secondaryBlue}
          inRangeBarColor={theme.colors.secondaryBlue}
          outOfRangeBarColor={theme.colors.lightest}
          containerStyle={{ paddingVertical: 0, margin: 0 }}
          fromValueOnChange={(value) => formik.setFieldValue('ageFrom', value)}
          toValueOnChange={(value) => formik.setFieldValue('ageTo', value)}
        />
      </Block>

      <Block bgColor="lightest2" mV="xxl" style={{ height: 1, marginTop: 40 }} />

      <Block>
        <Typography variation="description1" mB="md">
          Health Issues
        </Typography>
        <DropDown
          multiple
          searchable
          value={values.healthIssues}
          placeholder="All of them"
          modalTitle="Health Issue"
          onSelect={(value) => formik.setFieldValue('healthIssues', value)}
          renderTitle={({ closeModal }) => (
            <Block flexDirection="row" pB="lg" align="center" justify="space-between">
              <Block onPress={closeModal}>
                <Icon name="arrow-left" size={24} color={theme.colors.secondaryBlue} />
              </Block>

              <Typography mL="lg" variation="title2" style={{ marginRight: 'auto' }}>
                Health Issue
              </Typography>

              <Checkbox
                value={values.healthIssues === '*'}
                onValueChange={(checked) => {
                  if (checked) {
                    formik.setFieldValue('healthIssues', '*');
                  } else {
                    formik.setFieldValue('healthIssues', '');
                  }
                }}
              />
            </Block>
          )}
          options={appConfig.health_issues.map((healthIssue) => ({
            label: healthIssue.value,
            value: healthIssue.value,
          }))}
        />
      </Block>
    </Modal>
  );
};

export default PublishArticleToModal;
