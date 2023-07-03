import {GuildUpgrade} from "@/classes/GuildUpgrade";

export default class AdventurerCapacityUpgrade extends GuildUpgrade {
    constructor(level: number = 1) {
        super();
        this.level = level;
        this.nextLevelCost = this.getCostForLevel(this.level);
        this.guildLevelRequirement = 1;
    }

    upgrade(): void {
        this.level += 1;
        this.nextLevelCost = this.getCostForLevel(this.level);
    }

    getCostForLevel(level: number): number {
        if (level === 1) return 1500;
        return Math.floor(1500 * (level * 4));
    }

    /**
     * Returns the number of adventurers the guild can have
     */
    getAdventurerCapacity(): number {
        return 1 + this.level ;
    }
}
