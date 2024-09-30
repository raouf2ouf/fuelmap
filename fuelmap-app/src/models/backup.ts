import { Hex } from "./hex";
import { Task } from "./task/task";
import { Territory } from "./territory";

export interface TaskChange {
  id: string;
  changes: Partial<Task>;
}

export interface HexChange {
  id: number;
  changes: Partial<Hex>;
}

export interface BackupAction {
  tasksChange?: TaskChange[] | undefined;
  tasksDelete?: string[] | undefined;
  tasksAdd?: Task[] | undefined;
  hexesChange?: HexChange[] | undefined;
  territories?: Territory[] | undefined;
}

export interface BackupStep {
  rollback: BackupAction;
  rollforward: BackupAction;
}
