import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

import Block, { BlockProps } from '@components/Block/Block';
import CheckIcon from '@components/Icons/CheckIcon';
import ClearIcon from '@components/Icons/ClearIcon';
import CloseIcon from '@components/Icons/CloseIcon';
import MicroPhoneIcon from '@components/Icons/MicroPhoneIcon';
import PauseIcon from '@components/Icons/PauseIcon';
import PlayIcon from '@components/Icons/PlayIcon';
import ProgressBar from '@components/ProgressBar/ProgressBar';
import Typography from '@components/Typography/Typography';
import toast from '@core/lib/toast';
import { ThemeColor } from '@core/styles/theme';
import { getDurationFormatted } from '@core/utils/common';
import { logError } from '@core/utils/logger';
import { Sound } from 'expo-av/build/Audio';

export interface Record {
  sound: Audio.Sound;
  duration: number;
  file: string;
}

interface AudioRecorderProps extends BlockProps {
  recording: Audio.Recording | null;
  onStartRecoding?: () => void;
  onCancelRecording?: () => void;
  onRecordComplete: (record: Record | null) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = forwardRef((props, ref) => {
  const { onRecordComplete, onStartRecoding, onCancelRecording, ...restProps } = props;

  const [isRecording, setIsRecording] = useState(false);
  const [record, setRecord] = useState<Record | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  // expo-av won't allow to play a sound twice, instead we have to use replyAsync method to play it again so we are tracking if the sound has been played once or not
  const [playedOnce, setPlayedOnce] = useState(false);
  const [recording, setRecording] = useState(() => props.recording);

  const startRecording = async () => {
    try {
      onStartRecoding?.();
      setIsRecording(true);
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const res = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        (status) => {
          if (status.isRecording) {
            setRecord({
              ...record,
              file: record?.file as string,
              sound: record?.sound as Sound,
              duration: status.durationMillis,
            });
          }
        }
      );
      setRecording(res.recording);
    } catch (err) {
      toast.error('Error while recording audio, Please try again!');
      logError(err);
    } finally {
      setIsRecording(true);
    }
  };

  const resetRecorder = () => {
    setIsRecording(false);
    setRecord(null);
    setPlaying(false);
    setCurrentPosition(0);
    setPlayedOnce(false);
  };

  const stopRecording = async () => {
    try {
      await recording!.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      const { sound, status } = await recording?.createNewLoadedSoundAsync()!;
      setIsRecording(false);
      const uri = recording?.getURI();
      const fileExtension = uri?.split('.').pop();

      const destinationUri = `${FileSystem.documentDirectory}${Date.now()}.${fileExtension}`;
      await FileSystem.moveAsync({
        from: uri as string,
        to: destinationUri,
      });
      const record = {
        sound,
        file: destinationUri,
        duration: (status as any).durationMillis,
      };
      setRecord(record);
      onRecordComplete(record);
    } catch (error) {
      toast.error('Error while recording audio, Please try again!');
      logError(error);
    } finally {
      setIsRecording(false);
    }
  };

  const handleLeftActionButtonPress = async () => {
    if (record?.file) {
      if (playing) {
        await record.sound.pauseAsync();
        setPlaying(false);
      } else {
        setPlaying(true);
        if (playedOnce) {
          await record.sound.replayAsync();
        } else {
          setPlayedOnce(true);
          await record.sound.playAsync();
        }
        record.sound.setOnPlaybackStatusUpdate((status: any) => {
          setCurrentPosition(status.positionMillis);
          if (status.didJustFinish) {
            setCurrentPosition(0);
            setPlaying(false);
          }
        });
      }
    } else if (isRecording) {
      setIsRecording(false);
      setRecord(null);
      onCancelRecording?.();
      await recording!.stopAndUnloadAsync();
    } else {
      startRecording();
    }
  };

  const handleRightActionButtonPress = async () => {
    if (record?.file) {
      setCurrentPosition(0);
      setRecord(null);
      onCancelRecording?.();
      onRecordComplete(null);
      await record.sound.stopAsync();
    } else {
      stopRecording();
    }
  };

  useImperativeHandle(ref, () => ({
    startRecording: () => {
      startRecording();
    },
    resetRecorder: () => {
      resetRecorder();
    },
  }));

  let leftActionIcon: React.ReactNode = null;
  let leftActionBgColor: ThemeColor = 'white';

  if (record?.file) {
    if (playing) {
      leftActionIcon = <PauseIcon />;
    } else {
      leftActionIcon = <PlayIcon />;
    }
  } else if (isRecording) {
    leftActionIcon = <CloseIcon />;
  } else {
    leftActionBgColor = 'mainBlue';
    leftActionIcon = <MicroPhoneIcon />;
  }

  return (
    <Block
      pH="xs"
      pV="xs"
      rounded="xl"
      align="center"
      flexDirection="row"
      bgColor="lightest2"
      {...restProps}>
      <Block
        pH="lg"
        pV="lg"
        rounded="xl"
        align="center"
        justify="center"
        onPress={handleLeftActionButtonPress}
        bgColor={leftActionBgColor}>
        {leftActionIcon}
      </Block>

      <Block flex1>
        {record?.file ? (
          <Block pL="xl" flexDirection="row" align="center">
            <ProgressBar flex1 currentValue={currentPosition / record.duration} />
            <Typography mL="xl">{getDurationFormatted(record?.duration)}</Typography>
          </Block>
        ) : isRecording ? (
          <Block pH="md" flexDirection="row" align="center" justify="space-between" width="100%">
            <Typography>Recording...</Typography>
            <Typography>{getDurationFormatted(record?.duration as number)}</Typography>
          </Block>
        ) : (
          <Typography color="dark" variation="description1" pH="md">
            Record an audio explaining it
          </Typography>
        )}
      </Block>

      {(isRecording || record?.file) && (
        <Block
          pH="lg"
          pV="lg"
          rounded="xl"
          align="center"
          justify="center"
          onPress={handleRightActionButtonPress}
          bgColor={record?.file ? 'transparent' : 'mainBlue'}>
          {record?.file ? <ClearIcon /> : <CheckIcon fill="white" />}
        </Block>
      )}
    </Block>
  );
});

export default AudioRecorder;
