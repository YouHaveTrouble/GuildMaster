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
        const scalingFactor = Math.pow(1.25, level - 1);
        return Math.floor(1500 * scalingFactor * Math.pow(level, 1.25));
    }

    /**
     * Returns the number of adventurers the guild can have
     */
    getAdventurerCapacity(): number {
        return 1 + this.level ;
    }
}
