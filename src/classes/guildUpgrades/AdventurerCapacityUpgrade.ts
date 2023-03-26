import {GuildUpgrade} from "@/classes/GuildUpgrade";

export class AdventurerCapacityUpgrade extends GuildUpgrade {
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
        return 1500 + ((level - 1) * 1.15 * 1500);
    }

    /**
     * Returns the number of adventurers the guild can have
     */
    getAdventurerCapacity(): number {
        return 2 + this.level ;
    }
}
