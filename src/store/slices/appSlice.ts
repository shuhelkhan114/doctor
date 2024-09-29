import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    isChatScreen: false,
  },
  reducers: {
    setIsChatScreen: (state, action) => {
      state.isChatScreen = action.payload;
    },
  },
});

export const { setIsChatScreen } = appSlice.actions;
export default appSlice;
