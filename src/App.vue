<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'</script>

<template>
  <header>
    <nav>
      <RouterLink :to="{ name: 'guild' }">Guild</RouterLink>
      <RouterLink :to="{ name: 'quests' }">Quests</RouterLink>
      <RouterLink :to="{ name: 'adventurers' }">Adventurers</RouterLink>
      <RouterLink :to="{ name: 'technical' }">
        <img class="icon" src="/img/icons/cog.svg" alt="Technical">
      </RouterLink>
    </nav>
  </header>
  <RouterView
    :guild="guild"
    :adventurers="adventurers"
    :quests="missives"
    :lastRecruitTime="lastRecruitHandled"
    @finalizeQuest="finalizeQuest($event)"
    @wipeSave="resetSave()"
    @recruitActionTaken="lastRecruitHandled = Number(new Date())"
  />
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {Adventurer} from "@/classes/Adventurer";
import {getQuestWithRewards, Quest} from "@/classes/Quest";
import {Guild} from "@/classes/Guild";
import {getFromString, QuestRank} from "@/classes/QuestRank";
import {GameData, loadAvailableQuests, loadGame, saveGame} from "@/GameData";
import type {GuildUpgrade} from "@/classes/GuildUpgrade";
import {AdventurerCapacityUpgrade} from "@/classes/guildUpgrades/AdventurerCapacityUpgrade";

export default defineComponent({
  name: "GuildView",
  data: () => ({
    guild: new Guild(1, 500),
    lastQuestGot: {
      S: null as null|number,
      A: null as null|number,
      B: null as null|number,
      C: null as null|number,
      D: null as null|number,
      E: null as null|number,
      F: null as null|number,
    } as { [key: string]: null|number },
    lastRecruitHandled: null as null|number,
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
          if (missive.progressPoints >= missive.maxProgress) continue;
          for (const adventurerId in missive.adventurers) {
            const adventurer = missive.adventurers[adventurerId];
            const attack = adventurer.getAttack();
            missive.progressPoints = Math.min(missive.progressPoints + attack, missive.maxProgress);
          }
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
      return getQuestWithRewards(questsForRank[randomIdString]);
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
               data.exp ?? 0
           );
           adventurer.busy = data.busy;
           adventurers[data.id] = adventurer;
         } catch (e) {}
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
    },
    resetSave() {
      if (!confirm("You are about to wipe your save file. Are you sure?")) return;
      window.localStorage.removeItem("savedGame");
      window.location.reload();
    }
  },
  async mounted() {
    this.loadGame();
    this.quests = await loadAvailableQuests();

    setInterval(() => {
      saveGame(new GameData(
          this.guild,
          this.adventurers,
          this.missives,
          this.lastQuestGot,
          this.lastRecruitHandled
          )
      );
    }, 10*1000)

    setInterval(() => {
      this.updateMissives();

      const now = Number(new Date());

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

    }, 250);

  }
})
</script>

<style lang="scss" scoped>
  header {
    position: relative;
    height: 8rem;
    background-color: rgba(87, 50, 20, 0.75) url(/img/background/panels/plaster.png) repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  nav {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
    background-color: rgba(87, 50, 20, 0.75);
    border-radius: 1rem 1rem 0 0;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(1rem);
    z-index: 1;
    transition: transform 0.3s ease-in-out;
    &:hover {
      transform: translate(-50%, -1rem);
    }
    .icon {
      width: 2rem;
      height: 2rem;
      fill: white;
      filter: invert(1);
      transform: translateY(0.35rem);
      transition: transform 0.3s ease-in-out;
    }
    a {
      font-size: 2rem;
      color: #fff;
      text-decoration: none;
      transition: color 0.3s ease-in-out;
      &.router-link-active {
        text-decoration: underline;
      }
      &:hover {
        color: #f1c40f;
      }
    }
  }
</style>


