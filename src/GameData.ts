import {Guild} from "@/classes/Guild";
import {Adventurer} from "@/classes/Adventurer";
import {Quest} from "@/classes/Quest";
import {getFromString, QuestRank} from "@/classes/QuestRank";

export class GameData {
  guild: Guild;
  adventurers: { [key: string]: Adventurer };
  missives: { [key: string]: { [key: string]: Quest } };
  lastQuestGot: { [key: string]: null | number };
  lastRecruitAction: null | number;
  adventurerForHireId: string | null;

  constructor(
    data: any,
  ) {
    this.guild = data.guild ?? new Guild(1, 0);
    this.adventurers = data.adventurers ?? {} as { [key: string]: Adventurer };
    this.missives = data.missives ?? {} as { [key: string]: { [key: string]: Quest } };
    this.lastQuestGot = data.lastQuestGot ?? {} as { [key: string]: null | number };
    this.lastRecruitAction = data.lastRecruitAction ?? null;
    this.adventurerForHireId = data.adventurerForHireId ?? null;
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
    adventurerForHireId: data.adventurerForHireId,
  }));
}

export function loadGame(): GameData | null {
  const savedGame = window.localStorage.getItem("savedGame");
  if (!savedGame) return null;
  const parsedGame = JSON.parse(savedGame);
  console.debug("Loading game...");
  return new GameData(parsedGame);
}

export async function loadAvailableQuests(): Promise<{ [key: string]: { [key: string]: Quest } }> {
  const quests = {
    S: {} as { [key: string]: Quest },
    A: {} as { [key: string]: Quest },
    B: {} as { [key: string]: Quest },
    C: {} as { [key: string]: Quest },
    D: {} as { [key: string]: Quest },
    E: {} as { [key: string]: Quest },
    F: {} as { [key: string]: Quest },
  } as { [key: string]: { [key: string]: Quest } };

  for (const rank in quests) {
    const response = await fetch(`data/quests/Rank${rank}.json`);
    if (response.status !== 200) {
      console.error("Failed to load quests");
      alert("Failed to load quests. Please try refreshing the page.");
      return quests;
    }
    const questData = await response.json();

    let id = 0;
    for (const quest of questData) {
      id++;
      quests[rank.toString()][id] = new Quest(
        id.toString(),
        getFromString(rank as QuestRank),
        quest.title,
        quest.text,
        1,
        0,
        0
      );
    }
  }
  return quests;
}

export async function loadAdventurersForHire(currentAdventurerIds: Array<string> = []): Promise<Array<Adventurer>> {
  const response = await fetch("data/adventurers.json");
  if (response.status !== 200) {
    console.error("Failed to load adventurers");
    alert("Failed to load adventurers. Please try refreshing the page.");
    return [];
  }
  const adventurerData = await response.json();

  const adventurers = [] as Array<Adventurer>;
  for (const adventurer of adventurerData) {
    if (currentAdventurerIds.includes(adventurer.id)) continue;
    adventurers.push(new Adventurer(
      adventurer.id,
      adventurer.name,
      adventurer.portrait,
      adventurer.attackExponent,
      adventurer.level,
      adventurer.exp,
    ));
  }

  return adventurers;
}
