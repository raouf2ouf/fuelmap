import { BackupStep, TaskChange } from "../types/backup";
import { TaskType } from "../types/enums";
import {
  DeflatedTask,
  InflatedTask,
  PartialInflated,
  Task,
} from "../types/task";

export function deflateTask<T extends TaskType>(
  inflatedTask: InflatedTask<T>,
): DeflatedTask<T> {
  const deflated = {
    ...inflatedTask,
  } satisfies DeflatedTask<T>;
  // delete inflated properties
  delete deflated.progress;
  delete (deflated as PartialInflated).galaxyId;
  delete (deflated as PartialInflated).closed;
  delete (deflated as PartialInflated).displayed;
  if (getTypeGivenId(inflatedTask.id) < TaskType.SYSTEM)
    delete (deflated as PartialInflated).color;

  return deflated;
}

export const TASK_TYPE_MASK = {
  [TaskType.SECTOR]: 0b111000000000,
  [TaskType.SYSTEM]: 0b000111000000,
  [TaskType.PLANET]: 0b000000111000,
  [TaskType.MOON]: 0b000000000111,
};

export function getTypeGivenId(id: number): TaskType {
  if ((id & TASK_TYPE_MASK[TaskType.MOON]) > 0) return TaskType.MOON;
  if ((id & TASK_TYPE_MASK[TaskType.PLANET]) > 0) return TaskType.PLANET;
  if ((id & TASK_TYPE_MASK[TaskType.SYSTEM]) > 0) return TaskType.SYSTEM;
  return TaskType.SECTOR;
}

export function getParentId(id: number): number | null {
  const type = getTypeGivenId(id);
  if (type === TaskType.SECTOR) return null;
  const shift = type * 3;
  return (id >> shift) << shift;
}

export function getChildren(id: number, tasks: Task[]): Task[] {
  return tasks.filter((t) => getParentId(t.id) === id);
}

export function getAllChildren(id: number, tasks: Task[]): Task[] {
  let lowerBound = id;
  let upperBound = generateSiblingId(id, true);
  return tasks.filter(
    (t) => t.id !== id && t.id > lowerBound && t.id < upperBound,
  );
}

export function getAllParents(id: number, tasks: Task[]): Task[] {
  const sectorPosition = id >> 9;
  const sectorParentId = sectorPosition << 9;
  const sectorSiblingId = (sectorPosition + 1) << 9;
  const type = getTypeGivenId(id);
  return tasks.filter(
    (t) =>
      t.id >= sectorParentId &&
      t.id < sectorSiblingId &&
      getTypeGivenId(t.id) < type,
  );
}

export function getChildPosition(id: number): number {
  const type = getTypeGivenId(id);
  const shift = (3 - type) * 3;
  return (id & TASK_TYPE_MASK[type]) >> shift;
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

export function generateSiblingId(id: number, after: boolean = true): number {
  const type = getTypeGivenId(id);
  const shift = (3 - type) * 3;
  const delta = after ? +1 : -1;
  return ((id >> shift) + delta) << shift;
}

export function propagateToggle(
  id: number,
  tasks: Task[],
): { id: number; changes: Partial<Task> }[] {
  const toCheck: Task[] = getChildren(id, tasks);
  const children: { id: number; changes: Partial<Task> }[] = [];
  while (toCheck.length > 0) {
    const child = toCheck.pop()!;
    const parentId = getParentId(child.id);
    const parent = tasks.find((t) => t.id == parentId)!;
    child.displayed = !parent.closed && parent.displayed;
    children.push({ id: child.id, changes: { displayed: child.displayed } });
    getChildren(child.id, tasks).forEach((t) => toCheck.push(t));
  }
  return children;
}

export function propagateChecked(
  task: Task,
  tasks: Task[],
  toggle?: boolean | undefined,
): { rollback: TaskChange[]; rollforward: TaskChange[] } | undefined {
  const rollback: TaskChange[] = [];
  const rollforward: TaskChange[] = [];
  const previousValue = task.checked;
  const newValue = toggle === undefined ? !task.checked : toggle;

  if (previousValue == newValue) return;

  if (newValue) {
    // need To check all children
    const allChildren = getAllChildren(task.id, tasks);
    for (const child of allChildren) {
      if (!child.checked) {
        rollback.push({ id: child.id, changes: { checked: false } });
        rollforward.push({ id: child.id, changes: { checked: true } });
      }
    }
  } else {
    // need to uncheck any checked parent
    const allParents = getAllParents(task.id, tasks);
    for (const parent of allParents) {
      if (parent.checked) {
        rollback.push({ id: parent.id, changes: { checked: true } });
        rollforward.push({ id: parent.id, changes: { checked: false } });
      }
    }
  }

  rollback.push({ id: task.id, changes: { checked: previousValue } });
  rollforward.push({ id: task.id, changes: { checked: newValue } });

  return { rollback, rollforward };
}

export function morphTask(
  tasks: Task[],
  task: Task,
  previousId: number,
  newId: number,
): BackupStep | undefined {}
