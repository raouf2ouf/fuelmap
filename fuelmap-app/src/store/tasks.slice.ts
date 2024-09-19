// createEntityAdapter<InflatedTask<TaskType>>

import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { TaskType } from "../types/enums";
import { InflatedTask, Task } from "../types/task";
import { BackupAction } from "../types/backup";

// API

// Adapter
const tasksAdapter = createEntityAdapter<InflatedTask<TaskType>>({
  sortComparer: (a: Task, b: Task) => a.id - b.id,
});

// Selectors
export const { selectAll: selectAllTasks, selectById: selectTasksById } =
  tasksAdapter.getSelectors((state: any) => state.tasks);

export const selectAllCurrentGalaxyTasksIds = createSelector(
  [selectAllTasks, (state) => state.galaxies.currentGalaxyId],
  (tasks: Task[], currentGalaxyId: string): Task[] => {
    return tasks.filter((t) => t.galaxyId == currentGalaxyId);
  },
);

// State
type ExtraState = {
  edit?: number | undefined;
  newId?: number | undefined;
  focusId: string;
};
export const tasksSlice = createSlice({
  name: "tasks",
  initialState: tasksAdapter.getInitialState<ExtraState>({
    focusId: "add-task",
  }),
  reducers: {
    setFocusIndexUp: (state) => {},
    setFocusIndexDown: (state) => {},
    setFocusIndex: (state, { payload }: { payload: string }) => {
      state.focusId = payload;
    },
    setNewId: (state, { payload }: { payload: number | undefined }) => {
      state.newId = payload;
    },
    toggleTask: (
      state,
      { payload }: { payload: { taskId: number; toggle?: boolean } },
    ) => {
      const task = state.entities[payload.taskId];
      if (!task) return;
    },
    updateTasks: (state, { payload }: { payload: BackupAction }) => {
      if (payload.tasksAdd) tasksAdapter.upsertMany(state, payload.tasksAdd);
      if (payload.tasksDelete)
        tasksAdapter.removeMany(state, payload.tasksDelete);
      if (payload.tasksChange)
        tasksAdapter.updateMany(state, payload.tasksChange);
    },
    setEdit: (state, { payload }: { payload: number | undefined }) => {
      state.edit = payload;
      if (state.newId && state.newId !== payload) {
        const newTask = state.entities[state.newId];
        if (newTask && newTask.name.length == 0) {
          tasksAdapter.removeOne(state, newTask.id);
        }
        state.newId = undefined;
      }
    },
  },
  extraReducers: (builder) => {},
});

export const {
  toggleTask,
  updateTasks,
  setEdit,
  setNewId,
  setFocusIndex,
  setFocusIndexUp,
  setFocusIndexDown,
} = tasksSlice.actions;

export default tasksSlice.reducer;
