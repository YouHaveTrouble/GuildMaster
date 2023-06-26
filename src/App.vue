<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
import {version} from "../package.json"
</script>

<template>
  <section class="loading-screen" :class="{disabled: !loading}">
    <div class="title panel note-paper">
      <h1>Guild Master</h1>
      <h3>Adventurer's guild management game</h3>
      <small>v{{ version }}</small>
      <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <h3>Loading assets...</h3>
    </div>
  </section>
  <header>
    <nav>
      <RouterLink
          :to="{name: 'guild'}"
      >
        Guild
      </RouterLink>
      <RouterLink
          :to="{name: 'quests'}"
      >
        Quests
      </RouterLink>
      <RouterLink
          :to="{name: 'adventurers'}"
      >
        Adventurers
      </RouterLink>
      <RouterLink
          data-tooltip="Technical information"
          data-tooltip-position="bottom"
          :to="{name: 'technical'}"
      >
        <img class="icon" src="/img/icons/cog.svg" alt="Technical">
      </RouterLink>
    </nav>
  </header>
  <RouterView
      :guild="guild"
      :adventurers="adventurers"
      :quests="missives"
      :adventurerForHire="adventurerForHire"
      @finalizeQuest="finalizeQuest($event)"
      @wipeSave="resetSave()"
      @recruitActionTaken="recruitAction($event)"
  />
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {Adventurer} from "@/classes/Adventurer";
import {getQuestWithRewards, Quest} from "@/classes/Quest";
import {Guild} from "@/classes/Guild";
import {getFromString, QuestRank} from "@/classes/QuestRank";
import {
  GameData,
  loadAdventurersForHire,
  loadAvailableQuests,
  loadGame,
  removeAlreadyHiredAdventurers,
  saveGame
} from "@/GameData";
import type {GuildUpgrade} from "@/classes/GuildUpgrade";
import AdventurerCapacityUpgrade from "@/classes/guildUpgrades/AdventurerCapacityUpgrade";
import {getNewAdventurerForHire} from "@/classes/Recruitment";
import QuestExpUpgrade from "@/classes/guildUpgrades/QuestExpUpgrade";
import QuestGoldUpgrade from "@/classes/guildUpgrades/QuestGoldUpgrade";
import AutoFinishQuestsUpgrade from "@/classes/guildUpgrades/AutoFinishQuestsUpgrade";

