import Block from '@components/Block/Block';
import ErrorText from '@components/ErrorText/ErrorText';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import toast from '@core/lib/toast';
import API from '@core/services';
import { PatientRequestEntity } from '@core/services/doctor/request';
import { StartStackScreens } from '@navigation/Doctor/StartStack';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { refetchDoctor } from '@store/slices/authSlice';
import { useAppDispatch } from '@store/store';
import { ActivityIndicator } from 'react-native';
import { useMutation, useQueryClient } from 'react-query';
import PatientRow from '../PatientRow/PatientRow';

interface RequestProps {
  request: PatientRequestEntity;
}

const RequestCard: React.FC<RequestProps> = (props) => {
  const { request } = props;
  const { id, patient, patient_id } = request;

  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<StackNavigationProp<StartStackScreens, Screens.RequestsScreen>>();
  const queryClient = useQueryClient();
  const {
    isLoading: accepting,
    isError: acceptError,
    mutateAsync: acceptRequest,
  } = useMutation(API.doctor.request.acceptRequest);
  const {
    isLoading: rejecting,
    isError: rejectError,
    mutateAsync: rejectRequest,
  } = useMutation(API.doctor.request.declineRequest);

  const updateCache = async () => {
    await queryClient.invalidateQueries('doctor/patient-requests');
    await queryClient.invalidateQueries('doctor/patients');
    await queryClient.invalidateQueries('notifications');
    await queryClient.invalidateQueries(['doctor/patient', request.patient?.id]);
    dispatch(refetchDoctor());
  };

  const handleAccept = async () => {
    await acceptRequest(id);
    await updateCache();
    toast.success(`${patient.first_name} joined your patients list`);
  };

  const handleDecline = async () => {
    await rejectRequest(id);
    await updateCache();
    toast.success(`You decline ${patient.first_name} as your patient`);
  };

  const navigateToPatientRequest = () => {
    navigation.navigate(Screens.PatientDetailScreen, {
      patientId: patient_id,
    });
  };

  return (
    <Block rounded="xl" pH="xl" pV="xl" onPress={navigateToPatientRequest} bW={1} bC="lightest">
      {(acceptError || rejectError) && <ErrorText error={acceptError || rejectError} />}

      <PatientRow
        referer={request.referrer}
        doctorsCount={patient.total_doctors}
        healthIssuesCount={patient.total_health_issues}
        name={patient?.first_name + ' ' + patient.last_name}
        imageUrl={patient.patient_image_resized?.[3]?.image_url}
      />

      {request.referred_note && <Typography>{request.referred_note}</Typography>}

      <Block flexDirection="row" justify="flex-end" mT="xl">
        {accepting || rejecting ? (
          <ActivityIndicator />
        ) : (
          <>
            <Block onPress={handleDecline}>
              <Typography mR="4xl" variation="title3Bolder">
                Decline
              </Typography>
            </Block>

            <Block onPress={handleAccept}>
              <Typography variation="title3Bolder">Accept</Typography>
            </Block>
          </>
        )}
      </Block>
    </Block>
  );
};

export default RequestCard;
