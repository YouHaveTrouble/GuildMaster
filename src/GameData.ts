import type {Guild} from "@/classes/Guild";
import type {Adventurer} from "@/classes/Adventurer";
import type {Quest} from "@/classes/Quest";

export class GameData {
    guild: Guild;
    adventurers: { [key: string]: Adventurer };
    missives: { [key: string]: { [key: string]: Quest } };
    lastQuestGot: { [key: string]: null | number };
    lastRecruitAction: null | number;

    constructor(guild: Guild, adventurers: { [key: string]: Adventurer }, missives: { [key: string]: { [key: string]: Quest } }, lastQuestGot: { [key: string]: null | number }, lastRecruitAction: null | number) {
        this.guild = guild;
        this.adventurers = adventurers;
        this.missives = missives;
        this.lastQuestGot = lastQuestGot;
        this.lastRecruitAction = lastRecruitAction;
    }
}


/**
 * Save the game to local storage
 */
export function saveGame(
    data: GameData
): void {
    console.debug("Saving game...");
    window.localStorage.setItem("savedGame", JSON.stringify({
        guild: data.guild,
        adventurers: data.adventurers,
        missives: data.missives,
        lastQuestGot: data.lastQuestGot,
        lastRecruitAction: data.lastRecruitAction,
    }));
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

