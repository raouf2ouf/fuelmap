import { TaskType } from "./task/task.enums";

export const TASK_TYPE_MASK = {
  [TaskType.SECTOR]: 0b111000000000,
  [TaskType.SYSTEM]: 0b000111000000,
  [TaskType.PLANET]: 0b000000111000,
  [TaskType.MOON]: 0b000000000111,
};

export const TASK_TYPE_MASK_UPTO = {
  [TaskType.SECTOR]: 0b111000000000,
  [TaskType.SYSTEM]: 0b111111000000,
  [TaskType.PLANET]: 0b111111111000,
  [TaskType.MOON]: 0b111111111111,
};

export function getTypeGivenId(idx: number): TaskType {
  const id = Math.floor(idx);
  if ((id & TASK_TYPE_MASK[TaskType.MOON]) > 0) return TaskType.MOON;
  if ((id & TASK_TYPE_MASK[TaskType.PLANET]) > 0) return TaskType.PLANET;
  if ((id & TASK_TYPE_MASK[TaskType.SYSTEM]) > 0) return TaskType.SYSTEM;
  return TaskType.SECTOR;
}

export function generateIdForPosition(
  parentId: number | null | undefined,
  position: number,
): number {
  if (!parentId) return position << 9;
  const type = getTypeGivenId(parentId);
  if (type > TaskType.PLANET)
    throw new Error("Parent should be at most a PLANET");
  const shift = (2 - type) * 3;
  return ((parentId >> shift) | position) << shift;
}
