// createEntityAdapter<InflatedTask<TaskType>>

import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { TaskType } from "../types/enums";
import { DeflatedTask, InflatedTask, Task } from "../types/task";
import { BackupAction, BackupStep, TaskChange } from "../types/backup";
import type { RootState } from "./store";
import {
  getAllChildren,
  getParentId,
  getTypeGivenId,
  propagateChecked,
  propagateToggle,
} from "./tasks.utils";
import { backup } from "./backup.slice";

// API
export const inflateTasks = createAsyncThunk(
  "tasks/inflateTasks",
  async (
    {
      tasks,
      galaxyId,
    }: {
      tasks: DeflatedTask<TaskType>[];
      galaxyId: string;
    },
    thunkAPI,
  ) => {
    const inflatedTasks: InflatedTask<TaskType>[] = tasks
      .map((t) => ({
        ...t,
        galaxyId,
        progress: 0,
        closed: false,
        displayed: true,
        color: 0,
      }))
      .sort((a, b) => a.id - b.id);
    // propagate colors
    let color = 0;
    for (let i = 0; i < inflatedTasks.length; ++i) {
      const task = inflatedTasks[i];
      const type = getTypeGivenId(task.id);
      if (type === TaskType.SECTOR) {
        color = task.color;
      }
      task.color = color;
    }

    return inflatedTasks;
  },
);

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (id: number, thunkAPI): Promise<InflatedTask<TaskType>> => {
    const state = thunkAPI.getState() as RootState;
    const parentId = getParentId(id);
    let parent: Task | null = null;
    if (parentId) parent = state.tasks.entities[parentId];
    const currentGalaxyId = state.galaxies.currentGalaxyId!;
    const task: InflatedTask<TaskType> = {
      galaxyId: currentGalaxyId,
      id,
      name: "",
      description: "",
      color: parent?.color ?? 0,
      checked: false,
      closed: false,
      displayed: true,
    };

    // we need to make sure the parent should be visible
    if (parentId && parent && parent.closed) {
      thunkAPI.dispatch(toggleTask({ taskId: parentId, toggle: false }));
    }

    return task;
  },
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: number, thunkAPI): Promise<BackupAction> => {
    const bkp: BackupStep = {
      rollback: { tasksChange: [], tasksAdd: [], tasksDelete: [] },
      rollforward: { tasksChange: [], tasksAdd: [], tasksDelete: [] },
    };

    const state = thunkAPI.getState() as RootState;
    const task = state.tasks.entities[taskId];
    if (task) {
      bkp.rollback.tasksAdd!.push({ ...task });
      bkp.rollforward.tasksDelete!.push(task.id);
      const tasks = Object.values(state.tasks.entities);
      const allChildren = getAllChildren(task.id, tasks);
      for (const child of allChildren) {
        bkp.rollback.tasksAdd!.push({ ...child });
        bkp.rollback.tasksDelete!.push(child.id);
      }
    }
    thunkAPI.dispatch(backup(bkp));
    return bkp.rollforward;
  },
);

export const toggleChecked = createAsyncThunk(
  "tasks/toggleChecked",
  async (
    { id, toggle }: { id: number; toggle?: boolean },
    thunkAPI,
  ): Promise<TaskChange[] | undefined> => {
    const state = thunkAPI.getState() as RootState;
    const tasks = Object.values(state.tasks.entities);
    const changes = propagateChecked(state.tasks.entities[id], tasks, toggle);
    if (changes) {
      const bkp: BackupStep = {
        rollback: { tasksChange: changes?.rollback },
        rollforward: { tasksChange: changes?.rollforward },
      };
      thunkAPI.dispatch(backup(bkp));
      return bkp.rollforward.tasksChange;
    }
  },
);

export const moveTask = createAsyncThunk(
  "tasks/moveTask",
  async (
    { previousId, newId }: { previousId: number; newId: number },
    thunkAPI,
  ) => {
    const state = thunkAPI.getState() as RootState;
    const task = state.tasks.entities[previousId];
    if (!task) return;
    const tasks = Object.values(state.tasks.entities);
    const bkpStep = morphTask(tasks, task, previousId, newId);
  },
);

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
      const tasks = Object.values(state.entities);
      task.closed =
        payload.toggle === undefined ? !task.closed : payload.toggle;
      const changes = propagateToggle(task.id, tasks);
      changes.push({ id: task.id, changes: { displayed: task.displayed } });
      tasksAdapter.updateMany(state, changes);
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
  extraReducers: (builder) => {
    builder.addCase(inflateTasks.fulfilled, (state, action) => {
      tasksAdapter.setAll(state, action.payload);
      state.focusId =
        action.payload.length > 0
          ? action.payload[0].id.toString()
          : "add-task";
    });

    builder.addCase(addTask.fulfilled, (state, action) => {
      const task = action.payload;
      if (state.newId && state.newId != task.id) {
        const newTask = state.entities[state.newId];
        if (newTask && newTask.name.length == 0) {
          tasksAdapter.removeOne(state, newTask.id);
        }
      }
      tasksAdapter.addOne(state, task);
      state.edit = task.id;
      state.newId = task.id;
      state.focusId = task.id.toString();
    });

    builder.addCase(
      deleteTask.fulfilled,
      (state, { payload }: { payload: BackupAction }) => {
        if (payload.tasksDelete)
          tasksAdapter.removeMany(state, payload.tasksDelete);
        if (payload.tasksChange)
          tasksAdapter.updateMany(state, payload.tasksChange);
      },
    );

    builder.addCase(
      toggleChecked.fulfilled,
      (state, { payload }: { payload: TaskChange[] | undefined }) => {
        if (payload) tasksAdapter.updateMany(state, payload);
      },
    );
  },
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
