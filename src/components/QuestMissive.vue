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
    <div class="progressWrap">
      <span>{{ progressPercentage }}</span>
      <span class="progress"></span>

    </div>
    <h3>Rewards</h3>
    <div class="rewards">
      <span>Gold: <b>{{missive.goldReward}}</b></span>
      <span>Exp: <b>{{missive.expReward}}</b></span>
    </div>
  </article>
</template>

<script lang="ts">
import {Quest} from "@/classes/Quest";
import AdventurerComponent from "@/components/AdventurerMiniComponent.vue";
import type {Adventurer} from "@/classes/Adventurer";
import {defineComponent, type PropType} from "vue";
import {QuestRank} from "@/classes/QuestRank";

export default defineComponent({
  name: "QuestMissive",
  components: {AdventurerComponent},
  props: {
    missive: {
      type: Object as PropType<Quest|any>,
      default() {
        return new Quest("0", QuestRank.F, "", "", 1, 0, 0) as Quest;
      },
    },
    adventurers: {
      type: Object as PropType<{[key: string]: Adventurer}>,
      default() {
        return {} as {[key: string]: Adventurer};
      },
    },
  },
  data: () => {
    return {
      progressPercentage: "0%",
    }
  },
  methods: {
    updateProgress() {
      if (this.missive === undefined) return;
      const progress = (this.missive.progressPoints / this.missive.maxProgress * 100).toFixed(2);
      this.progressPercentage = `${progress}%`;
    }
  },
  mounted() {
    this.updateProgress();
  },
  watch: {
    missive: {
      handler() {
        this.updateProgress();
      },
      deep: true,
    }
  }
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
  h2 {
    font-size: 1.5rem;

  }
  h3 {
    font-size: 1.15rem;
    margin: 0;
  }

  .progressWrap {
    width: 80%;
    border: 1px solid #000;
    margin: 0.5rem auto;
    position: relative;
    .progress {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      display: block;
      width: v-bind(progressPercentage);
      background-color: rgba(0, 128, 0, 0.75);
      transition: width 250ms linear;
      z-index: -1;
    }
  }



  .rewards {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

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