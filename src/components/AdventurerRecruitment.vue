<template>
  <section class="recruit panel pinned-paper">
    <h1>Applying adventurers
      {{ `(${Object.keys(adventurersForHire).length}/${guild.recruitmentCapacity.getRecruitmentCapacity()})` }}</h1>
    <div class="adventurers">
      <div class="adventurer-tile" v-for="adventurerForHire in currentlyForHire" :key="adventurerForHire.id">
        <adventurer-tile
          class="hire-tile"
          :adventurer="adventurerForHire"
          @click="previewAdventurer(adventurerForHire)"
        />
        <div class="decision">
          <span
            title="Hire"
            @click="hireAdventurer(adventurerForHire)"
            :class="{disabled: !canRecruitMore}"
          >
            ✔
          </span>
          <span
            :title="Object.keys(adventurersForHire).length > 0 ? 'Dismiss' : ''"
            :class="{disabled: Object.keys(adventurersForHire).length <= 0}"
            @click="dismissAdventurer(adventurerForHire)"
          >
            ✗
          </span>
        </div>
      </div>
      <div v-if="Object.keys(adventurersForHire).length == 0">
        <span>No one applied as of now. Check back later!</span>
      </div>
    </div>
    <div>
      <button
        class="button metal find-recruit"
        :disabled="recruitSlotsFilled || guild.gold < newRecruitCost"
        @click="findNewRecruit()"
      >Find a recruit now {{(`(${formatGold(newRecruitCost)}) gold`)}}</button>
    </div>
  </section>
</template>

<script lang="ts">

import {defineComponent, type PropType} from "vue";
import AdventurerTile from "@/components/AdventurerTile.vue";
import type {Guild} from "@/classes/Guild";
import type {Adventurer} from "@/classes/Adventurer";
import {formatGold} from "@/classes/NumberMagic";

export default defineComponent({
  name: "RecruitView",
  components: {AdventurerTile},
  computed: {
    currentlyForHire(): Array<Adventurer> {
      return Object.values(this.adventurersForHire);
    },
    canRecruitMore() {
      return Object.keys(this.adventurersForHire).length < this.guild.adventurerCapacity.getAdventurerCapacity();
    },
    newRecruitCost(): number {
      const guildLevel = this.guild.level;
      return Math.max(500, 500 * Math.pow(2.2, guildLevel - 1));
    },
    recruitSlotsFilled(): boolean {
      return Object.keys(this.adventurersForHire).length >= this.guild.recruitmentCapacity.getRecruitmentCapacity();
    }
  },
  methods: {
    formatGold,
    hireAdventurer(adventurer: Adventurer): void {
      if (!this.canRecruitMore) return;
      this.$emit("hireAdventurer", adventurer);
    },
    dismissAdventurer(adventurer: Adventurer) {
      if (Object.keys(this.adventurersForHire).length <= 0) return;
      this.$emit("dismissAdventurer", adventurer);
    },
    previewAdventurer(adventurer: Adventurer): void {
      this.$emit("previewAdventurer", adventurer);
    },
    findNewRecruit(): void {
      if (!this.canRecruitMore) return;
      this.$emit("findNewRecruit");
    },
  },
  props: {
    guild: {
      type: Object as PropType<Guild>,
      required: true,
    },
    adventurersForHire: {
      type: Object as PropType<{ [key: string]: Adventurer }>,
      required: true,
    },
  },
  emits: ["dismissAdventurer", "hireAdventurer", "previewAdventurer", "findNewRecruit"],
})
</script>

<style scoped lang="scss">

section {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
}

.find-recruit {
  text-wrap: wrap;
}

.adventurers {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  flex-wrap: nowrap;
  gap: 1rem;
  scroll-snap-type: x mandatory;
  overflow-x: scroll;
  width: 100%;
  min-height: 12rem;

  @media (min-width: 800px) {
    flex-wrap: wrap;
    justify-content: center;
    overflow-x: hidden;
    scroll-snap-type: none;
    width: auto;
  }

  .adventurer-tile {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 1.1rem;
    cursor: pointer;
    padding-block: 1rem;
    padding-inline: 0.5rem;
    min-width: 100%;
    scroll-snap-align: center;

    &:not(:first-of-type) {
      &::before {
        position: absolute;
        left: 0;
        top: 4rem;
        content: "⇠";
        width: 1rem;
        height: 1rem;
        line-height: 1;
      }
    }

    &:not(:last-of-type) {
      &::after {
        position: absolute;
        right: 0;
        top: 4rem;
        content: "⇢";
        width: 1rem;
        height: 1rem;
        line-height: 1;
      }
    }



    @media (min-width: 800px) {
      min-width: auto;
      scroll-snap-align: none;

      &::before {
        content: none !important;
      }

      &::after {
        content: none !important;
      }
    }

    .hire-tile {
      height: 7rem;
      width: 7rem;
    }

    b {
      line-height: 1;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
  }
}

.decision {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  gap: 1rem;
  line-height: 1;
  width: 100%;

  span {
    cursor: pointer;

    &:hover {
      color: #fff;
    }

    &.disabled {
      color: rgba(0, 0, 0, 0.5);
      cursor: default;
    }
  }
}
</style>
