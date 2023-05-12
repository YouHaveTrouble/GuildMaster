import {GuildUpgrade} from "@/classes/GuildUpgrade";
import type MaxLevellable from "@/classes/MaxLevellable";
import {QuestRank} from "@/classes/QuestRank";

export default class AutoFinishQuestsUpgrade extends GuildUpgrade implements MaxLevellable {

    maxLevel: number;

    constructor(level: number = 1) {
        super();
        this.level = level;
        this.nextLevelCost = this.getCostForLevel(this.level);
        this.guildLevelRequirement = 7;
        this.maxLevel = 8;
    }

    upgrade(): void {
        this.level += 1;
        this.nextLevelCost = this.getCostForLevel(this.level);
    }

    getCostForLevel(level: number): number {
        const scalingFactor = Math.pow(4.2, level - 1);
        return Math.floor(25000 * scalingFactor * Math.pow(level, 1.05));
    }

    isMaxLevel(): boolean {
        return this.level >= this.maxLevel;
    }

    getRanksToAutoFinishQuestsIn(): Array<QuestRank> {
        switch (this.level) {
            case 1:
            default:
                return [];
            case 2:
                return [QuestRank.F];
            case 3:
                return [QuestRank.F, QuestRank.E];
            case 4:
                return [QuestRank.F, QuestRank.E, QuestRank.D];
            case 5:
                return [QuestRank.F, QuestRank.E, QuestRank.D, QuestRank.C];
            case 6:
                return [QuestRank.F, QuestRank.E, QuestRank.D, QuestRank.C, QuestRank.B];
            case 7:
                return [QuestRank.F, QuestRank.E, QuestRank.D, QuestRank.C, QuestRank.B, QuestRank.A];
            case 8:
                return [QuestRank.F, QuestRank.E, QuestRank.D, QuestRank.C, QuestRank.B, QuestRank.A, QuestRank.S];
        }
    }
}
