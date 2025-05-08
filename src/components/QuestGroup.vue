<template>
  <div class="missives-wrapper">
    <h1 v-if="label !== undefined">{{ label }}</h1>
    <section class="missives">
      <QuestMissive
          v-for="(missive, key) in quests"
          :key="key"
          :adventurers="adventurers"
          :missive="missive"
          @click="finalizeQuest(missive)"
      />
    </section>
  </div>

</template>

<script lang="ts">
import {defineComponent} from 'vue'
import QuestMissive from "@/components/QuestMissive.vue";

export default defineComponent({
  name: "QuestGroup",
  components: {QuestMissive},
  props: {
    quests: {
      type: Object,
      required: true,
    },
    adventurers: {
      type: Object,
      required: true,
    },
    finalizeQuest: {
      type: Function,
      required: true,
    },
    label: {
      type: String,
      default: undefined,
    }
  },
})
</script>

<style scoped lang="scss">

h1 {
  text-align: center;
}

.missives-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.missives {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  gap: 1rem;
  padding-block: 0.5rem;
  padding-inline: 5rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  width: 100vw;
  max-width: 100%;
}

@media(min-width: 800px) {
  .missives-wrapper {
    padding-inline: 1rem;
    max-width: 100vw;
    overflow-x: hidden;
  }

  .missives {
    display: grid;
    padding-inline: 0;
    max-width: 1200px;
    grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
    grid-auto-rows: auto;
    gap: 1rem;

  }
}
</style>