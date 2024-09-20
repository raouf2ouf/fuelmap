import { Storage, Drivers } from "@ionic/storage";
import { Galaxy, GalaxyWithTasks } from "../types/galaxy";

const storage = new Storage({
  name: "fuelmap",
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
});
storage.create();

export async function saveGalaxyLocally(galaxyData: GalaxyWithTasks) {
  await storage.set(galaxyData.id, galaxyData);
}

export async function getLocalGalaxy(
  id: string,
): Promise<GalaxyWithTasks | undefined> {
  return await storage.get(id);
}

export async function getAllLocalGalaxies(): Promise<GalaxyWithTasks[]> {
  const galaxies: GalaxyWithTasks[] = [];
  const keys = await storage.keys();
  for (const key of keys) {
    const data = await storage.get(key);
    if (data?.id) {
      galaxies.push(data);
    }
  }
  return galaxies;
}
