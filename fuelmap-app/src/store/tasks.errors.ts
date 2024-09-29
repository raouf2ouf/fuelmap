import { TaskType } from "../types/enums";

export class TooMany extends Error {
  constructor(type: "sector" | "system" | "planet" | "moon") {
    super(`This action would generate too many ${type}`);
    this.name = "TooMany";
    Object.setPrototypeOf(this, TooMany.prototype);
  }
}
