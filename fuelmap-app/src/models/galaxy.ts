import { v4 as uuid } from "uuid";
import { TaskType } from "./task/task.enums";
import { Sector, SectorDataExport, deflateSector } from "./task/sector";
import { Task } from "./task/task";
import { Territory } from "./territory";
import { System } from "./task/system";
import { Hex } from "./hex";

/**
 * Galaxy themes
 */
export enum GalaxyTheme {
  BTL = "BTL",
}

/**
 * Galaxy types
 */
export enum GalaxyCategory {
  PROJECT = "Project",
  NFT = "NFT",
}

/**
 * Galaxy save status
 */
export enum SaveStatus {
  NEED_TO_SAVE = "need-to-save",
  NO_COPY = "no-copy",
  AHEAD = "ahead",
  SAME = "same",
  BEHIND = "behind",
}

interface BasicGalaxyData {
  id: string;
  blockchainId?: string | undefined;
  name: string;
  description: string;

  theme: GalaxyTheme;
  discoverable: boolean;
  category: GalaxyCategory;
  date: number;
  owner?: string | undefined;
  lastServerDate?: number | undefined;
  lastModificationDate?: number | undefined;
  saveStatus?: SaveStatus | undefined;
  progress?: number | undefined;
  minimap?:
    | { territories: Territory[]; systems: System[]; hexes: Hex[] }
    | undefined;
}

export interface GalaxyDataExport extends BasicGalaxyData {
  tasks: SectorDataExport[];
}

export function deflateGalaxy(
  galaxy: GalaxyDataExport,
  tasks: Task[],
): GalaxyDataExport {
  const children: Task[] = [];
  const rest: Task[] = [];
  for (const task of tasks) {
    if (task.type == TaskType.SECTOR) {
      children.push(task);
    } else {
      rest.push(task);
    }
  }
  const deflatedChildren: SectorDataExport[] = [];
  children.forEach((child, idx) => {
    deflatedChildren.push(deflateSector(child as Sector, idx, rest));
  });
  return {
    id: galaxy.id,
    name: galaxy.name,
    description: galaxy.description,
    theme: galaxy.theme,
    discoverable: galaxy.discoverable,
    category: galaxy.category,
    date: galaxy.date,
    lastServerDate: galaxy.lastServerDate,
    lastModificationDate: galaxy.lastModificationDate,
    tasks: deflatedChildren,
  };
}

export const createNewGalaxy = (
  name: string,
  description: string,
  theme: GalaxyTheme,
  discoverable: boolean,
): GalaxyDataExport => {
  const data: GalaxyDataExport = {
    id: uuid(),
    name,
    description,
    theme,
    discoverable,
    category: GalaxyCategory.PROJECT,
    date: Date.now(),
    saveStatus: SaveStatus.NEED_TO_SAVE,

    tasks: [],
  };

  return data;
};
