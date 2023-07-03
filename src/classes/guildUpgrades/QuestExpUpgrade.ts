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
    if (level === 1) return 1000000;
    return Math.floor(1000000 * (level * 1.05));
  }

  getModifier(): number {
    return 1 + (this.level * 0.1);
  }
}