import * as Yup from 'yup';

export const publishArticleValidationSchema = Yup.object().shape({
  about: Yup.string().required('About is required!'),
  link: Yup.string().required('Link is required!'),
  recording: Yup.string().required('Recording is required!'),
});
