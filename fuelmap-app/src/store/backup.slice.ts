import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { BackupStep } from "../types/backup";

const MAX_BKP_LENGTH = 9;

// API
export const rollback = createAsyncThunk(
  "backup/rollback",
  async (
    _,
    thunkAPI,
  ): Promise<{ bkps: BackupStep[]; bkpsForward: BackupStep[] } | undefined> => {
    const backup = (thunkAPI.getState() as RootState).backup;
    const bkps = [...backup.bkps];
    const bkpsForward = [...backup.bkpsForward];

    if (bkps.length == 0) return;

    const step = bkps.pop()!;
    bkpsForward.push(step);

    // TODO
    return { bkps, bkpsForward };
  },
);

export const rollforward = createAsyncThunk(
  "backup/rollforward",
  async (
    _,
    thunkAPI,
  ): Promise<{ bkps: BackupStep[]; bkpsForward: BackupStep[] } | undefined> => {
    const backup = (thunkAPI.getState() as RootState).backup;
    const bkps = [...backup.bkps];
    const bkpsForward = [...backup.bkpsForward];

    if (bkpsForward.length == 0) return;

    const step = bkpsForward.pop()!;
    bkps.push(step);

    // TODO
    return { bkps, bkpsForward };
  },
);

export const backup = createAsyncThunk(
  "backup/backup",
  async (bkp: BackupStep, thunkAPI): Promise<BackupStep> => {
    return bkp;
  },
);

// Slice
type ExtraState = {
  bkps: BackupStep[];
  bkpsForward: BackupStep[];
};
export const backupSlice = createSlice({
  name: "backup",
  initialState: {
    bkps: [],
    bkpsForward: [],
  } as ExtraState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(rollback.fulfilled, (state, action) => {
      if (action.payload) {
        state.bkps = action.payload.bkps;
        state.bkpsForward = action.payload.bkpsForward;
      }
    });
    builder.addCase(rollforward.fulfilled, (state, action) => {
      if (action.payload) {
        state.bkps = action.payload.bkps;
        state.bkpsForward = action.payload.bkpsForward;
      }
    });
    builder.addCase(
      backup.fulfilled,
      (state, { payload }: { payload: BackupStep }) => {
        const bkps = [...state.bkps];
        if (state.bkps.length >= MAX_BKP_LENGTH) {
          bkps.shift();
        }
        bkps.push(payload);
        state.bkps = bkps;
        state.bkpsForward = [];
      },
    );
  },
});

export const {} = backupSlice.actions;
export default backupSlice.reducer;
