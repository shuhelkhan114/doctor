import React, { useState } from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from 'react-query';

import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import ThreeDotsVertical from '@components/Icons/ThreeDotsVertical';
import Spinner from '@components/Loaders/Spinner';
import Modal from '@components/Modal/Modal';
import DefaultNavigationBar from '@components/NavigationBar/DefaultNavigationBar';
import ScrollView from '@components/ScrollView/ScrollView';
import Typography from '@components/Typography/Typography';
import { Screens } from '@core/config/screens';
import API from '@core/services';
import DoctorNotes from '@modules/Doctor/PatientDetail/DoctorNotes/DoctorNotes';
import Doctors from '@modules/Doctor/PatientDetail/Doctors/Doctors';
import HealthIssueActions from '@modules/Doctor/PatientDetail/HealthIssueActions/HealthIssueActions';
import HealthIssues from '@modules/Doctor/PatientDetail/HealthIssues/HealthIssues';
import MedicationActions from '@modules/Doctor/PatientDetail/MedicationActions/MedicationActions';
import Medications from '@modules/Doctor/PatientDetail/Medications/Medications';
import MessageCareTeam from '@modules/Doctor/PatientDetail/MessageCareTeam/MessageCareTeam';
import RemovePatient from '@modules/Doctor/PatientDetail/RemovePatient/RemovePatient';
import RequestCard from '@modules/Doctor/Patients/PatientRequest/PatientRequestCard';
import PatientRow from '@modules/Doctor/Patients/PatientRow/PatientRow';
import { PatientsStackScreens } from '@navigation/Doctor/PatientsStack';
import { useAppSelector } from '@store/store';
import { PatientRowData } from '@typings/common';
import { HealthIssue } from '@typings/model/healthIssue';
import { Medication } from '@typings/model/medication';
import { StatusBar } from 'react-native';

type PatientDetailScreenProps = NativeStackScreenProps<
  PatientsStackScreens,
  Screens.PatientDetailScreen
>;

export type PatientDetailScreenParams = {
  patientId: string;
};

const PatientDetailScreen: React.FC<PatientDetailScreenProps> = (props) => {
  const { navigation, route } = props;
  const { patientId } = route.params;
  const auth = useAppSelector((state) => state.auth);
  const {
    isLoading,
    isError,
    data: patient,
    isRefetching,
    refetch,
  } = useQuery(['doctor/patient', patientId], () =>
    API.doctor.patient.fetchSinglePatient(patientId)
  );
  const [careTeamModalVisible, setCareTeamModalVisible] = useState(false);
  const [actionsMenuVisible, setActionsMenuVisible] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [selectedHealthIssue, setSelectedHealthIssue] = useState<HealthIssue | null>(null);

  const handleCloseMedicationModal = () => {
    setSelectedMedication(null);
  };

  let patientBasicInfo: PatientRowData = {
    id: '',
    name: '',
    imageUrl: '',
    doctorsCount: 0,
    healthIssuesCount: 0,
  };

  let content: React.ReactNode = null;

  if (isLoading) {
    content = <Spinner />;
  } else if (isError) {
    content = (
      <Block>
        <Typography>Unable to fetch patient detail, please try again!</Typography>
      </Block>
    );
  } else if (patient) {
    patientBasicInfo = {
      id: patient?.id,
      doctorsCount: patient.doctors.length,
      healthIssuesCount: patient.health_issues.length,
      name: `${patient.first_name} ${patient?.last_name}`,
      imageUrl: patient?.patient_image_resized[3].image_url,
    };
    content = (
      <ScrollView pH="xxxl" pB="7xl" refreshing={isRefetching} onRefresh={refetch}>
        {patient.request_exist ? (
          <RequestCard
            request={{
              ...patient.patient_request,
              patient: {
                ...patient,
                total_doctors: patientBasicInfo.doctorsCount,
                total_health_issues: patientBasicInfo.healthIssuesCount,
              },
            }}
          />
        ) : (
          <PatientRow
            doctorsCount={patient.doctors?.length}
            healthIssuesCount={patient.health_issues.length}
            name={`${patient.first_name} ${patient.last_name}`}
            imageUrl={patient.patient_image_resized[3].image_url}
          />
        )}

        <DoctorNotes
          mT="xxxl"
          patient={patientBasicInfo}
          healthIssues={patient.health_issues}
          doctorNotes={patient.general_notes}
          hasSentRequest={patient.request_exist}
        />

        <Medications
          mT="xxxl"
          hasSentRequest={patient.request_exist}
          patient={patientBasicInfo}
          medications={patient.medications}
          onMedicationPress={setSelectedMedication}
        />

        <HealthIssues
          mT="xxxl"
          patient={patientBasicInfo}
          healthIssues={patient.health_issues.filter(
            (healthIssue) => healthIssue.status !== 'DELETED'
          )}
          hasSentRequest={patient.request_exist}
          onHealthIssuePress={setSelectedHealthIssue}
        />

        <Doctors
          mT="xxxl"
          doctors={patient.doctors.filter((doctor) => doctor.id !== auth.doctor?.id)}
          patient={patientBasicInfo}
          currentPlan={patient.current_plan}
          hasSentRequest={patient.request_exist}
        />
      </ScrollView>
    );
  }

  return (
    <Block flex1>
      <StatusBar barStyle="light-content" />

      <Modal visible={actionsMenuVisible} onClose={setActionsMenuVisible}>
        <RemovePatient patient={patientBasicInfo} closeModal={setActionsMenuVisible} />
      </Modal>

      <Modal visible={!!selectedMedication} onClose={handleCloseMedicationModal}>
        {selectedMedication && (
          <MedicationActions
            patient={patientBasicInfo}
            medication={selectedMedication}
            closeModal={handleCloseMedicationModal}
          />
        )}
      </Modal>

      <Modal visible={!!selectedHealthIssue} onClose={() => setSelectedHealthIssue(null)}>
        {selectedHealthIssue && (
          <HealthIssueActions
            patient={patientBasicInfo}
            healthIssue={selectedHealthIssue}
            closeModal={() => setSelectedHealthIssue(null)}
          />
        )}
      </Modal>

      <Modal visible={careTeamModalVisible} onClose={setCareTeamModalVisible}>
        {patient?.doctors && (
          <MessageCareTeam
            patient={patient as any}
            doctors={patient?.doctors.filter((doctor) => doctor.id !== auth.doctor?.id)}
            closeModal={setCareTeamModalVisible}
          />
        )}
      </Modal>

      <Block flex1>
        <DefaultNavigationBar
          title="Patient"
          align="center"
          flexDirection="row"
          justify="space-between"
          asideContent={
            <Block onPress={() => setActionsMenuVisible(true)}>
              <ThreeDotsVertical />
            </Block>
          }
        />
        {content}
      </Block>

      {patient && patient.doctors?.length >= 1 && (
        <Block absolute left={0} bottom={10} justify="center" align="center" width="100%">
          <Button
            pV="xl"
            icon="conversation"
            style={{ width: '75%' }}
            title="Message Care Team"
            onPress={() => setCareTeamModalVisible(true)}
          />
        </Block>
      )}
    </Block>
  );
};

export default PatientDetailScreen;
