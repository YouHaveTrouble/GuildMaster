<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Guild</RouterLink>
      <RouterLink to="/quests">Quests</RouterLink>
      <RouterLink to="/adventurers">Adventurers</RouterLink>
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
    lastQuestGot: {
      S: null as null|number,
      A: null as null|number,
      B: null as null|number,
      C: null as null|number,
      D: null as null|number,
      E: null as null|number,
      F: null as null|number,
    },
    adventurers: {
    } as { [key: string]: Adventurer },
    quests: {
      F: {
        "1": new Quest("1", QuestRank.F, "Frog Frenzy", "Kill 10 demon frogs.", 30, 1, 25),
        "2": new Quest("2", QuestRank.F, "Rats!", "Get rid of the rats in someone's basement.", 21, 1, 15),
        "3": new Quest("3", QuestRank.F, "Herb gethering", "Colect medicinal herbs.", 25, 1, 19),
        "4": new Quest("4", QuestRank.F, "Big pile of rubble", "Tavern collapsed. Again. Help clean up the debris.", 27, 1, 10),
      } as { [key: string]: Quest },
      E: {
        "1": new Quest("1", QuestRank.E, "Gnoblin subjegation", "Kill 3 gnoblins.", 500, 2, 30),
        "2": new Quest("2", QuestRank.E, "Phantom menace", "Exorcise ghosts out of someone's apartment.", 510, 2, 28),
        "3": new Quest("3", QuestRank.E, "Scratchy in peril", "Get Scratchy the cat from the tree safe to the ground.", 550, 2, 32),
      } as { [key: string]: Quest },
      D: {
        "1": new Quest("1", QuestRank.D, "Caravan escort", "Escort a merchant caravan.", 2000, 3, 47),
        "2": new Quest("2", QuestRank.D, "Rare ore", "Obtain laudanium ore for town's blacksmith.", 2200, 3, 54),
        "3": new Quest("3", QuestRank.D, "Demonic pests!", "Clear the fields from cabbage imps.", 2149, 3, 49),
      } as { [key: string]: Quest },
      C: {
        "1": new Quest("1", QuestRank.C, "Scratchy, the butcher", "Scratchy turned evil and is terrorizing its victims. Put a stop to it!", 7500, 5, 150),
        "2": new Quest("2", QuestRank.C, "Hobgnoblin subjegation", "Gnoblins evolved and are back for vengance.", 7600, 5, 150),
        "3": new Quest("3", QuestRank.C, "Holy", "Gnoblins summoned their machine god and it started going haywire on everything around it. Destroy it!", 7777, 5, 49),
      } as { [key: string]: Quest },
      B: {
        "1": new Quest("1", QuestRank.B, "Undead horde", "Due to the spillage of necromancy potion at nearby graveyard we now have an undead army on our doorstep.", 25000, 8, 200),
        "2": new Quest("2", QuestRank.B, "Runaway prisoner", "During the last prison guard strike a prisoner managed to escape. Bring them back to their cell.", 26000, 8, 210),
        "3": new Quest("3", QuestRank.B, "The aristocrats", "Royalty wants an escort for one of their carriages.", 25000, 8, 200),
      } as { [key: string]: Quest },
      A: {
        "1": new Quest("1", QuestRank.A, "Ogre king", "Ogres have chosen a new king through democratic vote. They all voted for the strongest ogre.", 100000, 12, 200),
        "2": new Quest("2", QuestRank.A, "Devilish dungeon", "New dungeon was discovered. It needs to be mapped and explored so lower rank adventurers can enter.", 100000, 12, 210),
        "3": new Quest("3", QuestRank.A, "Eater of Worlds", "A giant worm emerged from the ground and appears to be consuming the ground itself.", 100000, 12, 200),
      } as { [key: string]: Quest },
      S: {
        "1": new Quest("1", QuestRank.S, "The Demon King", "Demon King has awoken and is a threat to whole existence. Heroes needed.", 1000000, 20, 200),
        "2": new Quest("2", QuestRank.S, "Scratchy, Destruction Incarnate", "Scratchy was reborn as a machine of pure destruction and needs to be stopped.", 1000000, 20, 210),
        "3": new Quest("3", QuestRank.S, "Jiggly Jungle", "A jungle south began rapidly expanding and experts think arson is our only option.", 1000000, 20, 200),
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
          const missive = this.missives[rank.toString()][missiveId];
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
      console.debug("Saving game...");
      window.localStorage.setItem("savedGame", JSON.stringify({
        guild: this.guild,
        adventurers: this.adventurers,
        missives: this.missives,
        lastQuestGot: this.lastQuestGot,
      }));
    },
    loadGame() {
       const rawData = window.localStorage.getItem("savedGame");
       if (!rawData) return;
       const saveData = JSON.parse(rawData);

       this.lastQuestGot = saveData.lastQuestGot;

       this.guild = new Guild(saveData.guild.level, saveData.guild.gold);

       const adventurers = {} as { [key: string]: Adventurer };

       for (const id in saveData.adventurers) {
         const data = saveData.adventurers[id];
         const adventurer = new Adventurer(data.id, data.name, data.portrait, data.attackPerLevel, data.defensePerLevel, data.level);
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

    }, 1000);

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
