<template>
  <div class="adventurer-section">
    <AdventurerDetails
        :adventurer="selectedAdventurer"
        v-if="selectedAdventurer !== null"
        @closeButtonClicked="selectedAdventurer = null"

    />
    <section class="recruit panel pinned-paper">
      <h1>Applying adventurers</h1>
      <div class="adventurers">
        <div v-if="adventurerForHire">
          <adventurer-tile class="hire-tile" :adventurer="adventurerForHire"/>
          <div class="decision">
          <span
              title="Hire"
              @click="hireAdventurer()"
              :class="{disabled: Object.keys(adventurers).length >= guild.adventurerCapacity.getAdventurerCapacity()}"
          >
            ✔
          </span>
            <span
                :title="Object.keys(adventurers).length > 0 ? 'Dismiss' : ''"
                :class="{disabled: Object.keys(adventurers).length <= 0}"
                @click="dismissAdventurer()"
            >
            ✗
          </span>
          </div>
        </div>
        <div v-else>
          <span>Noone applied as of now. Check back later!</span>
        </div>

      </div>
    </section>
    <section class="collection panel pinned-paper">
      <h1>
        Recruited adventurers ({{ Object.keys(adventurers).length }} / {{ guild.adventurerCapacity.getAdventurerCapacity() }})
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

export default defineComponent({
  name: "RecruitView",
  components: {AdventurerDetails, AdventurerTile},
  data: () => {
    return {
      currentlyForHire: null as Adventurer | null,
      adventurersForHire: [] as Array<Adventurer>,
      selectedAdventurer: null as Adventurer | null,
    }
  },
  props: {
    guild: {
      type: Object as PropType<Guild>,
      default() {
        return {} as Guild
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
    adventurerForHire: {
      type: Object as PropType<Adventurer | null>,
      default() {
        return null;
      }
    },
  },
  methods: {
    hireAdventurer(): void {
      if (Object.keys(this.adventurers).length >= this.guild.adventurerCapacity.getAdventurerCapacity()) return;
      this.$emit("recruitActionTaken", this.adventurerForHire);
    },
    dismissAdventurer() {
      if (Object.keys(this.adventurers).length <= 0) return;
      this.$emit("recruitActionTaken", null);
    }
  },
  async mounted() {

  },
  emits: ["recruitActionTaken"]

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
