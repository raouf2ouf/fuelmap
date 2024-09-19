import { Task } from "./task";

export type TaskChange = {
  id: number;
  changes: Partial<Task>;
};

export type BackupAction = {
  tasksChange?: TaskChange[];
  tasksDelete?: number[];
  tasksAdd?: Task[];
};

export type BackupStep = {
  rollback: BackupAction;
  rollforward: BackupAction;
};
