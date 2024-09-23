import { Storage, Drivers } from "@ionic/storage";
import { Galaxy, DeflatedGalaxy } from "../types/galaxy";

const storage = new Storage({
  name: "fuelmap",
  driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
});
storage.create();

export async function saveGalaxyLocally(galaxyData: DeflatedGalaxy) {
  await storage.set(galaxyData.id, galaxyData);
}

export async function getLocalGalaxy(
  id: string,
): Promise<DeflatedGalaxy | undefined> {
  return await storage.get(id);
}

export async function getAllLocalGalaxies(): Promise<DeflatedGalaxy[]> {
  const galaxies: DeflatedGalaxy[] = [];
  const keys = await storage.keys();
  for (const key of keys) {
    const data = await storage.get(key);
    if (data?.id) {
      galaxies.push(data);
    }
  }
  return galaxies;
}
