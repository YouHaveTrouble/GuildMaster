<template>
  <section>
    <QuestGroup
        v-if="guild.level >= 7 && Object.keys(quests.S).length > 0"
        :adventurers="adventurers"
        :quests="quests.S"
        :finalizeQuest="finalizeQuest"
        label="Rank S Quests"
    />
    <QuestGroup
        v-if="guild.level >= 6 && Object.keys(quests.A).length > 0"
        :adventurers="adventurers"
        :quests="quests.A"
        :finalizeQuest="finalizeQuest"
        label="Rank A Quests"
    />
    <QuestGroup
        v-if="guild.level >= 5 && Object.keys(quests.B).length > 0"
        :adventurers="adventurers"
        :quests="quests.B"
        :finalizeQuest="finalizeQuest"
        label="Rank B Quests"
    />

    <QuestGroup
        v-if="guild.level >= 4 && Object.keys(quests.C).length > 0"
        :adventurers="adventurers"
        :quests="quests.C"
        :finalizeQuest="finalizeQuest"
        label="Rank C Quests"
    />

    <QuestGroup
        v-if="guild.level >= 3 && Object.keys(quests.D).length > 0"
        :adventurers="adventurers"
        :quests="quests.D"
        :finalizeQuest="finalizeQuest"
        label="Rank D Quests"
    />
    <QuestGroup
        v-if="guild.level >= 2 && Object.keys(quests.E).length > 0"
        :adventurers="adventurers"
        :quests="quests.E"
        :finalizeQuest="finalizeQuest"
        label="Rank E Quests"
    />
    <QuestGroup
        v-if="Object.keys(quests.F).length > 0"
        :adventurers="adventurers"
        :quests="quests.F"
        :finalizeQuest="finalizeQuest"
        label="Rank F Quests"
    />
  </section>
</template>

<script lang="ts">
import {defineComponent, type PropType} from "vue";
import AdventurerComponent from "@/components/AdventurerMiniComponent.vue";
import type {Adventurer} from "@/classes/Adventurer";
import type {Quest} from "@/classes/Quest";
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
      type: Object as PropType<{ [key: string]: Quest }>,
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
.guild {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-bottom: 0.5rem;
}

</style>
