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
  generateIdForPosition,
  generateSiblingId,
  getAllChildren,
  getParentId,
  getTypeGivenId,
  morphTask,
  propagateChecked,
  propagateToggle,
} from "./tasks.utils";
import { backup } from "./backup.slice";
import { toast } from "react-toastify";
import { TooMany } from "./tasks.errors";

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

export const setEdit = createAsyncThunk(
  "tasks/setEdit",
  async (id: number | undefined, thunkAPI): Promise<number | undefined> => {
    await thunkAPI.dispatch(addTask());
    return id;
  },
);
export const addNewTask = createAsyncThunk(
  "tasks/addNewTask",
  async (
    data:
      | { addBeforeId?: number; addAfterId?: number; parentId?: number }
      | undefined,
    thunkAPI,
  ): Promise<Task> => {
    const state = thunkAPI.getState() as RootState;
    await thunkAPI.dispatch(addTask());

    let id: number = 0;
    if (!data) {
      const latestSectorTaskId = state.tasks.ids
        .filter((id) => getTypeGivenId(id) == TaskType.SECTOR)
        .sort((a, b) => a - b)
        .pop();
      if (latestSectorTaskId === undefined) {
        id = generateIdForPosition(undefined, 1);
      } else {
        id = generateSiblingId(latestSectorTaskId);
      }
    } else {
      const { addBeforeId, addAfterId, parentId } = data;
      if (addBeforeId) {
        id = addBeforeId;
      } else if (addAfterId) {
        id = generateSiblingId(addAfterId);
      } else if (parentId) {
        const siblings = state.tasks.ids.filter(
          (t) => getParentId(t) == parentId,
        ).length;
        id = generateIdForPosition(parentId, siblings + 1);
      }
    }
    const parentId = getParentId(id);
    const parent = state.tasks.entities[parentId || 0];
    return {
      id,
      name: "",
      description: "",
      galaxyId: state.galaxies.currentGalaxyId!,
      checked: parent?.checked ?? false,
      color: parent?.color ?? 0,
      closed: false,
      displayed: true,
    };
  },
);

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (
    _,
    thunkAPI,
  ): Promise<
    { rollforward: BackupAction; addedTaskId: number } | undefined
  > => {
    const state = thunkAPI.getState() as RootState;
    const newTask = state.tasks.newTask;
    if (!newTask || newTask.name.length == 0) return;

    const bkp: BackupStep = {
      rollback: { tasksChange: [], tasksAdd: [], tasksDelete: [] },
      rollforward: { tasksChange: [], tasksAdd: [], tasksDelete: [] },
    };

    const conflictingTask = state.tasks.entities[newTask.id];
    if (conflictingTask) {
    } else {
      bkp.rollback.tasksDelete?.push(newTask.id);
      bkp.rollforward.tasksAdd?.push({ ...newTask });
    }

    const parentId = getParentId(newTask.id);
    let parent: Task | null = null;
    if (parentId) parent = state.tasks.entities[parentId];
    // we need to make sure the parent should be visible
    if (parentId && parent && parent.closed) {
      thunkAPI.dispatch(toggleTask({ taskId: parentId, toggle: false }));
    }

    thunkAPI.dispatch(backup(bkp));

    return { rollforward: bkp.rollforward, addedTaskId: 0 };
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
    {
      previousId,
      newType,
      closestId,
    }: { previousId: number; newType: TaskType; closestId: number },
    thunkAPI,
  ): Promise<TaskChange[] | undefined> => {
    const state = thunkAPI.getState() as RootState;
    const task = state.tasks.entities[previousId];
    if (!task) return;
    const tasks = Object.values(state.tasks.entities);
    try {
      const bkpStep = morphTask(tasks, task, newType, closestId);
      if (bkpStep) {
        thunkAPI.dispatch(backup(bkpStep));
        toast.success("Task moved successfully!");
      } else {
        toast.error("Not a valid move: No possible parent.");
        return undefined;
      }
      return bkpStep?.rollforward.tasksChange;
    } catch (e) {
      if (e instanceof TooMany) {
        toast.error(`Not a valid move: ${e.message}`);
        return undefined;
      }
    }
  },
);

// Adapter
const tasksAdapter = createEntityAdapter<InflatedTask<TaskType>>({
  sortComparer: (a: Task, b: Task) => a.id - b.id,
});

// Selectors
export const { selectAll: selectAllTasks, selectById: selectTaskById } =
  tasksAdapter.getSelectors((state: any) => state.tasks);

export const selectAllCurrentGalaxyTasksIds = createSelector(
  [selectAllTasks, (state) => state.galaxies.currentGalaxyId],
  (tasks: Task[], currentGalaxyId: string): number[] => {
    return tasks
      .filter((t) => t.galaxyId == currentGalaxyId)
      .map((t) => t.id)
      .sort((a, b) => a - b);
  },
);

export const selectStatsOfCurrentGalaxy = createSelector(
  [selectAllTasks],
  (tasks: Task[]): number[] => {
    const stats: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
    for (const task of tasks) {
      const type = getTypeGivenId(task.id);
      stats[type * 2] += 1;
      if (task.checked) {
        stats[type * 2 + 1] += 1;
      }
    }
    return stats;
  },
);

export const selectDirectChildrenOfTask = createSelector(
  [selectAllTasks, (state, taskId: number) => taskId],
  (tasks: Task[], taskId: number) => {
    return tasks.filter((t) => getParentId(t.id) == taskId);
  },
);

export const selectStatsOfTask = createSelector(
  [selectDirectChildrenOfTask],
  (tasks: Task[]) => {
    const stats: number[] = [0, 0];
    for (const task of tasks) {
      stats[0]++;
      if (task.checked) stats[1]++;
    }
    return stats;
  },
);

// State
type ExtraState = {
  edit?: number | undefined;
  newTask?: Task | undefined;
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
  },
  extraReducers: (builder) => {
    builder.addCase(inflateTasks.fulfilled, (state, action) => {
      tasksAdapter.setAll(state, action.payload);
      state.newTask = undefined;
      state.edit = undefined;
      state.focusId =
        action.payload.length > 0
          ? action.payload[0].id.toString()
          : "add-task";
    });

    builder.addCase(setEdit.fulfilled, (state, action) => {
      state.edit = action.payload;
    });

    builder.addCase(addNewTask.fulfilled, (state, action) => {
      const task = action.payload;
      state.newTask = task;
      state.edit = -1;
      state.focusId = `new-${task.id}`;
    });

    builder.addCase(addTask.fulfilled, (state, { payload }) => {
      if (payload) {
        const { rollforward, addedTaskId } = payload;
        if (rollforward.tasksDelete)
          tasksAdapter.removeMany(state, rollforward.tasksDelete);
        if (rollforward.tasksChange)
          tasksAdapter.updateMany(state, rollforward.tasksChange);
        if (rollforward.tasksAdd) {
          tasksAdapter.addMany(state, rollforward.tasksAdd);
        }
        state.focusId = addedTaskId.toString();
      }
      state.edit = undefined;
      state.newTask = undefined;
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
  setFocusIndex,
  setFocusIndexUp,
  setFocusIndexDown,
} = tasksSlice.actions;

export default tasksSlice.reducer;
