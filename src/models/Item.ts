import type StatHolder from "@/models/StatHolder.ts";
import type {ItemType} from "@/models/ItemType.ts";

export default class Item implements StatHolder {

  name: string;
  description: string;
  power: number;
  defense: number;
  type: ItemType;

  constructor(
    name: string,
    description: string,
    power: number,
    defense: number,
    type: ItemType
  ) {
    this.name = name;
    this.description = description;
    this.power = power;
    this.defense = defense;
    this.type = type;
  }

  getDefense(): number {
    return this.defense;
  }

  getPower(): number {
    return this.power;
  }

}
