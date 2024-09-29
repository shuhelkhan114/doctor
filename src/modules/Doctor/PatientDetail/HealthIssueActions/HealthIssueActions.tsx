import Block from '@components/Block/Block';
import Button from '@components/Button/Button';
import Chip from '@components/Chip/Chip';
import ErrorText from '@components/ErrorText/ErrorText';
import PencilIcon from '@components/Icons/PencilIcon';
import TrashIcon from '@components/Icons/TrashIcon';
import Modal from '@components/Modal/Modal';
import Typography from '@components/Typography/Typography';
import toast from '@core/lib/toast';
import API from '@core/services';
import { PatientRowData } from '@typings/common';
import { HealthIssue } from '@typings/model/healthIssue';
import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useMutation, useQueryClient } from 'react-query';

interface HealthIssueActionsProps {
  patient: PatientRowData;
  healthIssue: HealthIssue;
  closeModal?: (visible: false) => void;
}

const HealthIssueActions: React.FC<HealthIssueActionsProps> = (props) => {
  const { patient, healthIssue, closeModal } = props;

  const [editModalShown, setEditModalShow] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState(healthIssue.severity);

  const queryClient = useQueryClient();

  const {
    isLoading: removingHealthIssue,
    error: removingHealthIssueError,
    mutate: removeHealthIssue,
  } = useMutation(API.doctor.healthIssue.removeHealthIssue, {
    onSuccess() {
      toast.success(`${healthIssue.name} has been removed`);
      queryClient.invalidateQueries(['doctor/patient', patient.id]);
      closeModal?.(false);
    },
    onError() {
      toast.error('Unable to remove health issue, please try again!');
    },
  });

  const {
    isLoading: updatingHealthIssue,
    error: updatingHealthIssueError,
    mutate: updateHealthIssue,
  } = useMutation(API.doctor.healthIssue.updateHealthIssue, {
    onSuccess() {
      setEditModalShow(false);
      toast.success(`${healthIssue.name} has been updated!`);
      queryClient.invalidateQueries(['doctor/patient', patient.id]);
      closeModal?.(false);
    },
    onError() {
      setEditModalShow(false);
      toast.error('Unable to update health issue, please try again!');
    },
  });

  const handleRemoveHealthIssue = () => {
    if (!removingHealthIssue) {
      removeHealthIssue({
        healthIssueId: healthIssue.id,
        patientId: patient.id,
      });
    }
  };

  const handleUpdateHealthIssue = () => {
    if (!updatingHealthIssue) {
      updateHealthIssue({
        healthIssueId: healthIssue.id,
        patientId: patient.id,
        severity: selectedSeverity,
      });
    }
  };

  return (
    <Block>
      <Typography variation="title1">{healthIssue.name}</Typography>

      <Modal visible={editModalShown} onClose={() => setEditModalShow(false)}>
        <Block>
          <Typography variation="title1" mB="xl">
            {healthIssue.name}
          </Typography>

          <Block flexDirection="row" mT="xxxl">
            {['High', 'Medium', 'Low'].map((severity) => (
              <Chip
                mR="md"
                key={severity}
                text={severity}
                selected={severity === selectedSeverity}
                onPress={() => setSelectedSeverity(severity)}
              />
            ))}
          </Block>

          <Button
            mT="7xl"
            title="Update Health Issue"
            loading={updatingHealthIssue}
            onPress={handleUpdateHealthIssue}
            disabled={selectedSeverity === healthIssue.severity}
          />
        </Block>
      </Modal>

      <Block mT="xxxl">
        <ErrorText error={removingHealthIssueError || updatingHealthIssueError} />

        <Block flexDirection="row" pV="xl" bBW={1} bC="lightest" onPress={handleRemoveHealthIssue}>
          <TrashIcon />
          <Typography mL="md" variation="title3" color="negativeAction" mR="auto">
            Remove Health issue
          </Typography>
          {removingHealthIssue && <ActivityIndicator />}
        </Block>

        <Block flexDirection="row" pV="xl" onPress={() => setEditModalShow(true)}>
          <PencilIcon />
          <Typography mL="md" variation="title3">
            Edit Health issue
          </Typography>
        </Block>
      </Block>
    </Block>
  );
};

export default HealthIssueActions;
