<template>
<div class="adventurer-section">
  <section class="recruit">
    <h1>Applying adventurers</h1>
    <div class="adventurers">
      <div v-if="currentlyForHire">
        <adventurer-tile class="hire-tile" :adventurer="currentlyForHire"/>
        <div class="decision">
          <span
              title="Hire"
              @click="hireAdventurer(currentlyForHire)"
          >
            ✔
          </span>
          <span
              title="Dismiss"
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
  <section class="collection">
    <h1>Recruited adventurers</h1>
    <div class="adventurers">
      <div class="adventurer-tile" v-for="adventurer in adventurers" :key="adventurer.id">
        <AdventurerTile class="entry" :adventurer="adventurer" />
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
import {Adventurer} from "@/classes/Adventurer";

export default defineComponent({
  name: "RecruitView",
  components: {AdventurerTile},
  data() {
    return {
      currentlyForHire: null as Adventurer|null,
      adventurersForHire: [
        new Adventurer("rincewind-diskworld", "Rincewind", "/img/adventurers/rincewind.png", 2),
        new Adventurer("fran-sword-isekai", "Fran", "/img/adventurers/fran.png", 3),
        new Adventurer("kazuma-konosuba", "Kazuma", "/img/adventurers/kazuma.png", 2),
        new Adventurer("rein-beast-tamer", "Rein", "/img/adventurers/rein.png", 2),
        new Adventurer("momon-overlord", "Momon", "/img/adventurers/momon.png", 2),
      ] as Array<Adventurer>,
    }
  },
  props: {
    adventurers: {
      type: Object as PropType<{ [key: string]: Adventurer }>,
      default() {
        return {};
      },
    },
    lastRecruitTime: {
      type: Number as PropType<null|number>,
      default() {
        return null;
      }
    },
  },
  methods: {
    getRandomAdventurer(): Adventurer|null {
      if (this.adventurersForHire.length <= 0) return null;
      const randomId = this.adventurersForHire.length * Math.random() << 0;
      return this.adventurersForHire[randomId];
    },
    getNewAdventurerForHire(): void {
      const adventurer = this.getRandomAdventurer();
      if (adventurer === null) {
        this.currentlyForHire = null;
        return;
      }

      if (this.adventurers[adventurer.id] != null) {
        this.currentlyForHire = null;
        return;
      }

      this.currentlyForHire = adventurer;
      window.localStorage.setItem("currentlyForHire", adventurer.id);

    },
    hireAdventurer(adventurer: Adventurer): void {
      this.adventurers[adventurer.id] = adventurer;
      this.currentlyForHire = null;
      window.localStorage.removeItem("currentlyForHire");
      this.$emit("recruitActionTaken", adventurer);
    },
    dismissAdventurer() {
      if (Object.keys(this.adventurers).length <= 0) return;
      this.currentlyForHire = null;
      this.$emit("recruitActionTaken", null);
      window.localStorage.removeItem("currentlyForHire");
    }
  },
  mounted() {
    if (Object.keys(this.adventurers).length <= 0) {
      this.currentlyForHire = this.adventurersForHire[0];
      window.localStorage.setItem("currentlyForHire", this.adventurersForHire[0].id);
      return;
    }

    const savedCurrentForHire = window.localStorage.getItem("currentlyForHire");
    if (savedCurrentForHire !== null) {
      for (const id in this.adventurersForHire) {
        const adventurer = this.adventurersForHire[id];
        if (adventurer.id === savedCurrentForHire) {
          this.currentlyForHire = adventurer;
          return;
        }
      }
    }

    const now = Number(new Date());

    if (now - this.lastRecruitTime >= 1000 * 60 * 30 && this.currentlyForHire === null) {
      this.getNewAdventurerForHire();
    }

  },
  emits: ["recruitActionTaken"]

});
</script>

<style lang="scss" scoped>
.adventurer-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  section {
    max-width: 1280px;
    width: 100%;
    text-align: center;
    padding-block: 1rem;
  }
  h1 {
    font-size: 2rem;
    font-weight: bold;
    margin: 0;
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
        color: rgba(0,0,0, 0.5)
      }
    }
  }
  .hire-tile {
    width: 8rem;
    height: 8rem;
  }

}
</style>