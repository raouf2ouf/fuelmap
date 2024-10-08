import { generateIdForPosition } from "@models/utils";
import { System, SystemDataExport, deflateSystem } from "./system";
import { BasicTaskData, Task, TaskData, TaskDataExport } from "./task";
import { TaskColor, TaskType } from "./task.enums";

export interface BasicSectorData extends BasicTaskData {
  type: TaskType.SECTOR;
  color: TaskColor;
  pattern?: number | undefined;
  emblem?: string | undefined;
}
export interface SectorDataExport extends BasicSectorData, TaskDataExport {
  type: TaskType.SECTOR;
  children: SystemDataExport[];
}
export interface Sector extends BasicSectorData, TaskData {
  type: TaskType.SECTOR;
}

export function deflateSector(
  sector: Sector,
  idx: number,
  tasks: Task[],
): SectorDataExport {
  const children: Task[] = [];
  const rest: Task[] = [];
  for (const task of tasks) {
    if (task.parent == sector.id) {
      children.push(task);
    } else {
      rest.push(task);
    }
  }
  const deflatedChildren: SystemDataExport[] = [];
  const blockchainId = generateIdForPosition(null, idx);
  children.forEach((child, idx) => {
    deflatedChildren.push(
      deflateSystem(blockchainId!, idx, child as System, rest),
    );
  });
  return { ...sector, blockchainId, children: deflatedChildren };
}

export const inflateSector = (
  data: SectorDataExport,
  galaxyId: string,
  index: number,
): Sector => {
  const inflated = {
    ...data,
    galaxyId,
    displayed: true,
    index,
    parent: "",
  };
  //@ts-ignore
  delete inflated.children;
  return inflated as Sector;
};
