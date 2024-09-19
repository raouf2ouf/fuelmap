import { TaskType } from "./enums";

// Common base properties for all tasks
interface BaseTask {
  id: number;
  name: string;
  checked: boolean;
  closed: boolean;
  description?: string;
}

// Inflated properties common across all inflated tasks

interface PartialInflated {
  progress?: number;
  galaxyId?: string;
  parentId?: number;
  displayed?: boolean;
  index?: number;
}

type InflatedCommon = PartialInflated & {
  progress?: number;
  galaxyId: string;
  parentId?: number;
  displayed: boolean;
  index: number;
};
// Specific task types

interface SectorTask {
  type: TaskType.SECTOR;
  color: number;
}

interface SystemTask {
  type: TaskType.SYSTEM;
  hex?: number;
}

interface PlanetTask {
  type: TaskType.PLANET;
}

interface MoonTask {
  type: TaskType.MOON;
}

// Create the inflated/deflated version for each task type
export type InflatedTask<T extends TaskType> = BaseTask &
  InflatedCommon &
  (T extends TaskType.SECTOR
    ? SectorTask
    : T extends TaskType.SYSTEM
      ? SystemTask
      : T extends TaskType.PLANET
        ? PlanetTask
        : T extends TaskType.MOON
          ? MoonTask
          : never);

// Deflated tasks keep base properties and type-specific properties
export type DeflatedTask<T extends TaskType> = BaseTask &
  (T extends TaskType.SECTOR
    ? SectorTask
    : T extends TaskType.SYSTEM
      ? SystemTask
      : T extends TaskType.PLANET
        ? PlanetTask
        : T extends TaskType.MOON
          ? MoonTask
          : never);

// Main Task type with generic
export type Task<
  T extends TaskType =
    | TaskType.SECTOR
    | TaskType.SYSTEM
    | TaskType.PLANET
    | TaskType.MOON,
  S extends "inflated" | "deflated" = "inflated",
> = S extends "inflated" ? InflatedTask<T> : DeflatedTask<T>;

export function deflateTask<T extends TaskType>(
  inflatedTask: InflatedTask<T>,
): DeflatedTask<T> {
  const deflated = {
    ...inflatedTask,
  } satisfies DeflatedTask<T>;
  // delete inflated properties
  delete deflated.progress;
  delete (deflated as PartialInflated).galaxyId;
  delete deflated.parentId;
  delete (deflated as PartialInflated).displayed;
  delete (deflated as PartialInflated).index;

  return deflated;
}
