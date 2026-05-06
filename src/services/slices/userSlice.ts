import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

type UserSliceState = {
  userId: string | null;
};

const initialState: UserSliceState = {
  userId: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    clearUser: state => {
      state.userId = null;
    },
  },
});

export const {setUserId, clearUser} = userSlice.actions;
export default userSlice.reducer;
