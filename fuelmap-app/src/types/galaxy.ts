import { TaskType } from "./enums";
import { DeflatedTask } from "./task";

export type DeflatedGalaxy = {
  id: string;
  name: string;
  description: string;
  date: number | undefined;
  localdate?: number | undefined;
  tasks: DeflatedTask<TaskType>[];
};
export type Galaxy = DeflatedGalaxy & {
  needToSave: boolean;
};
