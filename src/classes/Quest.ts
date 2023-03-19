import type {Adventurer} from "@/classes/Adventurer";
import type {QuestRank} from "@/classes/QuestRank";

export class Quest {
    id: string;
    rank: QuestRank;
    title:  string;
    text: string;
    adventurers: Array<Adventurer>;
    progressPoints: number;
    maxProgress: number;
    expReward: number;
    goldReward: number;

    constructor(id: string, rank: QuestRank, title: string, text: string, maxProgress: number, expReward: number, goldReward: number) {
        this.id = id;
        this.rank = rank;
        this.title = title;
        this.text = text;
        this.maxProgress = maxProgress;
        this.expReward = expReward;
        this.goldReward = goldReward;
        this.progressPoints = 0;
        this.adventurers = [];
    }

}
