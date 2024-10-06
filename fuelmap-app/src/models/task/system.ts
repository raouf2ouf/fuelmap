import { generateIdForPosition } from "@models/utils";
import { Planet, PlanetDataExport, deflatePlanet } from "./planet";
import { Sector } from "./sector";
import { BasicTaskData, Task, TaskData, TaskDataExport } from "./task";
import { TaskColor, TaskType } from "./task.enums";

export interface BasicSystemData extends BasicTaskData {
  type: TaskType.SYSTEM;
  hex?: number | undefined;
  pinned?: boolean | undefined;
}
export interface SystemDataExport extends BasicSystemData, TaskDataExport {
  type: TaskType.SYSTEM;
  children: PlanetDataExport[];
}
export interface System extends BasicSystemData, TaskData {
  type: TaskType.SYSTEM;
}

export function deflateSystem(
  parentId: number,
  idx: number,
  system: System,
  tasks: Task[],
): SystemDataExport {
  const children: Task[] = [];
  const rest: Task[] = [];
  for (const task of tasks) {
    if (task.parent == system.id) {
      children.push(task);
    } else {
      rest.push(task);
    }
  }
  const blockchainId = generateIdForPosition(parentId, idx);
  const deflatedChildren: PlanetDataExport[] = [];
  children.forEach((child, idx) => {
    deflatedChildren.push(
      deflatePlanet(blockchainId, idx, child as Planet, rest),
    );
  });
  return { ...system, blockchainId, children: deflatedChildren };
}

export const inflateSystem = (
  data: SystemDataExport,
  galaxyId: string,
  index: number,
  parent: string,
  color: TaskColor,
): System => {
  const inflated = { ...data, color, galaxyId, displayed: true, index, parent };
  //@ts-ignore
  delete inflated.children;
  return inflated as System;
};
