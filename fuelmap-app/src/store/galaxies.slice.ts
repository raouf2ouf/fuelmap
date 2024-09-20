import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { Galaxy, GalaxyWithTasks } from "../types/galaxy";
import type { RootState } from "./store";
import { deflateTask } from "../types/task";
import { getAllLocalGalaxies, saveGalaxyLocally } from "../api/local";

// API
export const saveCurrentGalaxyLocally = createAsyncThunk(
  "galaxies/saveLocally",
  async (_, thunkAPI): Promise<Galaxy | undefined> => {
    const state = thunkAPI.getState() as RootState;
    const currentGalaxyId = state.galaxies.currentGalaxyId;
    if (!currentGalaxyId) return;
    const currentGalaxy = state.galaxies.entities[currentGalaxyId];
    const tasks = Object.values(state.tasks.entities)
      .filter((t) => t.galaxyId == currentGalaxyId)
      .map((t) => deflateTask(t));
    const galaxyData: GalaxyWithTasks = { ...currentGalaxy, tasks };
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
        id: g.id,
        name: g.name,
        date: g.date,
        description: g.description,
        blockchainDate: g.blockchainDate,
      })),
      galaxyId,
    };
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
  currentGalaxyId?: string;
};
export const galaxiesSlice = createSlice({
  name: "galaxies",
  initialState: galaxiesAdapter.getInitialState<ExtraState>({}),
  reducers: {},
});

export const {} = galaxiesSlice.actions;
export default galaxiesSlice.reducer;
