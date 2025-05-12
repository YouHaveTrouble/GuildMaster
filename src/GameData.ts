import {Guild} from "@/classes/Guild";
import {Adventurer} from "@/classes/Adventurer";
import {Quest} from "@/classes/Quest";
import {getFromString, QuestRank} from "@/classes/QuestRank";

export class GameData {
  guild: Guild;
  adventurers: { [key: string]: Adventurer };
  missives: Array<Quest>;
  lastQuestGot: { [key: string]: null | number };
  lastRecruitAction: null | number;
  adventurerForHireId: string | null;

  constructor(
    data: any,
  ) {
    this.guild = data.guild ?? new Guild(1, 0);
    this.adventurers = data.adventurers ?? {} as { [key: string]: Adventurer };
    this.missives = data.missives ?? [] as Array<Quest>;
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

  const adventurers = {} as { [key: string]: any };
  for (const adventurerId in data.adventurers) {
    const adventurer: {[key: string]: any} = JSON.parse(JSON.stringify(data.adventurers[adventurerId]));
    delete adventurer.portrait;
    adventurers[adventurerId] = adventurer;
  }

  window.localStorage.setItem("savedGame", JSON.stringify({
    guild: data.guild,
    adventurers: adventurers,
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

  const questsResponse = await fetch(`data/quests.json`);

  if (questsResponse.status !== 200) {
    console.error("Failed to load quests");
    alert("Failed to load quests. Please try refreshing the page.");
    return quests;
  }

  const questsData = await questsResponse.json();

  for (const rank of Object.keys(questsData.ranks)) {
    const questRank = getFromString(rank as keyof typeof QuestRank);
    if (!questRank) {
      console.error(`Invalid quest rank: ${rank}`);
      continue;
    }
    const questRankData = questsData.ranks[questRank];

    for (const quest of questRankData) {
      const id = quest.id;
      quests[questRank][id] = new Quest(
        id,
        questRank,
        quest.title,
        quest.text,
      );
    }
  }
  return quests;
}

export async function loadAdventurersForHire(): Promise<Array<Adventurer>> {
  const response = await fetch("data/adventurers.json");
  if (response.status !== 200) {
    console.error("Failed to load adventurers");
    alert("Failed to load adventurers. Please try refreshing the page.");
    return [];
  }
  const adventurerData = await response.json();

  const adventurers: Array<Adventurer> = [];
  for (const adventurer of adventurerData) {
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

export function removeAlreadyHiredAdventurers(
  adventurers: Array<Adventurer>,
  adventurersHired: { [key: string]: Adventurer }
): Array<Adventurer> {
  const adventurersForHire: Array<Adventurer> = [];
  for (const adventurer of adventurers) {
    if (adventurersHired[adventurer.id]) continue;
    adventurersForHire.push(adventurer);
  }
  return adventurersForHire;
}
