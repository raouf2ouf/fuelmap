import { TaskType } from "./enums";

export type Task<
  T extends "sector" | "system" | "planet" | "moon" | "generic" = "generic",
  S extends "inflated" | "deflated" = "inflated",
> = {
  id: number;
  name: string;
  checked: boolean;
  closed: boolean;
  description?: string | undefined;
} & S extends "inflated"
  ? {
      type: TaskType;
      progress?: number | undefined;
      galaxyId: string;
      parentId?: number;
      displayed: boolean;
      index: number;
    }
  : S extends "deflated"
    ? {}
    : never & T extends "sector"
      ? {
          color: number;
        }
      : S extends "inflated"
        ? {
            type: TaskType.SECTOR;
          }
        : S extends "deflated"
          ? {}
          : T extends "system"
            ? {
                hex?: number | undefined;
              }
            : S extends "inflated"
              ? {
                  type: TaskType.SYSTEM;
                }
              : S extends "deflated"
                ? {}
                : T extends "planet"
                  ? {}
                  : S extends "inflated"
                    ? {
                        type: TaskType.PLANET;
                      }
                    : S extends "deflated"
                      ? {}
                      : T extends "moon"
                        ? {}
                        : S extends "inflated"
                          ? {
                              type: TaskType.MOON;
                            }
                          : S extends "deflated"
                            ? {}
                            : T extends "generic"
                              ? {}
                              : never;
