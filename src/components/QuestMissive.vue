<template>
  <article
      class="missive"
      :class="{done: missive.maxProgress <= missive.progressPoints}"
  >
    <h2>{{ missive.title }}</h2>
    <p>{{ missive.text }}</p>
    <div class="slots">
      <button class="slot">
        <AdventurerComponent
            :adventurer="missive.adventurers[0]"
            :all-adventurers="adventurers"
            @hire-adventurer="(id) => {
                adventurers[id].busy = true;
                missive.adventurers[0] = adventurers[id];
              }"
            @free-adventurer="(id) => {
                if (missive.progressPoints >= missive.maxProgress) return;
                adventurers[id].busy = false;
                missive.adventurers.splice(0, 1);
                if (missive.adventurers.length <= 0) {
                  missive.progressPoints = 0;
                }
              }"
        />
      </button>
    </div>
    <progress :max="missive.maxProgress" :value="missive.progressPoints"></progress>
  </article>
</template>

<script lang="ts">
import type { Quest } from "@/classes/Quest";
import AdventurerComponent from "@/components/AdventurerMiniComponent.vue";
import type { Adventurer } from "@/classes/Adventurer";
import {defineComponent, type PropType} from "vue";

export default defineComponent({
  name: "QuestMissive",
  components: {AdventurerComponent},
  props: {
    missive: {
      type: Object as PropType<Quest>,
    },
    adventurers: {
      type: Object as PropType<{[key: string]: Adventurer}>,
    },
  },
});
</script>

<style lang="scss" scoped>
.missive {
  width: min(100%, 14rem);
  text-align: center;
  border: 2px solid #000;
  padding: 0.5rem;
  position: relative;
  background-color: rgba(255, 255, 255, 0.2);

  &.done {
    cursor: pointer;

    &::after {
      position: absolute;
      top: 0;
      right: 0;
      content: "✔";
      font-size: 5rem;
      color: green;
      transform: translate(45%, -40%);
    }
  }

  .slots {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    .slot {
      padding: 0;
      width: 5rem;
      height: 5rem;
      border: 2px solid #000;
      background-color: rgba(0, 0, 0, 0.2);
      cursor: pointer;
      border-radius: 0.2rem;
      position: relative;
    }
  }
}
</style>