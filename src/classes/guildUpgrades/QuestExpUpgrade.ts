import {GuildUpgrade} from "@/classes/GuildUpgrade";

export default class QuestExpUpgrade extends GuildUpgrade {
  constructor(level: number = 1) {
    super();
    this.level = level;
    this.nextLevelCost = this.getCostForLevel(this.level);
    this.guildLevelRequirement = 8;
  }

  upgrade(): void {
    this.level += 1;
    this.nextLevelCost = this.getCostForLevel(this.level);
  }

  getCostForLevel(level: number): number {
    const scalingFactor = Math.pow(1.15, level - 1);
    return Math.floor(4000000 * scalingFactor * Math.pow(level, 1.1));
  }

  getModifier(): number {
    return 1 + (this.level * 0.1);
  }
}