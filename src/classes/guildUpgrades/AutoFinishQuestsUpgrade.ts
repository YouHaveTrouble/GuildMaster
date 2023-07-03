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
        switch (level) {
            case 1:
                return 25000;
            case 2:
                return 50000;
            case 3:
                return 75000;
            case 4:
                return 150000;
            case 5:
                return 275000;
            case 6:
                return 750000;
            case 7:
                return 1500000;
            case 8:
                return 2500000;
            default:
                return 0;
        }
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
