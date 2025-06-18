import type {Adventurer} from "@/classes/Adventurer";
import {QuestRank} from "@/classes/QuestRank";
import QuestPhase from "@/classes/quests/QuestPhase";

export class Quest {
    id: string;
    rank: QuestRank;
    title:  string;
    text: string;
    adventurers: Array<Adventurer>;
    phases: QuestPhase[] = [];
    maxAdventurers: number;
    expReward: number;
    goldReward: number;

    constructor(
      id: string,
      rank: QuestRank,
      title: string,
      text: string,
      phases: QuestPhase[],
      expReward: number = 0,
      goldReward: number = 0,
      maxAdventurers: number = 1
    ) {
        this.id = id;
        this.rank = rank;
        this.title = title;
        this.text = text;
        this.expReward = expReward;
        this.goldReward = goldReward;
        this.adventurers = [];
        this.maxAdventurers = maxAdventurers;
        for (const phase of phases) {
            this.phases.push(new QuestPhase(Array.from(phase.types), phase.maxPoints, phase.points));
        }
    }

    getPercentProgress(): number {
        let maxProgress = 0;
        let progressPoints = 0;
        for (const phase of this.phases) {
            maxProgress += phase.maxPoints;
            progressPoints += phase.points;
        }
        return Math.round(progressPoints / maxProgress * 100);
    }

    isCompleted(): boolean {
        for (const phase of this.phases) {
            if (!phase.completed()) return false;
        }
        return true;
    }

    getMaxProgress(): number {
        let maxProgress = 0;
        for (const phase of this.phases) {
            maxProgress += phase.maxPoints;
        }
        return maxProgress;
    }

    getProgress(): number {
        let progressPoints = 0;
        for (const phase of this.phases) {
            progressPoints += phase.points;
        }
        return progressPoints;
    }

    serialize(): {[key: string]: any} {
        return {
            id: this.id,
            rank: this.rank,
            title: this.title,
            text: this.text,
            phases: this.phases.map(phase => phase.serialize()),
            expReward: this.expReward,
            goldReward: this.goldReward,
            maxAdventurers: this.maxAdventurers,
        };
    }

    static deserialize(data: {[key: string]: any}): Quest {
        if (!data || typeof data !== 'object') {
            throw new Error("Invalid data for Quest deserialization");
        }

        const phases = (data.phases || []).map((phaseData: any) => QuestPhase.deserialize(phaseData));

        return new Quest(
            data.id,
            data.rank,
            data.title,
            data.text,
            phases,
            data.expReward || 0,
            data.goldReward || 0,
            data.maxAdventurers || 1
        );
    }

}

/**
 * Generate rewards for a quest and return it
 * @param quest
 * @param expModifier - multiplification modifier for the exp reward
 * @param goldModifier - multiplification modifier for the gold reward
 */
export function getQuestWithRewards(quest: Quest, expModifier: number = 1, goldModifier: number = 1) {

    let rewardValue = 1;

    switch (quest.rank) {
        case QuestRank.S:
            // at level 30 adventurers have ~6513 dps, this will take 30 seconds on level 30
            rewardValue = 195390;
            break;
        case QuestRank.A:
            // at level 25 adventurers have ~2051 dps, this will take 15 seconds on level 25
            rewardValue = 30770;
            break;
        case QuestRank.B:
            // at level 20 adventurers have ~645 dps, this will take 15 seconds on level 20
            rewardValue = 9690;
            break;
        case QuestRank.C:
            // at level 15 adventurers have ~203 dps, this will take 15 seconds on level 15
            rewardValue = 3045;
            break;
        case QuestRank.D:
            // at level 10 adventurers have ~64 dps, this will take 15 seconds on level 10
            rewardValue = 960;
            break;
        case QuestRank.E:
            // at level 5 adventurers have ~20 dps, this will take 15 seconds on level 5
            rewardValue = 300;
            break;
        case QuestRank.F:
            // at level 1 adventurers have ~8 dps, this will take 15 seconds on level 1
            rewardValue = 120;
            break;
    }

    let goldReward = Math.floor(rewardValue/6 * goldModifier);
    let expReward = Math.floor((Math.floor(rewardValue/120) - rewardValue/1000) * expModifier);

    // add some randomness to the rewards
    goldReward = Math.floor(randomNumberBetween(goldReward * 0.95, goldReward * 1.1));
    expReward = Math.max(1, Math.floor(randomNumberBetween(expReward * 0.95, expReward * 1.2)));

    return new Quest(quest.id, quest.rank, quest.title, quest.text, quest.phases, expReward, goldReward);
}

function randomNumberBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
}
