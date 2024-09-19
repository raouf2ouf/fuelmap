import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { Galaxy } from "../types/galaxy";
import type { RootState } from "./store";
import { deflateTask } from "../types/task";

// API
export const saveCurrentGalaxyLocally = createAsyncThunk(
  "galaxies/saveLocally", async(_, thunkAPI): Promise<void> => {
    const state = thunkAPI.getState() as RootState
    const currentGalaxyId = state.galaxies.currentGalaxyId
    if(!currentGalaxyId) return
    const currentGalaxy = state.galaxies.entities[currentGalaxyId]
    const tasks = Object.values(state.tasks.entities).filter((t) => t.galaxyId == currentGalaxyId).map(t => deflateTask(t))

  }
)
export const loadLocalGalaxies = createAsyncThunk(
  "galaxies/loadLocalGalaxies",
  async (
    _, thunkAPI
  ): Promise<Galaxy[]> {

  }
)

// Adapter
const galaxiesAdapter = createEntityAdapter<Galaxy>({});

// Selectors
export const { selectAll: selectAllGalaxies, selectById: selectGalaxyById } =
  galaxiesAdapter.getSelectors((state: any) => state.galaxies);

export const selectCurrentGalaxy = createSelector(
  [selectAllGalaxies, (state) => state.galaxies.currentGalaxyId],
  (galaxies: Galaxy[], currentGalaxyId?: string) => {
    return galaxies.find((g) => g.id == currentGalaxyId);
  }
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
