<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Guild</RouterLink>
      <RouterLink to="/quests">Quests</RouterLink>
    </nav>
  </header>

  <RouterView :guild="guild" :adventurers="adventurers" :quests="quests"/>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {Adventurer} from "@/classes/Adventurer";
import {Quest} from "@/classes/Quest";
import {Guild} from "@/classes/Guild";

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
        "1": new Quest("1", "Frog Frenzy", "Kill 10 demon frogs.", 30, 1),
        "2": new Quest("2", "Rats!", "Get rid of the rats in someone's basement.", 21, 1),
        "3": new Quest("3", "Herb gethering", "Colect medicinal herbs.", 25, 1),

      } as { [key: string]: Quest },
    } as { [key: string]: { [key: string]: Quest } },
  }),
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
