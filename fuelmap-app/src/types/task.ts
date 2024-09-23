import { TaskType } from "./enums";

// Common base properties for all tasks
interface BaseTask {
  id: number;
  name: string;
  checked: boolean;
  description?: string;
}

// Inflated properties common across all inflated tasks

export interface PartialInflated {
  progress?: number;
  galaxyId?: string;
  closed?: boolean;
  color?: number;
  displayed?: boolean;
}

type InflatedCommon = PartialInflated & {
  progress?: number;
  galaxyId: string;
  closed: boolean;
  color: number;
  displayed: boolean;
};
// Specific task types

interface SectorTask {
  color: number;
}

interface SystemTask {
  hex?: number;
}

interface PlanetTask {}

interface MoonTask {}

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
