import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFormik } from 'formik';
import { ScrollView } from 'react-native';

import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import CheckBox from '@components/CheckBox/CheckBox';
import Icon from '@components/Icon/Icon';
import NavigationBar from '@components/NavigationBar/NavigationBar';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import { editDOBValidationSchema } from '@core/validation/editProfile';
import useAppTheme from '@hooks/useTheme';
import TrusteeRow from '@modules/Patient/PatientDashboard/TrusteeRow/TrusteeRow';
import { ProfileStackScreens } from '@navigation/Patient/ProfileStack';

type EditAccessScreenProps = NativeStackScreenProps<ProfileStackScreens, Screens.EditAccessScreen>;

export type EditAccessScreenParams = undefined;

const initialValues = {
  chat: false,
  charts: false,
};

const EditAccessScreen: React.FC<EditAccessScreenProps> = (props) => {
  const { navigation } = props;
  const theme = useAppTheme();
  const formik = useFormik({
    initialValues,
    validationSchema: editDOBValidationSchema,
    validateOnMount: true,
    onSubmit(values, formik) {
      navigation.goBack();
      toast.success('Access updated successfully!');
    },
  });

  const { values } = formik;

  const person = {
    id: '2',
    name: 'Linda Hussein',
    imageUrl:
      'https://images.pexels.com/photos/355036/pexels-photo-355036.jpeg?h=350&auto=compress&cs=tinysrgb',
    permission: 'Full access to charts and chats',
  };

  const warning = !values.charts && !values.chat;
  const disabled = !formik.isValid || formik.isSubmitting;

  return (
    <Block flex1>
      <NavigationBar title="Edit Access" variation="transparent" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: theme.spacing.xxxl }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'space-between',
          flex: 1,
        }}>
        <Block pV="xl">
          <TrusteeRow
            name={person.name}
            imageUrl={person.imageUrl}
            permission={person.permission}
          />

          <Typography variation="title3" mT="4xl">
            {person.name} has access to
          </Typography>

          <CheckBox
            checked={values.charts}
            label="Doctor's chat about you"
            style={{ marginTop: theme.spacing.xxxl }}
            onChange={(checked) => formik.setFieldValue('charts', checked)}
          />

          <CheckBox
            checked={values.chat}
            label="Your charts information"
            style={{ marginTop: theme.spacing.xxxl }}
            onChange={(checked) => formik.setFieldValue('chat', checked)}
          />
        </Block>
      </ScrollView>
      <Block
        pH="xxxl"
        pV="xl"
        style={{
          backgroundColor: warning ? theme.colors.negativeAction + '1a' : 'white',
        }}>
        {warning && (
          <Block mB="xxxl" pH="xl" flexDirection="row" align="center">
            <Icon name="error" size={24} />
            <Typography mL="xl">
              By clicking remove, you are deleting {person.name} from your Doc Hello
            </Typography>
          </Block>
        )}
        <Button
          disabled={disabled}
          title={warning ? 'Remove' : 'Save'}
          onPress={formik.submitForm}
          style={{
            ...(warning && {
              backgroundColor: warning ? theme.colors.negativeAction : undefined,
            }),
          }}
        />
      </Block>
    </Block>
  );
};

export default EditAccessScreen;
