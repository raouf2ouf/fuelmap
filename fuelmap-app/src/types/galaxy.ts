import { TaskType } from "./enums";
import { DeflatedTask } from "./task";

export type Galaxy = {
  id: string;
  name: string;
  description: string;
  date: number | undefined;
  blockchainDate: number | undefined;
};

export type GalaxyWithTasks = Galaxy & {
  tasks: DeflatedTask<TaskType>[];
};
