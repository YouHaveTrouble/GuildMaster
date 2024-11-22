import Adventurer from "@/models/Adventurer.ts";
import type AdventurerIdentity from "@/models/AdventurerIdentity.ts";
import AdventurerInventory from "@/models/AdventurerInventory.ts";

export default class SaveData {

  adventurers: Array<Adventurer> = [];

  constructor(
    data: {[key:string]: unknown} = {},
    adventurerIdentities: {[key:string]: AdventurerIdentity} = {}
  ) {
    if (Array.isArray(data?.adventurers)) {
      for (const adventurerData of data.adventurers) {
        const identity = adventurerIdentities[adventurerData?.identity?.id];
        if (!identity) {
          console.error("Adventurer identity not found for adventurer data", adventurerData);
          continue;
        }
        this.adventurers.push(new Adventurer(
          identity,
          adventurerData?.experience ?? 0,
          adventurerData?.basePower ?? 0,
          adventurerData?.baseDefense ?? 0,
          new AdventurerInventory(
            adventurerData?.inventory?.helmet ?? null,
            adventurerData?.inventory?.armor ?? null,
            adventurerData?.inventory?.boots ?? null,
            adventurerData?.inventory?.weapon ?? null,
          )
        ));
      }
    }
  }

}
