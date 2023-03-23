<template>
  <article
      class="adventurer"
      :title="adventurer.name + (adventurer.busy ? ' (busy)' : '')"
  >
    <img :src="adventurer.portrait" :alt="adventurer.name" draggable="false">
    <div class="level">{{adventurer.level}}</div>
    <div class="exp"></div>
  </article>
</template>

<script lang="ts">

import type {Adventurer} from "@/classes/Adventurer";
import {defineComponent, type PropType } from "vue";

export default defineComponent({
  name: "AdventurerTile",
  props: {
    adventurer: {
      type: Object as PropType<Adventurer>,
    }
  },
  data: () => ({
    expProgress: "0%",
  }),
  watch: {
    adventurer: {
      deep: true,
      handler: function (adventurer: Adventurer) {
        this.expProgress = adventurer.getExpPercentage() + "%";
      },
    }
  },
  mounted() {
    if (this.adventurer === undefined) return;
    this.expProgress = this.adventurer.getExpPercentage() + "%";
  }
});
</script>

<style lang="scss" scoped>
.adventurer {
  width: 100%;
  height: 100%;
  overflow: clip;
  font-size: 5rem;
  line-height: 1;
  color: rgba(0,0,0, 0.75);
  position: relative;
  .level {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 1rem;
    min-width: 1rem;
    background-color: rgba(0,0,0, 0.75);
    border-bottom-right-radius: 0.2rem;
    padding: 0.1rem;
    color: #fff;
  }
  .exp {
    position: absolute;
    bottom: 0;
    left: 0;
    width: v-bind(expProgress);
    height: 3.5%;
    background-color: rgba(203, 33, 213, 0.75);
    transition: width 1s linear;
  }
  img {
    width: 100%;
    height: 100%;
  }
}
</style>