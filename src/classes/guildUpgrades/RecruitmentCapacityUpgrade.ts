import {GuildUpgrade} from "@/classes/GuildUpgrade";
import type MaxLevellable from "@/classes/MaxLevellable";

export default class AdventurerCapacityUpgrade extends GuildUpgrade implements MaxLevellable {

    maxLevel: number;

    constructor(level: number = 1) {
        super();
        this.level = level;
        this.nextLevelCost = this.getCostForLevel(this.level);
        this.guildLevelRequirement = 3;
        this.maxLevel = 3;
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
    getRecruitmentCapacity(): number {
        return this.level ;
    }

    isMaxLevel(): boolean {
        return this.level >= this.maxLevel;
    }
}
