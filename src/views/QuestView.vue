<template>
  <div class="guild">
    <h1>Rank F Quests</h1>
    <section class="missives">
      <div
          class="missive"
          :class="{done: missive.maxProgress <= missive.progressPoints}"
          v-for="missive in quests.F"
          :key="missive.id"
          @click="() => {
            if (missive.progressPoints < missive.maxProgress) return;
            $emit('finalizeQuest', missive)
          }"
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
      </div>
    </section>
  </div>
  <div class="guild" v-if="guild.level >= 2">
    <h1>Rank E Quests</h1>
    <section class="missives">
      <div
          class="missive"
          :class="{done: missive.maxProgress <= missive.progressPoints}"
          v-for="missive in quests.E"
          :key="missive.id"
          @click="() => {
            if (missive.progressPoints < missive.maxProgress) return;
            $emit('finalizeQuest', missive)
          }"
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
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import {defineComponent, type PropType} from "vue";
import AdventurerComponent from "@/components/AdventurerMiniComponent.vue";
import type {Adventurer} from "@/classes/Adventurer";
import type {Quest} from "@/classes/Quest";

export default defineComponent({
  name: "GuildView",
  components: {AdventurerComponent},
  props: {
    guild: {
      type: Object,
    },
    adventurers: {
      type: Object as PropType<{ [key: string]: Adventurer }>,
      default() {
        return {};
      },
    },
    quests: {
      type: Object as PropType<{ [key: string]: Quest }>,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  emits: [ 'finalizeQuest', 'wipeSave' ],
})
</script>

<style lang="scss" scoped>
.guild {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

  h1 {
    font-size: 3rem;
  }

  .missives {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: calc(100% - 2rem);
    justify-content: center;
    align-items: center;
    padding-inline: 1rem;
    gap: 1rem;

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
  }
}
</style>
