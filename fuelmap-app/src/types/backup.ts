import { Task } from "./task";

export type TaskChange = {
  id: string;
  changes: Partial<Task>;
};

export type BackupAction = {
  tasksChange?: TaskChange[];
  tasksDelete?: string[];
  tasksAdd?: Task[];
};

export type BackupStep = {
  rollback: BackupAction;
  rollforward: BackupAction;
};
