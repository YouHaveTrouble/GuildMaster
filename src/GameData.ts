import type {Guild} from "@/classes/Guild";
import {Adventurer} from "@/classes/Adventurer";
import {Quest} from "@/classes/Quest";
import {getFromString, QuestRank} from "@/classes/QuestRank";

export class GameData {
    constructor(
        public guild: Guild,
        public adventurers: { [key: string]: Adventurer },
        public missives: { [key: string]: { [key: string]: Quest } },
        public lastQuestGot: { [key: string]: null | number },
        public lastRecruitAction: null | number
    ) {}
}

/**
 * Save the game to local storage
 */
export function saveGame(data: GameData): void {
    console.debug("Saving game...");
    window.localStorage.setItem("savedGame", JSON.stringify(data));
}

export function loadGame(): GameData | null {
    const savedGame = window.localStorage.getItem("savedGame");
    if (!savedGame) return null;
    console.debug("Loading game...");
    const parsedGame = JSON.parse(savedGame);
    return new GameData(
        parsedGame.guild,
        parsedGame.adventurers,
        parsedGame.missives,
        parsedGame.lastQuestGot,
        parsedGame.lastRecruitAction
    );
}

export async function loadAvailableQuests(): Promise<{ [key: string]: { [key: string]: Quest } }> {
    const ranks = ['S', 'A', 'B', 'C', 'D', 'E', 'F'];
    const questPromises = ranks.map(async (rank) => {
        const response = await fetch(`data/quests/Rank${rank}.json`);
        if (response.status !== 200) {
            console.error("Failed to load quests");
            alert("Failed to load quests. Please try refreshing the page.");
            return {};
        }
        const questData = await response.json();

        return questData.reduce((quests, quest, id) => {
            quests[id.toString()] = new Quest(
                id.toString(),
                getFromString(rank as QuestRank),
                quest.title,
                quest.text,
                1,
                0,
                0
            );
            return quests;
        }, {});
    });

    const quests = await Promise.all(questPromises);
    return ranks.reduce((result, rank, i) => {
        result[rank] = quests[i];
        return result;
    }, {});
}

export async function loadAdventurersForHire(currentAdventurerIds: Set<string> = new Set()): Promise<Adventurer[]> {
    const response = await fetch("data/adventurers.json");
    if (!response.ok) {
        console.error("Failed to load adventurers");
        alert("Failed to load adventurers. Please try refreshing the page.");
        return [];
    }
    const adventurerData = await response.json();
    const adventurers = [];
    for (const { id, name, portrait, attackExponent, level, exp } of adventurerData) {
        if (currentAdventurerIds.has(id)) continue;
        adventurers.push(new Adventurer(id, name, portrait, attackExponent, level, exp));
    }
    return adventurers;
}
