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
  </section>
</template>

<script lang="ts">

import {defineComponent, type PropType} from "vue";
import AdventurerTile from "@/components/AdventurerTile.vue";
import type {Guild} from "@/classes/Guild";
import type {Adventurer} from "@/classes/Adventurer";

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
  },
  methods: {
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
  emits: ["dismissAdventurer", "hireAdventurer", "previewAdventurer"],
})
</script>

<style scoped lang="scss">
.adventurers {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  .adventurer-tile {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 1.1rem;
    cursor: pointer;
    padding-block: 1rem;
    padding-inline: 0.5rem;

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