export default defineComponent({
  name: "GuildView",
  data: () => ({
    loading: true as boolean,
    guild: new Guild(1, 500),
    gameTickTask: null as null | number,
    gameSaveTask: null as null | number,
    lastQuestGot: {
      S: null as null | number,
      A: null as null | number,
      B: null as null | number,
      C: null as null | number,
      D: null as null | number,
      E: null as null | number,
      F: null as null | number,
    } as { [key: string]: null | number },
    lastRecruitHandled: null as null | number,
    adventurerForHire: null as Adventurer | null,
    adventurersDatabase: {} as Array<Adventurer>,
    adventurers: {} as { [key: string]: Adventurer },
    quests: {} as { [key: string]: { [key: string]: Quest } },
    missives: {
      F: {} as { [key: string]: Quest },
      E: {} as { [key: string]: Quest },
      D: {} as { [key: string]: Quest },
      C: {} as { [key: string]: Quest },
      B: {} as { [key: string]: Quest },
      A: {} as { [key: string]: Quest },
      S: {} as { [key: string]: Quest },
    } as { [key: string]: { [key: string]: Quest } },
  }),
  methods: {
    async updateMissives() {
      for (const missiveRank in this.missives) {
        const rank = getFromString(missiveRank as QuestRank);
        for (const missiveId in this.missives[rank.toString() as QuestRank]) {
          const missive = this.missives[rank.toString()][missiveId];
          if (missive.adventurers.length <= 0) {
            missive.progressPoints = 0;
            continue;
          }
          if (missive.progressPoints >= missive.maxProgress) {
            if (this.guild.autoFinishQuestsUpgrade.getRanksToAutoFinishQuestsIn().includes(rank)) {
              this.finalizeQuest(missive);
              continue;
            }
            continue;
          }
          for (const adventurerId in missive.adventurers) {
            const adventurer = missive.adventurers[adventurerId];
            const attack = adventurer.getAttack();
            missive.progressPoints = Math.min(missive.progressPoints + attack, missive.maxProgress);
          }
        }
      }

    },
    async checkForNewRecruit(currentTimestamp: number) {

      if (this.lastRecruitHandled == null) {
        this.lastRecruitHandled = 0;
      }

      if (Object.keys(this.adventurers).length <= 0) {
        this.adventurerForHire = this.adventurersDatabase[0];
      }

      if (currentTimestamp - this.lastRecruitHandled >= 1000 * 60 * 30 && this.adventurerForHire == null) {
        this.adventurerForHire = getNewAdventurerForHire(this.adventurersDatabase);
      }
    },
    recruitAction(adventurer: Adventurer | null): void {
      this.lastRecruitHandled = Number(new Date());
      this.adventurerForHire = null;
      if (adventurer === null) return;

      this.adventurers[adventurer.id] = adventurer;
      for (const id in this.adventurersDatabase) {
        const databaseAdventurer = this.adventurersDatabase[id];
        if (databaseAdventurer.id === adventurer.id) {
          this.adventurersDatabase.splice(Number(id), 1);
          break;
        }
      }
    },
    finalizeQuest(missive: Quest) {
      missive.progressPoints = 0;
      this.guild.gold += missive.goldReward;
      for (const adventurerId in missive.adventurers) {
        const adventurer = missive.adventurers[adventurerId];
        adventurer.addExp(missive.expReward / missive.adventurers.length);
        adventurer.busy = false;
      }
      missive.adventurers = [];
      delete this.missives[missive.rank.toString() as QuestRank][missive.id];
    },
    getRandomQuest(rank: QuestRank): Quest | null {
      const keys = Object.keys(this.quests[rank]);
      if (keys.length <= 0) return null;
      const questsForRank = this.quests[rank] as { [key: string]: Quest };
      const randomId = keys.length * Math.random() << 0;
      const randomIdString = keys[randomId] as string;
      return getQuestWithRewards(questsForRank[randomIdString], this.guild.expModifier.getModifier());
    },
    createMissive(questToAdd: Quest, rank: QuestRank) {
      const quest = JSON.parse(JSON.stringify(questToAdd));
      const newId = Math.random().toString(16).slice(2).toString();
      quest.id = newId;
      this.missives[rank][newId] = quest;
    },
    loadGame() {
      const saveData = loadGame();
      if (saveData === null) return;

      this.lastQuestGot = saveData.lastQuestGot;

      const guildUpgrades = {} as { [key: string]: GuildUpgrade };
      if (saveData.guild.adventurerCapacity) {
        guildUpgrades.adventurerCapacity = new AdventurerCapacityUpgrade(saveData.guild.adventurerCapacity.level);
      }
      if (saveData.guild.expModifier) {
        guildUpgrades.expModifier = new QuestExpUpgrade(saveData.guild.expModifier.level);
      }
      if (saveData.guild.goldModifier) {
        guildUpgrades.goldModifier = new QuestGoldUpgrade(saveData.guild.goldModifier.level);
      }
      if (saveData.guild.autoFinishQuestsUpgrade) {
        guildUpgrades.autoFinishQuestsUpgrade = new AutoFinishQuestsUpgrade(saveData.guild.autoFinishQuestsUpgrade.level);
      }

      this.guild = new Guild(saveData.guild.level, saveData.guild.gold, guildUpgrades);

      const adventurers = {} as { [key: string]: Adventurer };

      for (const id in saveData.adventurers) {
        const data = saveData.adventurers[id];
        try {
          const adventurer = new Adventurer(
              data.id,
              data.name,
              data.portrait,
              data.attackExponent ?? 1.1,
              data.level ?? 1,
              data.exp ?? 0,
              data.prestige ?? 0,
          );
          adventurer.busy = data.busy;
          adventurers[data.id] = adventurer;
        } catch (e) {
        }
      }
      this.adventurers = adventurers;

      const missives = {} as { [key: string]: { [key: string]: Quest } };

      for (const id in saveData.missives) {
        const missiveRank = {} as { [key: string]: Quest }
        for (const questId in saveData.missives[id]) {
          const data = saveData.missives[id][questId];
          const quest = new Quest(questId, getFromString(data.rank), data.title, data.text, data.maxProgress, data.expReward, data.goldReward);
          quest.progressPoints = data.progressPoints;
          if (data.adventurers.length > 0) {
            quest.adventurers.push(this.adventurers[data.adventurers[0].id])
          }
          missiveRank[questId] = quest;
        }
        missives[id] = missiveRank;
      }

      this.missives = missives;

      this.lastRecruitHandled = saveData.lastRecruitAction ?? 0;

      if (saveData.adventurerForHireId != null) {
        for (const id in this.adventurersDatabase) {
          const adventurer = this.adventurersDatabase[id];
          if (adventurer.id === saveData.adventurerForHireId) {
            this.adventurerForHire = adventurer;
            return;
          }
        }
      }
    },
    resetSave() {
      if (!confirm("You are about to wipe your save file. Are you sure?")) return;
      window.localStorage.removeItem("savedGame");
      window.location.reload();
    }
  },
  async mounted() {
    console.debug("Loading game data")
    const promises = await Promise.all([
      loadAvailableQuests(),
      loadAdventurersForHire(),
    ]);

    this.quests = promises[0] as { [key: string]: { [key: string]: Quest } };
    this.adventurersDatabase = promises[1] as Array<Adventurer>;
    console.debug("Game data loaded!")
    this.loadGame();
    this.adventurersDatabase = removeAlreadyHiredAdventurers(this.adventurersDatabase, this.adventurers);

    // Wait a second to make sure at least most images load in behind the loader
    setTimeout(() => {
      this.loading = false;
    }, 1000);

    this.gameSaveTask = Number(setInterval(() => {
      saveGame(new GameData({
        adventurers: this.adventurers,
        guild: this.guild,
        missives: this.missives,
        lastQuestGot: this.lastQuestGot,
        lastRecruitAction: this.lastRecruitHandled,
        adventurerForHireId: this.adventurerForHire?.id ?? null,
      }));
    }, 10 * 1000));


    this.gameTickTask = Number(setInterval(() => {
      this.updateMissives();

      const now = Number(new Date());

      this.checkForNewRecruit(now);

      for (const id in this.lastQuestGot) {
        const lastTime = this.lastQuestGot[getFromString(id as QuestRank)];
        if (lastTime === null) this.lastQuestGot[getFromString(id as QuestRank)] = 0;
      }

      if (Number(now) - Number(this.lastQuestGot.F) >= 12 * 1000) {
        this.lastQuestGot.F = now;
        const keys = Object.keys(this.missives[QuestRank.F]);
        if (keys.length >= 5) return;
        const quest = this.getRandomQuest(QuestRank.F);
        if (quest !== null) {
          this.createMissive(quest, QuestRank.F);
        }
      }

      if (this.guild.level < 2) return;
      if (Number(now) - Number(this.lastQuestGot.E) >= 20 * 1000) {
        this.lastQuestGot.E = now;
        const keys = Object.keys(this.missives[QuestRank.E]);
        if (keys.length >= 5) return;
        const quest = this.getRandomQuest(QuestRank.E);
        if (quest !== null) {
          this.createMissive(quest, QuestRank.E);
        }
      }

      if (this.guild.level < 3) return;
      if (Number(now) - Number(this.lastQuestGot.D) >= 50 * 1000) {
        this.lastQuestGot.D = now;
        const keys = Object.keys(this.missives[QuestRank.D]);
        if (keys.length >= 5) return;
        const quest = this.getRandomQuest(QuestRank.D);
        if (quest !== null) {
          this.createMissive(quest, QuestRank.D);
        }
      }

      if (this.guild.level < 4) return;
      if (Number(now) - Number(this.lastQuestGot.C) >= 2 * 60 * 1000) {
        this.lastQuestGot.C = now;
        const keys = Object.keys(this.missives[QuestRank.C]);
        if (keys.length >= 5) return;
        const quest = this.getRandomQuest(QuestRank.C);
        if (quest !== null) {
          this.createMissive(quest, QuestRank.C);
        }
      }

      if (this.guild.level < 5) return;
      if (Number(now) - Number(this.lastQuestGot.B) >= 2 * 60 * 1000) {
        this.lastQuestGot.B = now;
        const keys = Object.keys(this.missives[QuestRank.B]);
        if (keys.length >= 5) return;
        const quest = this.getRandomQuest(QuestRank.B);
        if (quest !== null) {
          this.createMissive(quest, QuestRank.B);
        }
      }

      if (this.guild.level < 6) return;
      if (Number(now) - Number(this.lastQuestGot.A) >= 5 * 60 * 1000) {
        this.lastQuestGot.A = now;
        const keys = Object.keys(this.missives[QuestRank.A]);
        if (keys.length >= 5) return;
        const quest = this.getRandomQuest(QuestRank.A);
        if (quest !== null) {
          this.createMissive(quest, QuestRank.A);
        }
      }

      if (this.guild.level < 6) return;
      if (Number(now) - Number(this.lastQuestGot.S) >= 30 * 60 * 1000) {
        this.lastQuestGot.S = now;
        const keys = Object.keys(this.missives[QuestRank.S]);
        if (keys.length >= 5) return;
        const quest = this.getRandomQuest(QuestRank.S);
        if (quest !== null) {
          this.createMissive(quest, QuestRank.S);
        }
      }

    }, 250));

  },
  beforeUnmount() {
    if (this.gameSaveTask) clearInterval(this.gameSaveTask);
    if (this.gameTickTask) clearInterval(this.gameTickTask);
  }
})
</script>

<style lang="scss" scoped>
header {
  line-height: 1;
  max-height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

nav {
  width: max-content;
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding-inline: 2rem;
  padding-bottom: 2rem;
  padding-top: 0.5rem;
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: bottom;
  background-image: url("/img/background/panels/wall_panel_empty.png");
  filter: drop-shadow(0 0 0.5rem rgba(0,0,0, 0.25));

  .icon {
    width: 2rem;
    height: 2rem;
    transform: translateY(0.35rem);
  }

  a {
    font-size: 2rem;
    color: #000;
    text-decoration: none;

    &.router-link-active {
      text-decoration: underline;
    }
  }

}

.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 5;
  user-select: none;
  background-size: 25rem;
  background-color: rgba(87, 50, 20, 0.45);
  background-image: url("/img/background/wood/cut_wood_background.png");
  background-blend-mode: darken;
  background-repeat: repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.25s linear;

  &.disabled {
    opacity: 0;
    pointer-events: none;
  }

  .lds-ring {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 64px;
    height: 64px;
    margin: 8px;
    border: 8px solid;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #000 transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
  }
  .lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}

</style>
