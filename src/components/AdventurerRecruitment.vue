<template>
  <section class="recruit panel pinned-paper">
    <h1>Applying adventurers</h1>
    <div class="adventurers">
      <div v-for="adventurerForHire in currentlyForHire" :key="adventurerForHire.id">
        <div class="adventurer-tile">
          <adventurer-tile class="hire-tile" :adventurer="adventurerForHire"/>
          <div class="decision">
          <span
            title="Hire"
            @click="hireAdventurer(adventurerForHire)"
            :class="{disabled: Object.keys(adventurersForHire).length >= guild.adventurerCapacity.getAdventurerCapacity()}"
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

      </div>
      <div v-if="Object.keys(adventurersForHire).length == 0">
        <span>Noone applied as of now. Check back later!</span>
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
  },
  methods: {
    hireAdventurer(adventurer: Adventurer): void {
      if (Object.keys(this.adventurersForHire).length >= this.guild.adventurerCapacity.getAdventurerCapacity()) return;
      this.$emit("hireAdventurer", adventurer);
    },
    dismissAdventurer(adventurer: Adventurer) {
      if (Object.keys(this.adventurersForHire).length <= 0) return;
      this.$emit("dismissAdventurer", adventurer);
    }
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
  emits: ["dismissAdventurer", "hireAdventurer"],
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

    .entry {
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
