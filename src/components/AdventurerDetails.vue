<template>
  <dialog ref="modal" class="adventurer-details" v-if="adventurer">

      <div class="adventurer-portrait">
        <img :src="adventurer.portrait" alt="" draggable="false"/>
      </div>
      <span class="name">{{ adventurer.name }}</span>
      <div class="adventurer-data">
        <p>Level: {{ adventurer.level }} / {{ adventurer.getMaxLevel() }}</p>
        <p>Prestige level: {{ adventurer.prestige }}</p>

        <p>Exp: {{ adventurer.exp }} / {{ adventurer.getNextLevelExpRequirement()}}</p>
        <p>DPS: {{ adventurer.getDPS().toPrecision(2) }}</p>
      </div>

  </dialog>
</template>

<script lang="ts">
import type {Adventurer} from "@/classes/Adventurer";
import {defineComponent, type PropType} from "vue";

export default defineComponent({
  name: "AdventurerDetails",
  props: {
    adventurer: {
      type: Object as PropType<Adventurer|null>,
      default() {
        return null as Adventurer|null;
      },
      required: true,
    },
  },
  mounted() {
      const refs = this.$refs as any;
      refs.modal.showModal();
  },

});
</script>

<style lang="scss" scoped>
.adventurer-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 10rem;
  max-width: 45rem;
  background-image: url("/img/background/paper/small_tile_paper.png");
  background-position: center;
  background-size: cover;
  user-select: none;
  &::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .adventurer-portrait {
    width: 100%;
    max-width: 15rem;
    aspect-ratio: 1/1;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .name {
    display: flex;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    width: 100%;
  }
  .adventurer-data {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    font-size: 1.2rem;
    width: 100%;
    & > * {
      margin: 0;
      width: calc(50% - 1rem);
      text-align: center;
      padding-inline: 0.5rem;
    }
  }
}
</style>