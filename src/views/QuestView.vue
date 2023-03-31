<template>
  <section>
    <div class="guild" v-if="guild.level >= 7 && Object.keys(quests.S).length > 0">
      <h1>Rank S Quests</h1>
      <section class="missives">
        <QuestMissive
            v-for="(missive, key, index) in quests.S"
            :key="key"
            :adventurers="adventurers"
            :missive="missive"
            @click="finalizeQuest(missive)"
        />
      </section>
    </div>
    <div class="guild" v-if="guild.level >= 6 && Object.keys(quests.A).length > 0">
      <h1>Rank A Quests</h1>
      <section class="missives">
        <QuestMissive
            v-for="(missive, key, index) in quests.A"
            :key="key"
            :adventurers="adventurers"
            :missive="missive"
            @click="finalizeQuest(missive)"
        />
      </section>
    </div>
    <div class="guild" v-if="guild.level >= 5 && Object.keys(quests.B).length > 0">
      <h1>Rank B Quests</h1>
      <section class="missives">
        <QuestMissive
            v-for="(missive, key, index) in quests.B"
            :key="key"
            :adventurers="adventurers"
            :missive="missive"
            @click="finalizeQuest(missive)"
        />
      </section>
    </div>
    <div class="guild" v-if="guild.level >= 4 && Object.keys(quests.C).length > 0">
      <h1>Rank C Quests</h1>
      <section class="missives">
        <QuestMissive
            v-for="(missive, key, index) in quests.C"
            :key="key"
            :adventurers="adventurers"
            :missive="missive"
            @click="finalizeQuest(missive)"
        />
      </section>
    </div>
    <div class="guild" v-if="guild.level >= 3 && Object.keys(quests.D).length > 0">
      <h1>Rank D Quests</h1>
      <section class="missives">
        <QuestMissive
            v-for="(missive, key, index) in quests.D"
            :key="key"
            :adventurers="adventurers"
            :missive="missive"
            @click="finalizeQuest((missive))"
        />
      </section>
    </div>
    <div class="guild" v-if="guild.level >= 2 && Object.keys(quests.E).length > 0">
      <h1>Rank E Quests</h1>
      <section class="missives">
        <QuestMissive
            v-for="(missive, key, index) in quests.E"
            :key="key"
            :adventurers="adventurers"
            :missive="missive"
            @click="finalizeQuest(missive)"
        />
      </section>
    </div>
    <div class="guild" v-if="Object.keys(quests.F).length > 0">
      <h1>Rank F Quests</h1>
      <section class="missives">
        <QuestMissive
            v-for="(missive, key, index) in quests.F"
            :key="key"
            :adventurers="adventurers"
            :missive="missive"
            @click="finalizeQuest(missive)"
        />
      </section>
    </div>
  </section>
</template>

<script lang="ts">
import {defineComponent, type PropType} from "vue";
import AdventurerComponent from "@/components/AdventurerMiniComponent.vue";
import type {Adventurer} from "@/classes/Adventurer";
import type {Quest} from "@/classes/Quest";
import {Guild} from "@/classes/Guild";
import QuestMissive from "@/components/QuestMissive.vue";

export default defineComponent({
  name: "QuestView",
  components: {QuestMissive, AdventurerComponent},
  props: {
    guild: {
      type: Object as PropType<Guild>,
      default() {
        return new Guild(1, 0);
      },
      required: true,
    },
    adventurers: {
      type: Object as PropType<{ [key: string]: Adventurer }>,
      default() {
        return {} as { [key: string]: Adventurer };
      },
      required: true,
    },
    quests: {
      type: Object as PropType<{ [key: string]: Quest }>,
      default() {
        return {} as { [key: string]: Quest };
      },
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
    text-align: center;
  }

  .missives {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: calc(100% - 2rem);
    justify-content: center;
    align-items: stretch;
    padding-inline: 1rem;
    gap: 1rem;
  }
}
</style>
