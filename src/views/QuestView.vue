<template>
  <div class="guild" v-if="guild.level >= 7 && Object.keys(quests.S).length > 0">
    <h1>Rank S Quests</h1>
    <section class="missives">
      <QuestMissive
          v-for="missive in quests.S"
          :key="missive.id"
          :adventurers="adventurers"
          :missive="missive"
          @click="() => {
            if (missive.progressPoints < missive.maxProgress) return;
            $emit('finalizeQuest', missive)
          }"
      />
    </section>
  </div>
  <div class="guild" v-if="guild.level >= 6 && Object.keys(quests.A).length > 0">
    <h1>Rank A Quests</h1>
    <section class="missives">
      <QuestMissive
          v-for="missive in quests.A"
          :key="missive.id"
          :adventurers="adventurers"
          :missive="missive"
          @click="() => {
            if (missive.progressPoints < missive.maxProgress) return;
            $emit('finalizeQuest', missive)
          }"
      />
    </section>
  </div>
  <div class="guild" v-if="guild.level >= 5 && Object.keys(quests.B).length > 0">
    <h1>Rank B Quests</h1>
    <section class="missives">
      <QuestMissive
          v-for="missive in quests.B"
          :key="missive.id"
          :adventurers="adventurers"
          :missive="missive"
          @click="() => {
            if (missive.progressPoints < missive.maxProgress) return;
            $emit('finalizeQuest', missive)
          }"
      />
    </section>
  </div>
  <div class="guild" v-if="guild.level >= 4 && Object.keys(quests.C).length > 0">
    <h1>Rank C Quests</h1>
    <section class="missives">
      <QuestMissive
          v-for="missive in quests.C"
          :key="missive.id"
          :adventurers="adventurers"
          :missive="missive"
          @click="() => {
            if (missive.progressPoints < missive.maxProgress) return;
            $emit('finalizeQuest', missive)
          }"
      />
    </section>
  </div>
  <div class="guild" v-if="guild.level >= 3 && Object.keys(quests.D).length > 0">
    <h1>Rank D Quests</h1>
    <section class="missives">
      <QuestMissive
          v-for="missive in quests.D"
          :key="missive.id"
          :adventurers="adventurers"
          :missive="missive"
          @click="() => {
            if (missive.progressPoints < missive.maxProgress) return;
            $emit('finalizeQuest', missive)
          }"
      />
    </section>
  </div>
  <div class="guild" v-if="guild.level >= 2 && Object.keys(quests.E).length > 0">
    <h1>Rank E Quests</h1>
    <section class="missives">
      <QuestMissive
          v-for="missive in quests.E"
          :key="missive.id"
          :adventurers="adventurers"
          :missive="missive"
          @click="() => {
            if (missive.progressPoints < missive.maxProgress) return;
            $emit('finalizeQuest', missive)
          }"
      />
    </section>
  </div>
  <div class="guild" v-if="Object.keys(quests.F).length > 0">
    <h1>Rank F Quests</h1>
    <section class="missives">
      <QuestMissive
          v-for="missive in quests.F"
          :key="missive.id"
          :adventurers="adventurers"
          :missive="missive"
          @click="() => {
            if (missive.progressPoints < missive.maxProgress) return;
            $emit('finalizeQuest', missive)
          }"
      />
    </section>
  </div>

</template>

<script lang="ts">
import {defineComponent, type PropType} from "vue";
import AdventurerComponent from "@/components/AdventurerMiniComponent.vue";
import type {Adventurer} from "@/classes/Adventurer";
import type {Quest} from "@/classes/Quest";
import type {Guild} from "@/classes/Guild";
import QuestMissive from "@/components/QuestMissive.vue";

export default defineComponent({
  name: "QuestView",
  components: {QuestMissive, AdventurerComponent},
  props: {
    guild: {
      type: Object as PropType<Guild>,
    },
    adventurers: {
      type: Object as PropType<{ [key: string]: Adventurer }>,
      default() {
        return {};
      },
    },
    quests: {
      type: Object as PropType<{ [key: string]: Quest }>,
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
  data() {
    return {};
  },
  emits: [ 'finalizeQuest', 'wipeSave', 'recruitActionTaken'],
})
</script>

<style lang="scss" scoped>
.guild {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-bottom: 0.5rem;

  h1 {
    font-size: 3rem;
  }

  .missives {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: calc(100% - 2rem);
    justify-content: center;
    align-items: center;
    padding-inline: 1rem;
    gap: 1rem;
  }
}
</style>
