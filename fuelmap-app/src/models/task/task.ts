import type { Moon } from "./moon";
import type { Planet } from "./planet";
import type { System } from "./system";
import type { Sector } from "./sector";

import { TaskColor, TaskType } from "./task.enums";

export interface CommentData {
  content: string;
  time: number;
}

export interface BasicTaskData {
  // Basic properties
  id: string;
  blockchainId?: number | undefined;
  name: string;
  description: string;
  type: TaskType;
  progress?: number | undefined;

  checked: boolean;
  closed: boolean;
  // encrypted: boolean;
  // priority: number;
  labels: string[];
  comments: CommentData[];
  content: string;
}

export interface TaskDataExport extends BasicTaskData {
  children: BasicTaskData[];
}

export interface TaskData extends BasicTaskData {
  color: TaskColor;
  galaxyId: string;
  parent?: string | undefined;
  displayed: boolean;
  index: number;
}

export function isNew(task: Task): boolean {
  return task.index % 1 !== 0;
}

export type Task = Moon | Planet | System | Sector;
