import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FormikProvider, useFormik } from 'formik';

import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import DefaultNavigationBar from '@components/NavigationBar/DefaultNavigationBar';
import ScrollView from '@components/ScrollView/ScrollView';
import FormikDateInput from '@components/formik/FormikDateInput/FormikDateInput';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import API from '@core/services';
import { editDOBValidationSchema } from '@core/validation/editProfile';
import useAppTheme from '@hooks/useTheme';
import { ProfileStackScreens } from '@navigation/Patient/ProfileStack';
import { refetchPatient } from '@store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@store/store';
import { useEffect } from 'react';
import { useMutation } from 'react-query';

type UpdateDOBScreenProps = NativeStackScreenProps<ProfileStackScreens, Screens.UpdateDOBScreen>;

export type UpdateDOBScreenParams = undefined;

const initialValues = {
  date_of_birth: '',
};

const UpdateDOBScreen: React.FC<UpdateDOBScreenProps> = (props) => {
  const { navigation } = props;

  const theme = useAppTheme();
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const { isLoading, mutate: updateProfile } = useMutation(API.patient.auth.updateProfile, {
    onSuccess() {
      toast.success('Date of birth updated successfully');
      dispatch(refetchPatient());
      navigation.goBack();
    },
    onError() {
      toast.error('Unable to update date of birth, please try again!');
    },
  });

  const formik = useFormik({
    initialValues,
    validationSchema: editDOBValidationSchema,
    validateOnMount: true,
    onSubmit(values, formik) {
      updateProfile(values);
    },
  });

  useEffect(() => {
    if (auth.patient) {
      formik.setValues({
        date_of_birth: auth.patient.date_of_birth,
      });
    }
  }, []);

  const disabled = !formik.isValid || formik.isSubmitting;

  return (
    <Block flex1 pB="xxxl">
      <DefaultNavigationBar title="Edit Date of Birth" />

      <ScrollView pH="xxxl" pB="xl">
        <FormikProvider value={formik}>
          <Block pV="xxxl">
            <FormikDateInput
              name="date_of_birth"
              dateFormat="dd-MM-yyyy"
              maxDate={new Date()}
              placeholder="Date of Birth"
              inputStyle={{
                ...theme.shadow.sm,
              }}
            />
          </Block>
        </FormikProvider>
      </ScrollView>
      <Block pH="xxxl">
        <Button title="Save" loading={isLoading} disabled={disabled} onPress={formik.submitForm} />
      </Block>
    </Block>
  );
};

export default UpdateDOBScreen;
