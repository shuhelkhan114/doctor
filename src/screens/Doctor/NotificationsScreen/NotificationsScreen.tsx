import Block from '@components/Block/Block';
import ErrorText from '@components/ErrorText/ErrorText';
import Image from '@components/Image/Image';
import Spinner from '@components/Loaders/Spinner';
import DefaultNavigationBar from '@components/NavigationBar/DefaultNavigationBar';
import ScrollView from '@components/ScrollView/ScrollView';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import API from '@core/services';
import RequestCard from '@modules/Doctor/Patients/PatientRequest/PatientRequestCard';
import { StartStackScreens } from '@navigation/Doctor/StartStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from 'react-query';

type NotificationsScreenProps = NativeStackScreenProps<
  StartStackScreens,
  Screens.NotificationsScreen
>;

export type NotificationsScreenParams = undefined;

const NotificationsScreen: React.FC<NotificationsScreenProps> = (props) => {
  const { navigation } = props;

  const {
    isLoading,
    isError,
    error,
    isRefetching,
    data: notification,
    refetch,
  } = useQuery('notifications', API.doctor.notification.getAllNotifications);

  let content: React.ReactNode = null;

  if (isLoading) {
    content = <Spinner />;
  } else if (isError) {
    content = (
      <Block flex1 justify="center" align="center">
        <ErrorText error={error} />
      </Block>
    );
  } else if (notification) {
    if (
      !notification.requests.length &&
      !notification.doctors_notes.length &&
      !notification.medications.length
    ) {
      content = (
        <Block flex1 justify="center" align="center">
          <Typography>No notifications</Typography>
        </Block>
      );
    } else {
      const medicationsList = Object.values(notification.medications);
      const notesList = Object.values(notification.doctors_notes);
      content = (
        <ScrollView pH="xxxl" refreshing={isRefetching} onRefresh={refetch}>
          <Block>
            {notification.requests.length > 0 && (
              <Block mT="xxxl">
                <Typography mB="xl" numberOfLines={1} variation="title3Bolder">
                  {notification.requests.length} Requests to be your patient
                </Typography>

                {notification.requests.map((request, index) => {
                  console.log('Request: ', request);
                  return (
                    <Block
                      key={request.id}
                      bgColor="white"
                      style={{
                        ...(index > 0 && {
                          position: 'absolute',
                          bottom: 3,
                          left: -3,
                          width: '100%',
                        }),
                      }}>
                      <RequestCard
                        request={
                          {
                            ...request,
                            ...request.request,
                            id: request.request_id,
                            patient: {
                              ...request.patient,
                              total_doctors: 0,
                              total_health_issues: 0,
                            },
                          } as any
                        }
                      />
                    </Block>
                  );
                })}
              </Block>
            )}

            {medicationsList.length > 0 && (
              <Block mT="xxxl">
                <Typography mB="xl" numberOfLines={1} variation="title3Bolder">
                  {medicationsList.length} medications changes
                </Typography>
                {medicationsList.map((medication, index) => {
                  return (
                    <Block
                      pV="lg"
                      bC="lightest"
                      align="center"
                      flexDirection="row"
                      key={medication.id}
                      onPress={() =>
                        navigation.navigate(Screens.MedicationChangesScreen, {
                          patient: {
                            imageUrl: medication.patient_image_resized[3]?.image_url,
                            firstName: medication.first_name,
                            lastName: medication.last_name,
                          },
                          medicationChangesCount: medication.medication_count_changes,
                        })
                      }
                      bBW={medicationsList.length - 1 === index ? 0 : 1}>
                      <Image
                        circular
                        mR="xl"
                        size={56}
                        uri={medication.patient_image_resized[3]?.image_url}
                      />
                      <Block>
                        <Typography variation="title3">
                          {medication.first_name} {medication.last_name}
                        </Typography>
                        <Typography variation="description1" color="dark">
                          {medication.medication_count_changes} medications change
                        </Typography>
                      </Block>
                    </Block>
                  );
                })}
              </Block>
            )}

            {notesList.length > 0 && (
              <Block mT="xxxl">
                <Typography mB="xl" numberOfLines={1} variation="title3Bolder">
                  {notesList.length} notes added
                </Typography>

                {notesList.map((note, index) => {
                  return (
                    <Block
                      pV="lg"
                      bC="lightest"
                      align="center"
                      flexDirection="row"
                      key={note.id}
                      bBW={notesList.length - 1 === index ? 0 : 1}>
                      <Image
                        circular
                        mR="xl"
                        size={56}
                        uri={note.patient_image_resized[3]?.image_url}
                      />
                      <Block flex1>
                        <Typography variation="title3">
                          {note.first_name} {note.last_name}
                        </Typography>
                        <Typography numberOfLines={2} variation="description1" color="dark">
                          {`${
                            note.general_note_changes_count > 0
                              ? `${note.general_note_changes_count} general note`
                              : ''
                          }`}
                          {`${
                            note.health_issues_note_changes_count > 0
                              ? `, ${note.health_issues_note_changes_count} health issue note`
                              : ''
                          }`}
                        </Typography>
                      </Block>
                    </Block>
                  );
                })}
              </Block>
            )}
          </Block>
        </ScrollView>
      );
    }
  }

  return (
    <Block flex1>
      <DefaultNavigationBar title="Notifications" />

      {content}
    </Block>
  );
};

export default NotificationsScreen;
