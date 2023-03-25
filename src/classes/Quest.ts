import type {Adventurer} from "@/classes/Adventurer";
import {QuestRank} from "@/classes/QuestRank";

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

    getPercentProgress(): number {
        return Math.round(this.progressPoints / this.maxProgress * 100);
    }

}

/**
 * Generate rewards for a quest and return it
 * @param quest
 */
export function getQuestWithRewards(quest: Quest) {

    let maxProgress = 1;

    switch (quest.rank) {
        case QuestRank.S:
            // at level 30 adventurers have ~2353 dps, this will take 30 seconds on level 30
            maxProgress = 70590
            break;
        case QuestRank.A:
            // at level 25 adventurers have ~1122 dps, this will take 15 seconds on level 25
            maxProgress = 16800
            break;
        case QuestRank.B:
            // at level 20 adventurers have ~564 dps, this will take 15 seconds on level 20
            maxProgress = 8460;
            break;
        case QuestRank.C:
            // at level 15 adventurers have ~256 dps, this will take 15 seconds on level 15
            maxProgress = 3840;
            break;
        case QuestRank.D:
            // at level 10 adventurers have ~103 dps, this will take 15 seconds on level 10
            maxProgress = 1545;
            break;
        case QuestRank.E:
            // at level 5 adventurers have ~45 dps, this will take 15 seconds on level 5
            maxProgress = 675;
            break;
        case QuestRank.F:
            // at level 1 adventurers have ~8 dps, this will take 15 seconds on level 1
            maxProgress = 120;
            break;
    }

    let goldReward = Math.floor(maxProgress/6);
    let expReward = Math.floor(Math.floor(maxProgress/120) - maxProgress/1000);

    // add some randomness to the rewards
    goldReward = Math.floor(randomNumberBetween(goldReward * 0.95, goldReward * 1.1));
    expReward = Math.max(1, Math.floor(randomNumberBetween(expReward * 0.95, expReward * 1.1)));

    return new Quest(quest.id, quest.rank, quest.title, quest.text, maxProgress, expReward, goldReward);
}

function randomNumberBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
}