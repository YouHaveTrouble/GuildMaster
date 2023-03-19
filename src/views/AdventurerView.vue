<template>
<div class="adventurer-section">
  <section class="recruit">
    <h1>Applying to recruit</h1>
    <div class="adventurers">
      <div v-if="currentlyForHire">
        <adventurer-tile :adventurer="currentlyForHire"/>
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
        new Adventurer("rincewind-diskworld", "Rincewind", "/img/adventurers/rincewind.png", 2, 2),
        new Adventurer("fran-sword-isekai", "Fran", "/img/adventurers/fran.png", 3, 1.5),
        new Adventurer("kazuma-konosuba", "Kazuma", "/img/adventurers/kazuma.png", 2, 2),
        new Adventurer("rein-beast-tamer", "Rein", "/img/adventurers/rein.png", 2, 2),
        new Adventurer("momon-overlord", "Momon", "/img/adventurers/momon.png", 2, 2),
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

    }
  },
  mounted() {
    this.currentlyForHire = this.adventurersForHire[0]
  }

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

}
</style>