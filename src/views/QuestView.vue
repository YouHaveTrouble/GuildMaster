<template>
  <section>
    <QuestGroup
        :adventurers="adventurers"
        :quests="quests.filter(quest => quest.getProgress() < quest.getMaxProgress())"
        :finalizeQuest="finalizeQuest"
        label="Quests"
        v-show="quests.filter(quest => quest.getProgress() < quest.getMaxProgress()).length > 0"
    />
    <QuestGroup
      :finalize-quest="finalizeQuest"
      :adventurers="adventurers"
      :quests="quests.filter(quest => quest.getProgress() >= quest.getMaxProgress())"
      label="Completed Quests"
      v-show="quests.filter(quest => quest.getProgress() >= quest.getMaxProgress()).length > 0"
    />
  </section>
</template>

<script lang="ts">
import {defineComponent, type PropType} from "vue";
import AdventurerComponent from "@/components/AdventurerMiniComponent.vue";
import type {Adventurer} from "@/classes/Adventurer";
import type {Quest} from "@/classes/quests/Quest";
import {Guild} from "@/classes/Guild";
import QuestMissive from "@/components/QuestMissive.vue";
import QuestGroup from "@/components/QuestGroup.vue";

export default defineComponent({
  name: "QuestView",
  components: {QuestGroup, QuestMissive, AdventurerComponent},
  props: {
    guild: {
      type: Object as PropType<Guild>,
      required: true,
    },
    adventurers: {
      type: Object as PropType<{ [key: string]: Adventurer }>,
      required: true,
    },
    quests: {
      type: Object as PropType<Array<Quest>>,
      required: true,
    },
    lastRecruitTime: {
      type: Number as PropType<number>,
      default() {
        return 0;
      }
    },
  },
  emits: ['finalizeQuest', 'wipeSave', 'recruitActionTaken'],
  methods: {
    // This is a workaround for vue not reporting Quest as Quest in v-for
    finalizeQuest(quest: any | Quest): void {
      if (quest.progressPoints < quest.maxProgress) return;
      this.$emit('finalizeQuest', quest)
    },
  }
});
</script>

<style lang="scss" scoped>
section {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding-bottom: 0.5rem;
}

@media(min-width: 800px) {
  section {
    flex-direction: column-reverse;
  }
}

</style>
