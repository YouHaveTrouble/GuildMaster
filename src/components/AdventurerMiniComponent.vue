<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
</script>

<template>
  <AdventurerTile
    v-if="adventurer"
    :adventurer="adventurer"
    @click="() => {
      $emit('freeAdventurer', adventurer.id)
    }"
  />
  <article
      class="select"
      v-else
      @click="() => {
        if (Object.keys(allAdventurers).length <= 0) return;
        selection = !selection;
      }"
  >
    <span>+</span>
  </article>
  <div class="selection" v-if="selection" v-on-click-outside="closeSelect">
    <button
        class="slot"
        v-for="adventurer in allAdventurers"
        :key="adventurer.id"
        :class="{busy: adventurer.busy}"
        @click="() => {
          if (adventurer.busy) return;
          $emit('hireAdventurer', adventurer.id);
          selection = false;
        }"
    >
      <AdventurerTile
        :adventurer="adventurer"
      />
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent, type PropType} from "vue";
import type {Adventurer} from "@/classes/Adventurer";
import AdventurerTile from "@/components/AdventurerTile.vue";

export default defineComponent({
  name: "AdventurerMiniComponent",
  components: {AdventurerTile},
  emits: [ "freeAdventurer", "hireAdventurer" ],
  data() {
    return {
      selection: false,
    }
  },
  props: {
    adventurer: {
      type: Object as PropType<Adventurer>,
    },
    allAdventurers: {
      type: Object as PropType<{[key: string]: Adventurer}>,
    },
  },
  methods: {
    print(a:string) {
      console.log(a);
    },
    closeSelect() {
      this.selection = false;
    }
  }
})
</script>

<style lang="scss" scoped>

.selection {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: max-content;
  max-width: 16rem;
  transform: translateX(-50%) translateY(104%);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: rgba(0,0,0, 0.2);
  z-index: 2;
  .slot {
    width: 5rem;
    height: 5rem;
    cursor: pointer;
    padding: 0;
    border-color: #000;
    background-color: transparent;
    background-blend-mode: darken;
    transition: background-color 0.25s linear, filter 0.25s linear;
    &.busy {
      filter: grayscale(1);
      background-color: rgba(0,0,0, 0.6);
      &:hover {
        cursor: not-allowed;
        border-color: #000;
      }
    }
    &:hover {
      border-color: #fff;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.select {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 4.5rem;
}
</style>