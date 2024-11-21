import type StatHolder from "@/models/StatHolder.ts";
import AdventurerInventory from "@/models/AdventurerInventory.ts";
import type AdventurerIdentity from "@/models/AdventurerIdentity.ts";

export default class Adventurer implements StatHolder {

  identity: AdventurerIdentity;
  experience: number = 0;
  basePower: number = 0;
  baseDefense: number = 0;
  inventory: AdventurerInventory;

  constructor(
    identity: AdventurerIdentity,
    experience: number = 0,
    basePower: number = 0,
    baseDefense: number = 0,
    inventory: AdventurerInventory = new AdventurerInventory()
  ) {
    this.identity = identity;
    this.experience = experience;
    this.basePower = basePower;
    this.baseDefense = baseDefense;
    this.inventory = inventory;
  }

  getPower(): number {
    let power = this.basePower;
    power += this.inventory.getPower();
    return power;
  }

  getDefense(): number {
    let defense = this.baseDefense;
    defense += this.inventory.getDefense();
    return defense;
  }

}
