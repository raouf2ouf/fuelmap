import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { Galaxy } from "../types/galaxy";

// API
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
