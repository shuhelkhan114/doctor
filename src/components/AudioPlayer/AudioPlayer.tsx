import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image } from 'react-native';

import { Audio } from 'expo-av';
import TrackPlayer, { State, usePlaybackState, useProgress } from 'react-native-track-player';

import { getDurationFormatted } from '@core/utils/common';
import { setCurrentTrack } from '@store/slices/trackSlice';
import { useAppDispatch, useAppSelector } from '@store/store';

import Block from '@components/Block/Block';
import ProgressBar from '@components/ProgressBar/ProgressBar';
import Typography from '@components/Typography/Typography';
import { logError } from '@core/utils/logger';
import useAppTheme from '@hooks/useTheme';

interface AudioPlayerProps {
  url: string;
  title: string;
  theme?: 'dark' | 'light';
}

const AudioPlayer: React.FC<AudioPlayerProps> = (props) => {
  const { url, title, theme = 'dark' } = props;
  const dispatch = useAppDispatch();
  const appTheme = useAppTheme();
  const track = useAppSelector((state) => state.track);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [duration, setDuration] = useState(0);

  const state = usePlaybackState();
  const progress = useProgress();

  useEffect(() => {
    if (track.currentTrack?.url === url) {
      switch (state) {
        case State.Playing:
          setPlaying(true);
          setBuffering(false);
          break;
        case State.Paused:
          setPlaying(false);
          break;
        case State.Connecting:
        case State.Buffering:
          setBuffering(true);
          break;
        case State.Stopped:
          setPlaying(false);
      }
    } else {
      setPlaying(false);
      setBuffering(false);
    }
  }, [state]);

  useEffect(() => {
    const getDuration = async () => {
      const { sound: soundX } = await Audio.Sound.createAsync({
        uri: url,
      });
      const status = await soundX.getStatusAsync();
      setDuration((status as any).durationMillis);
    };
    getDuration();
  }, []);

  const handlePlay = async () => {
    try {
      if (track.currentTrack?.url !== url) {
        dispatch(setCurrentTrack({ url, title }));
        await TrackPlayer.reset();
        await TrackPlayer.add({ url, title });
        await TrackPlayer.play();
      } else {
        const currentState = await TrackPlayer.getState();
        if (currentState === State.Playing) {
          await TrackPlayer.pause();
          setPlaying(false);
        } else if (currentState === State.Paused) {
          await TrackPlayer.seekTo(0);
          await TrackPlayer.play();
          setPlaying(true);
        } else {
          // TODO: Add Doc Hello artwork
          await TrackPlayer.add({ url, title });
          await TrackPlayer.play();
        }
      }
    } catch (error) {
      logError(error);
    }
  };

  return (
    <Block flexDirection="row" justify="space-between" align="center" mR="md">
      <Block mR="md" onPress={handlePlay}>
        {buffering ? (
          <Block justify="center" align="center" style={{ height: 40, width: 40 }}>
            <ActivityIndicator />
          </Block>
        ) : (
          <Image
            source={playing ? require('@assets/icons/pause.png') : require('@assets/play.png')}
            style={{
              height: 40,
              width: 40,
              tintColor: playing
                ? theme === 'light'
                  ? appTheme.colors.mainBlue
                  : 'white'
                : undefined,
            }}
          />
        )}
      </Block>

      <ProgressBar
        flex1
        theme={theme}
        currentValue={track.currentTrack?.url === url ? progress.position / progress.duration : 0}
      />

      <Typography color={theme === 'dark' ? 'white' : 'dark'} mH="md">
        {getDurationFormatted(duration)}
      </Typography>
    </Block>
  );
};

export default AudioPlayer;
