<template>
  <article
      class="missive"
      :class="{done: missive.maxProgress <= missive.progressPoints}"
  >
    <div class="parchment">
      <img src="/img/quests/backgrounds/dirty_paper.png" alt="parchment">
    </div>
    <div class="stain" v-if="stain">
      <img src="/img/quests/overlays/water_stain.png" alt="stain">
    </div>
    <div class="drink-stain" v-if="drinkStain.exists">
      <img src="/img/quests/overlays/drink_stain.png" alt="stain">
    </div>
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
      <span class="progress"></span>
      <span class="percentage">{{ progressPercentage }}</span>
    </div>
    <h3>Rewards</h3>
    <div class="rewards">
      <span>Gold: <b>{{ missive.goldReward }}</b></span>
      <span>Exp: <b>{{ missive.expReward }}</b></span>
    </div>
  </article>
</template>

<script lang="ts">
import type {Quest} from "@/classes/Quest";
import AdventurerComponent from "@/components/AdventurerMiniComponent.vue";
import type {Adventurer} from "@/classes/Adventurer";
import {defineComponent, type PropType} from "vue";

export default defineComponent({
  name: "QuestMissive",
  components: {AdventurerComponent},
  props: {
    missive: {
      type: Object as PropType<Quest | any>,
      default() {
        return {} as Quest;
      },
      required: true,
    },
    adventurers: {
      type: Object as PropType<{ [key: string]: Adventurer }>,
      default() {
        return {} as { [key: string]: Adventurer };
      },
      required: true,
    },
  },
  data: () => {
    return {
      progressPercentage: "0%",
      stain: false,
      drinkStain: {
        exists: false,
        offsetX: "0%",
        offsetY: "0%",
      },
    }
  },
  methods: {
    updateProgress() {
      if (this.missive === undefined) return;
      const progress = (this.missive.progressPoints / this.missive.maxProgress * 100).toFixed(2);
      this.progressPercentage = `${progress}%`;
    },
    randomNumber(min: number, max: number) {
      return Math.random() * (max - min) + min;
    },
  },
  mounted() {
    this.updateProgress();
    this.stain = Math.random() < 0.35;
    this.drinkStain.exists = Math.random() < 0.15;
    if (this.drinkStain.exists) {
      this.drinkStain.offsetX = `${this.randomNumber(-1, 1) * 100}%`;
      this.drinkStain.offsetY = `${this.randomNumber(-1, 1) * 100}%`;
    }
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

  .parchment {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -5;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  h2 {
    font-size: 1.5rem;
    line-height: 1;
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
    height: 1.25rem;

    .progress {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      display: block;
      width: v-bind(progressPercentage);
      background-color: rgba(0, 128, 0, 0.65);
      transition: width 250ms linear;
    }

    .percentage {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
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

  .stain {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: contain;
    opacity: 1;
    z-index: -4;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: grayscale(0.8);
    }
  }

  .drink-stain {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.45;
    z-index: -1;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 45%;
      height: 35%;
      filter: grayscale(0.8);
      transform: translate(v-bind("drinkStain.offsetX"), v-bind("drinkStain.offsetY"));
    }
  }
}
</style>