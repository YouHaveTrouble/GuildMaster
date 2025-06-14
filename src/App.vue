<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
// @ts-ignore
import {version} from "@/../package.json";
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
    :adventurersForHire="adventurersForHire"
    :news="news"
    @finalizeQuest="finalizeQuest($event)"
    @hireAdventurer="recruitAdventurer($event)"
    @dismissAdventurer="dismissRecruit($event)"
    @findNewRecruit="() => {
      const newAdventurerForHire = getNewAdventurerForHire(Object.values(adventurersDatabase), Object.values(adventurers));
      if (newAdventurerForHire === null) return;
      adventurersForHire[newAdventurerForHire.id] = newAdventurerForHire;
      setNextRecruitArrival(new Date().getTime())
    }"
  />
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {Adventurer} from "@/classes/Adventurer";
import {getQuestWithRewards, Quest} from "@/classes/quests/Quest";
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
import RecruitmentCapacityUpgrade from "@/classes/guildUpgrades/RecruitmentCapacityUpgrade";

export default defineComponent({
  name: "GuildView",
  data: () => ({
    loading: true as boolean,
    screenWakeLock: null as null | WakeLockSentinel,
    guild: new Guild(1, 500),
    gameTickTask: null as null | number,
    gameSaveTask: null as null | number,
    news: "" as string,
    lastQuestGot: {
      S: null as null | number,
      A: null as null | number,
      B: null as null | number,
      C: null as null | number,
      D: null as null | number,
      E: null as null | number,
      F: null as null | number,
    } as { [key: string]: null | number },
    adventurersForHire: {} as { [key: string]: Adventurer },
    adventurersDatabase: {} as { [key: string]: Adventurer },
    allAdventurers: {} as { [key: string]: Adventurer },
    adventurers: {} as { [key: string]: Adventurer },
    quests: {} as { [key: string]: { [key: string]: Quest } },
    missives: [] as Array<Quest>,
    nextRecruitArrival: new Date() as Date,
    tickCounter: 0 as number,
  }),
  computed: {
    recruitmentSlotsFull(): boolean {
      return Object.keys(this.adventurersForHire).length >= this.guild.recruitmentCapacity.getRecruitmentCapacity();
    },
  },
  methods: {
    async updateMissives() {
      for (const missive of this.missives) {
        if (missive.adventurers.length < missive.maxAdventurers) {
          missive.progressPoints = 0;
          continue;
        }
        for (const adventurerId in missive.adventurers) {
          const adventurer = missive.adventurers[adventurerId];
          const attack = adventurer.getAttack();
          adventurer.busy = true;
          missive.progressPoints = Math.min(missive.progressPoints + attack, missive.maxProgress);
        }
        if (
          missive.progressPoints >= missive.maxProgress
          && this.guild.autoFinishQuestsUpgrade.getRanksToAutoFinishQuestsIn().includes(missive.rank)
        ) {
          this.finalizeQuest(missive);
        }
      }

    },
    async checkForNewRecruit(currentTimestamp: number, cooldownModifier: number = 1) {
      const recruitCapacity = this.guild.recruitmentCapacity.getRecruitmentCapacity();

      if (Object.keys(this.adventurersForHire).length >= recruitCapacity) return;

      const deltaTime = this.nextRecruitArrival.getTime() - currentTimestamp;
      if (deltaTime > 0) return; // not yet time for a new recruit

      if (Object.keys(this.adventurers).length <= 0) {
        const firstAdventurer = this.adventurersDatabase["aldek"];
        this.adventurersForHire[firstAdventurer.id] = firstAdventurer;
        this.setNextRecruitArrival(currentTimestamp, cooldownModifier)
        return;
      }

      const newAdventurerForHire = getNewAdventurerForHire(Object.values(this.adventurersDatabase), Object.values(this.adventurers));
      if (newAdventurerForHire === null) return;
      this.adventurersForHire[newAdventurerForHire.id] = newAdventurerForHire;

      this.setNextRecruitArrival(currentTimestamp, cooldownModifier)
    },
    setNextRecruitArrival(currentTimestamp: number, cooldownModifier: number = 1): void {
      const timerValue = ((5 + (Math.random() * 15)) * 60 * 1000) * cooldownModifier;
      this.nextRecruitArrival = new Date(currentTimestamp + timerValue);
    },
    recruitAdventurer(adventurer: Adventurer): void {
      if (adventurer == null) return;
      if (this.recruitmentSlotsFull) this.setNextRecruitArrival(new Date().getTime())
      this.adventurers[adventurer.id] = adventurer;
      delete this.adventurersForHire[adventurer.id];
      delete this.adventurersDatabase[adventurer.id];
    },
    dismissRecruit(adventurer: Adventurer): void {
      if (adventurer == null) return;
      if (this.recruitmentSlotsFull) this.setNextRecruitArrival(new Date().getTime())
      if (this.adventurersForHire[adventurer.id] == null) return;
      delete this.adventurersForHire[adventurer.id];
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
      const missiveIndex = this.missives.indexOf(missive);
      if (missiveIndex > -1) {
        this.missives.splice(missiveIndex, 1);
      }
    },
    getRandomQuest(rank: QuestRank): Quest | null {
      const keys = Object.keys(this.quests[rank]);
      if (keys.length <= 0) return null;
      const questsForRank = this.quests[rank] as { [key: string]: Quest };
      const randomId = keys.length * Math.random() << 0;
      const randomIdString = keys[randomId] as string;
      return getQuestWithRewards(questsForRank[randomIdString], this.guild.expModifier.getModifier(), this.guild.goldModifier.getModifier());
    },
    createMissive(questToAdd: Quest) {
      const quest = JSON.parse(JSON.stringify(questToAdd));
      quest.id = Math.random().toString(16).slice(2).toString();
      this.missives.push(quest);
    },
    loadGame() {
      const saveData = loadGame();
      if (saveData === null) return;

      this.lastQuestGot = saveData.lastQuestGot;

      const guildUpgrades = {} as { [key: string]: GuildUpgrade };
      if (saveData.guild.adventurerCapacity) {
        guildUpgrades.adventurerCapacity = new AdventurerCapacityUpgrade(saveData.guild.adventurerCapacity.level);
      }
      if (saveData.guild.recruitmentCapacity) {
        guildUpgrades.recruitmentCapacity = new RecruitmentCapacityUpgrade(saveData.guild.recruitmentCapacity.level);
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
        let portrait: string = "";

        const adventurer = this.allAdventurers[data.id];
        if (adventurer) {
          portrait = adventurer.portrait;
        }

        try {
          adventurers[data.id] = new Adventurer(
            data.id,
            data.name,
            portrait,
            data.attackExponent ?? 1.1,
            data.level ?? 1,
            data.exp ?? 0,
            data.prestige ?? 0,
          );
        } catch (e) {
        }
      }
      this.adventurers = adventurers;

      if (Array.isArray(saveData.missives)) {
        for (const data of saveData.missives) {
          const quest = new Quest(data.id, getFromString(data.rank), data.title, data.text, data.maxProgress, data.expReward, data.goldReward);
          quest.progressPoints = data.progressPoints;
          if (data.adventurers.length > 0) {
            for (const adventurer of data.adventurers) {
              const adventurerId = adventurer.id;
              if (this.adventurers[adventurerId] == null) continue;
              quest.adventurers.push(this.adventurers[adventurerId]);
            }
          }
          this.missives.push(quest)
        }
      }

      this.nextRecruitArrival = saveData.nextRecruitArrival ? new Date(saveData.nextRecruitArrival) : new Date();

      const recruits = {} as { [key: string]: Adventurer };

      for (const id in saveData.adventurersForHire) {
        const data = saveData.adventurersForHire[id];
        let portrait: string = "";

        const adventurer = this.allAdventurers[data.id];
        if (adventurer) {
          portrait = adventurer.portrait;
        }

        try {
          recruits[data.id] = new Adventurer(
            data.id,
            data.name,
            portrait,
            data.attackExponent ?? 1.1,
            data.level ?? 1,
            data.exp ?? 0,
            data.prestige ?? 0,
          );
        } catch (e) {
        }
      }
      this.adventurersForHire = recruits;
    },
    async updateNews() {
      const result = await fetch("https://raw.githubusercontent.com/YouHaveTrouble/GuildMaster/master/news.txt").catch(() => {
        return null;
      });
      if (result === null) return;
      this.news = await result.text();
    }
  },
  async mounted() {

    setInterval(async () => {
      if (this.screenWakeLock) return;
      try {
        this.screenWakeLock = await navigator.wakeLock.request("screen");
        console.debug("Screen wake lock acquired");
      } catch (e) {
      }
    }, 1000);

    console.debug("Loading game data")
    const promises = await Promise.all([
      loadAvailableQuests(),
      loadAdventurersForHire(),
    ]);

    this.updateNews().then(() => {
      setInterval(() => {
        this.updateNews();
      }, 1000 * 60 * 60);
    });

    this.quests = promises[0] as { [key: string]: { [key: string]: Quest } };
    this.adventurersDatabase = promises[1] as { [key: string]: Adventurer };
    for (const adventurerId in this.adventurersDatabase) {
      const adventurer = this.adventurersDatabase[adventurerId];
      this.allAdventurers[adventurer.id] = new Adventurer(adventurer.id, adventurer.name, adventurer.portrait, adventurer.attackExponent, adventurer.level, adventurer.exp, adventurer.prestige);
    }

    console.debug("Game data loaded!")
    this.loadGame();
    this.adventurersDatabase = removeAlreadyHiredAdventurers(this.adventurersDatabase, this.adventurers);

    if (Object.keys(this.adventurers).length > 0 && Object.keys(this.adventurersForHire).length < this.guild.recruitmentCapacity.getRecruitmentCapacity()) {
      // check if more time passed than next recruit arrival and simulate next recruit arrivals up to now
      const now = new Date();
      if (this.nextRecruitArrival.getTime() < now.getTime()) {
        const slotsLeft = this.guild.recruitmentCapacity.getRecruitmentCapacity() - Object.keys(this.adventurersForHire).length;
        for (let i = 0; i < slotsLeft; i++) {
          await this.checkForNewRecruit(this.nextRecruitArrival.getTime());
        }
      }
    }

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
        adventurersForHire: this.adventurersForHire ?? null,
        nextRecruitArrival: this.nextRecruitArrival,
      }));
    }, 10 * 1000));

    this.gameTickTask = Number(setInterval(() => {
      this.tickCounter++;
      this.updateMissives();

      const now = Number(new Date());

      if (this.tickCounter % 8 === 0) this.checkForNewRecruit(now);

      for (const id in this.lastQuestGot) {
        const lastTime = this.lastQuestGot[getFromString(id as QuestRank)];
        if (lastTime === null) this.lastQuestGot[getFromString(id as QuestRank)] = 0;
      }

      if (Number(now) - Number(this.lastQuestGot.F) >= 12 * 1000) {
        this.lastQuestGot.F = now;
        const currentQuestAmount = this.missives.filter(quest => quest.rank === QuestRank.F).length;
        if (currentQuestAmount >= 5) return;
        const quest = this.getRandomQuest(QuestRank.F);
        if (quest !== null) this.createMissive(quest);
      }

      if (this.guild.level < 2) return;
      if (Number(now) - Number(this.lastQuestGot.E) >= 20 * 1000) {
        this.lastQuestGot.E = now;
        const currentQuestAmount = this.missives.filter(quest => quest.rank === QuestRank.E).length;
        if (currentQuestAmount >= 5) return;
        const quest = this.getRandomQuest(QuestRank.E);
        if (quest !== null) this.createMissive(quest);
      }

      if (this.guild.level < 3) return;
      if (Number(now) - Number(this.lastQuestGot.D) >= 50 * 1000) {
        this.lastQuestGot.D = now;
        const currentQuestAmount = this.missives.filter(quest => quest.rank === QuestRank.D).length;
        if (currentQuestAmount >= 5) return;
        const quest = this.getRandomQuest(QuestRank.D);
        if (quest !== null) this.createMissive(quest);
      }

      if (this.guild.level < 4) return;
      if (Number(now) - Number(this.lastQuestGot.C) >= 2 * 60 * 1000) {
        this.lastQuestGot.C = now;
        const currentQuestAmount = this.missives.filter(quest => quest.rank === QuestRank.C).length;
        if (currentQuestAmount >= 5) return;
        const quest = this.getRandomQuest(QuestRank.C);
        if (quest !== null) this.createMissive(quest);
      }

      if (this.guild.level < 5) return;
      if (Number(now) - Number(this.lastQuestGot.B) >= 2 * 60 * 1000) {
        this.lastQuestGot.B = now;
        const currentQuestAmount = this.missives.filter(quest => quest.rank === QuestRank.B).length;
        if (currentQuestAmount >= 5) return;
        const quest = this.getRandomQuest(QuestRank.B);
        if (quest !== null) this.createMissive(quest);
      }

      if (this.guild.level < 6) return;
      if (Number(now) - Number(this.lastQuestGot.A) >= 3 * 60 * 1000) {
        this.lastQuestGot.A = now;
        const currentQuestAmount = this.missives.filter(quest => quest.rank === QuestRank.A).length;
        if (currentQuestAmount >= 5) return;
        const quest = this.getRandomQuest(QuestRank.A);
        if (quest !== null) this.createMissive(quest);
      }

      if (this.guild.level < 6) return;
      if (Number(now) - Number(this.lastQuestGot.S) >= 5 * 60 * 1000) {
        this.lastQuestGot.S = now;
        const currentQuestAmount = this.missives.filter(quest => quest.rank === QuestRank.S).length;
        if (currentQuestAmount >= 5) return;
        const quest = this.getRandomQuest(QuestRank.S);
        if (quest !== null) this.createMissive(quest);
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
  background-image: url("data:image/jpeg;base64,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");
  filter: drop-shadow(0 0 0.5rem rgba(0, 0, 0, 0.25));

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
  background-size: cover;
  background-position: center;
  background-image: url("/img/promo/chicken_mage.jpg");
  background-repeat: no-repeat;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  transition: opacity 0.25s linear;

  .title {
    margin-block: 2.5%;
    margin-inline: 2.5%;
  }

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
