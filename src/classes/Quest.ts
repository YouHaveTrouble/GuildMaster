import type {Adventurer} from "@/classes/Adventurer";

export class Quest {
    id: string;
    title:  string;
    text: string;
    adventurers: Array<Adventurer>;
    progressPoints: number;
    maxProgress: number;
    expReward: number;

    constructor(id: string, title: string, text: string, maxProgress: number, expReward: number) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.maxProgress = maxProgress;
        this.expReward = expReward;
        this.progressPoints = 0;
        this.adventurers = [];
    }

}

export function createRandomQuest(budget: number) {

}
