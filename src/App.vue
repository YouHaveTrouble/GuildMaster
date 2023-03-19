<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Guild</RouterLink>
      <RouterLink to="/quests">Quests</RouterLink>
    </nav>
  </header>

    <RouterView
        :guild="guild"
        :adventurers="adventurers"
        :quests="missives"
        @finalizeQuest="finalizeQuest($event)"
        @wipeSave="resetSave()"
    />
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {Adventurer} from "@/classes/Adventurer";
import {Quest} from "@/classes/Quest";
import {Guild} from "@/classes/Guild";
import {getFromString, QuestRank} from "@/classes/QuestRank";

export default defineComponent({
  name: "GuildView",
  watch: {
    adventurers: {
      deep: true,
      handler(newAdventurers) {
        for (const adventurerId in newAdventurers) {
          const adventurer = newAdventurers[adventurerId] as Adventurer;
          if (adventurer.canLevelUp()) {
            adventurer.levelUp();
          }
        }
      }
    }
  },
  data: () => ({
    guild: new Guild(1, 500),
    adventurers: {
      "1": new Adventurer("1", "Rincewind", "/img/adventurers/rincewind.png", 2, 2),
      "2": new Adventurer("2", "Fran", "/img/adventurers/fran.png", 3, 1.5),

    } as { [key: string]: Adventurer },
    quests: {
      F: {
        "1": new Quest("1", QuestRank.F, "Frog Frenzy", "Kill 10 demon frogs.", 30, 1, 25),
        "2": new Quest("2", QuestRank.F, "Rats!", "Get rid of the rats in someone's basement.", 21, 1, 15),
        "3": new Quest("3", QuestRank.F, "Herb gethering", "Colect medicinal herbs.", 25, 1, 19),
      } as { [key: string]: Quest },
      E: {
        "1": new Quest("1", QuestRank.F, "Frog Frenzy", "Kill 10 demon frogs.", 30, 1, 25),
        "2": new Quest("2", QuestRank.F, "Rats!", "Get rid of the rats in someone's basement.", 21, 1, 15),
        "3": new Quest("3", QuestRank.F, "Herb gethering", "Colect medicinal herbs.", 25, 1, 19),
      } as { [key: string]: Quest },
    } as { [key: string]: { [key: string]: Quest } },
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
          const missive = this.missives.F[missiveId];
          if (missive.adventurers.length <= 0) {
            missive.progressPoints = 0;
            continue;
          }
          for (const adventurerId in missive.adventurers) {
            const adventurer = missive.adventurers[adventurerId];
            const attack = adventurer.attackPerLevel * adventurer.level;
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
        adventurer.exp += (missive.expReward / missive.adventurers.length);
        adventurer.busy = false;
      }
      missive.adventurers = [];
      console.log(missive.rank, missive.rank.toString(), missive.id)
      delete this.missives[missive.rank.toString() as QuestRank][missive.id];
    },
    getRandomQuest(rank: QuestRank): Quest | null {
      const keys = Object.keys(this.quests[rank]);
      if (keys.length <= 0) return null;
      const questsForRank = this.quests[rank] as { [key: string]: Quest };
      const randomId = keys.length * Math.random() << 0;
      const randomIdString = keys[randomId] as string;
      return questsForRank[randomIdString];
    },
    createMissive(questToAdd: Quest, rank: QuestRank) {
      const quest = JSON.parse(JSON.stringify(questToAdd));
      const newId = Math.random().toString(16).slice(2).toString();
      quest.id = newId;
      this.missives[rank][newId] = quest;
    },
    saveGame() {
      console.debug("Saving game...")
      window.localStorage.setItem("savedGame", JSON.stringify({
        guild: this.guild,
        adventurers: this.adventurers,
        missives: this.missives,
      }));
    },
    loadGame() {
       const rawData = window.localStorage.getItem("savedGame");
       if (!rawData) return;
       const saveData = JSON.parse(rawData);
       this.guild = saveData.guild;

       const adventurers = {} as { [key: string]: Adventurer };

       for (const id in saveData.adventurers) {
         const data = saveData.adventurers[id];
         const adventurer = new Adventurer(data.id, data.name, data.portrait, data.attackPerLevel, data.defensePerLevel);
         adventurer.busy = data.busy;
         adventurers[data.id] = adventurer;
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
    },
    resetSave() {
      if (!confirm("You are about to wipe your save file. Are you sure?")) return;
      window.localStorage.removeItem("savedGame");
      window.location.reload();
    }
  },
  mounted() {
    this.loadGame();

    setInterval(() => {
      this.saveGame();
    }, 30*1000)

    setInterval(() => {
      this.updateMissives();
    }, 1000);

    setInterval(() => {
      const keys = Object.keys(this.missives[QuestRank.F]);
      if (keys.length >= 5) return;
      const quest = this.getRandomQuest(QuestRank.F);
      if (quest !== null) {
        this.createMissive(quest, QuestRank.F);
      }
    }, 10000);
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
  gap: 1rem;
  padding: 2rem;
  background-size: 200px;
  background-blend-mode: darken;
  background-color: rgba(0, 0, 0, 0.65);

  a {
    font-size: 2rem;
    color: #fff;
  }

  &.router-link-exact-active {

  }
}

</style>
