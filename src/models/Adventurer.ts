import type StatHolder from "@/models/StatHolder.ts";
import type AdventurerInventory from "@/models/AdventurerInventory.ts";

export default class Adventurer implements StatHolder {

  name: string;
  experience: number = 0;
  basePower: number = 0;
  baseDefense: number = 0;
  inventory: AdventurerInventory;

  constructor(
    name: string,
    experience: number = 0,
    basePower: number = 0,
    baseDefense: number = 0,
    inventory: AdventurerInventory
  ) {
    this.name = name;
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
