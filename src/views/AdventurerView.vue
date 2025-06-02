<template>
  <div class="adventurer-section">
    <AdventurerDetails
      :adventurer="selectedAdventurer"
      v-if="selectedAdventurer !== null"
      @closeButtonClicked="selectedAdventurer = null"
      :show-prestige-button="adventurers[selectedAdventurer?.id] !== undefined"
    />
    <AdventurerRecruitment
      :guild="guild"
      :adventurers-for-hire="adventurersForHire"
      :adventurers="adventurers"
      @hireAdventurer="$emit('hireAdventurer', $event)"
      @dismissAdventurer="$emit('dismissAdventurer', $event)"
      @previewAdventurer="selectedAdventurer = $event"
      @findNewRecruit="$emit('findNewRecruit')"
    />
    <section class="collection panel pinned-paper">
      <h1>
        Recruited adventurers ({{ Object.keys(adventurers).length }} /
        {{ guild.adventurerCapacity.getAdventurerCapacity() }})
      </h1>
      <small>Click an adventurer to see details about them</small>
      <div class="adventurers">
        <div
          class="adventurer-tile"
          v-for="adventurer in adventurers"
          :key="adventurer.id"
          @click="selectedAdventurer = adventurer"
        >
          <AdventurerTile class="entry" :adventurer="adventurer"/>
          <b>{{ adventurer.name }}</b>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import type {PropType} from "vue";
import {defineComponent} from "vue";
import AdventurerTile from "@/components/AdventurerTile.vue";
import type {Adventurer} from "@/classes/Adventurer";
import type {Guild} from "@/classes/Guild";
import AdventurerDetails from "@/components/AdventurerDetails.vue";
import AdventurerRecruitment from "@/components/AdventurerRecruitment.vue";

export default defineComponent({
  name: "AdventurerView",
  components: {AdventurerDetails, AdventurerTile, AdventurerRecruitment},
  data: () => {
    return {
      selectedAdventurer: null as Adventurer | null,
    }
  },
  props: {
    guild: {
      type: Object as PropType<Guild>,
      required: true,
    },
    adventurers: {
      type: Object as PropType<{ [key: string]: Adventurer }>,
      required: true,
    },
    adventurersForHire: {
      type: Object as PropType<{ [key: string]: Adventurer }>,
      default() {
        return {};
      }
    },
  },
  emits: ["hireAdventurer", "dismissAdventurer", "findNewRecruit"],

});
</script>

<style lang="scss" scoped>
.adventurer-section {
  padding-block: 1rem;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  section {
    text-align: center;
    padding: 1rem;
    width: calc(100% - 2rem);
    max-width: 45rem;
    margin: 0 auto;
  }

  h1 {
    font-size: 2rem;
    font-weight: bold;
    margin: 0;
  }

  .collection {
    small {
      font-size: 1rem;
      display: block;
      margin-bottom: 0.5rem;
    }
  }

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

  .hire-tile {
    width: 8rem;
    height: 8rem;
  }

}
</style>
