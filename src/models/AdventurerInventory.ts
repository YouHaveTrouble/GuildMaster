import type Item from "@/models/Item.ts";
import type StatHolder from "@/models/StatHolder.ts";

export default class AdventurerInventory implements StatHolder {

  helmetId = 0;
  armorId = 1;
  bootsId = 2;
  weaponId = 3;

  items: Array<Item|null> = [];

  constructor(
    helmet: Item | null = null,
    armor: Item | null = null,
    boots: Item | null = null,
    weapon: Item | null = null
  ) {
    this.items[this.helmetId] = helmet;
    this.items[this.armorId] = armor;
    this.items[this.bootsId] = boots;
    this.items[this.weaponId] = weapon;
  }

  getHelmet(): Item | null {
    return this.items[this.helmetId];
  }

  getArmor(): Item | null {
    return this.items[this.armorId];
  }

  getBoots(): Item | null {
    return this.items[this.bootsId];
  }

  getWeapon(): Item | null {
    return this.items[this.weaponId];
  }

  getDefense(): number {
    let defense = 0;
    for (let item of this.items) {
      if (item !== null) {
        defense += item.getDefense();
      }
    }
    return defense
  }

  getPower(): number {
    let power = 0;
    for (let item of this.items) {
      if (item !== null) {
        power += item.getPower();
      }
    }
    return power;
  }

}
