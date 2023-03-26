<template>
  <div class="slots">
    <button class="slot" v-for="adventurer in adventurers" :key="adventurer.id">
      <AdventurerMiniComponent
          :adventurer="currentAdventurer"
          :all-adventurers="adventurers"
      />
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent, type PropType} from "vue";
import AdventurerMiniComponent from "@/components/AdventurerMiniComponent.vue";
import type {Adventurer} from "@/classes/Adventurer";

export default defineComponent({
  name: "AdventurerList",
  components: {AdventurerMiniComponent},
  data: () => ({
    currentAdventurer: null as Adventurer|null
  }),
  props: {
    adventurers: {
      type: Object as PropType<{[key: string]: Adventurer}>,
      default() {
        return {} as {[key: string]: Adventurer};
      },
    },
  },

})
</script>

<style lang="scss" scoped>
.slots {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  .slot {
    padding: 0;
    width: 5rem;
    height: 5rem;
    border: 2px solid #000;
    background-color: rgba(0,0,0, 0.2);
    cursor: pointer;
    border-radius: 0.2rem;
  }
}
</style>