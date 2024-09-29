import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Track } from 'react-native-track-player';

interface TrackState {
  currentTrack: Track | null;
}

const initialState: TrackState = {
  currentTrack: null,
};

const trackSlice = createSlice({
  name: 'track',
  initialState,
  reducers: {
    setCurrentTrack(state, action: PayloadAction<Track>) {
      state.currentTrack = action.payload;
    },
  },
});

export const { setCurrentTrack } = trackSlice.actions;

export default trackSlice;
