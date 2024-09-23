import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { DeflatedGalaxy, Galaxy } from "../types/galaxy";
import type { RootState } from "./store";
import { getAllLocalGalaxies, saveGalaxyLocally } from "../api/local";
import { inflateTasks } from "./tasks.slice";
import { deflateTask } from "./tasks.utils";

// API
export const saveCurrentGalaxyLocally = createAsyncThunk(
  "galaxies/saveLocally",
  async (_, thunkAPI): Promise<DeflatedGalaxy | undefined> => {
    const state = thunkAPI.getState() as RootState;
    const currentGalaxyId = state.galaxies.currentGalaxyId;
    if (!currentGalaxyId) return;
    const currentGalaxy = state.galaxies.entities[currentGalaxyId];
    const tasks = Object.values(state.tasks.entities)
      .filter((t) => t.galaxyId == currentGalaxyId)
      .map((t) => deflateTask(t));
    const galaxyData: DeflatedGalaxy = { ...currentGalaxy, tasks };
    galaxyData.date = Date.now();
    await saveGalaxyLocally(galaxyData);
    return galaxyData;
  },
);

export const loadLocalGalaxies = createAsyncThunk(
  "galaxies/loadLocalGalaxies",
  async (
    galaxyId: string | undefined,
    thunkAPI,
  ): Promise<{ galaxies: Galaxy[]; galaxyId: string | undefined }> => {
    const galaxies = await getAllLocalGalaxies();
    if (galaxyId) {
      const exists = galaxies.find((g) => g.id == galaxyId);
      if (exists) {
        thunkAPI.dispatch(
          inflateTasks({ tasks: exists.tasks, galaxyId: exists.id }),
        );
      }
    }
    return {
      galaxies: galaxies.map((g) => ({
        ...g,
        needToSave: false,
      })),
      galaxyId,
    };
  },
);

export const loadGalaxy = createAsyncThunk(
  "galaxies/loadGalaxy",
  async (galaxy: DeflatedGalaxy, thunkAPI): Promise<DeflatedGalaxy> => {
    if (galaxy.tasks && galaxy.tasks.length > 0) {
      await thunkAPI.dispatch(
        inflateTasks({ tasks: galaxy.tasks, galaxyId: galaxy.id }),
      );
    }
    return galaxy;
  },
);

export const setCurrentGalaxy = createAsyncThunk(
  "galaxies/setCurrentGalaxy",
  async (
    galaxyId: string | undefined,
    thunkAPI,
  ): Promise<string | undefined> => {
    if (galaxyId) {
      const state = thunkAPI.getState() as RootState;
      const galaxy = state.galaxies.entities[galaxyId];
      await thunkAPI.dispatch(
        inflateTasks({ tasks: galaxy?.tasks || [], galaxyId }),
      );
    }
    return galaxyId;
  },
);

// Adapter
const galaxiesAdapter = createEntityAdapter<Galaxy>({});

// Selectors
export const { selectAll: selectAllGalaxies, selectById: selectGalaxyById } =
  galaxiesAdapter.getSelectors((state: any) => state.galaxies);

export const selectCurrentGalaxy = createSelector(
  [selectAllGalaxies, (state) => state.galaxies.currentGalaxyId],
  (galaxies: Galaxy[], currentGalaxyId?: string) => {
    return galaxies.find((g) => g.id == currentGalaxyId);
  },
);

// Slice
type ExtraState = {
  currentGalaxyId?: string | undefined;
};
export const galaxiesSlice = createSlice({
  name: "galaxies",
  initialState: galaxiesAdapter.getInitialState<ExtraState>({}),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(saveCurrentGalaxyLocally.fulfilled, (state, action) => {
      if (action.payload) {
        galaxiesAdapter.upsertOne(state, {
          ...action.payload,
          needToSave: false,
        });
      }
    });
    builder.addCase(loadLocalGalaxies.fulfilled, (state, action) => {
      galaxiesAdapter.upsertMany(state, action.payload.galaxies);
      if (action.payload.galaxyId) {
        state.currentGalaxyId = action.payload.galaxyId;
      }
    });
    builder.addCase(loadGalaxy.fulfilled, (state, action) => {
      galaxiesAdapter.upsertOne(state, {
        ...action.payload,
        needToSave: false,
      });
      state.currentGalaxyId = action.payload.id;
    });
    builder.addCase(setCurrentGalaxy.fulfilled, (state, action) => {
      state.currentGalaxyId = action.payload;
    });
  },
});

export const {} = galaxiesSlice.actions;
export default galaxiesSlice.reducer;
