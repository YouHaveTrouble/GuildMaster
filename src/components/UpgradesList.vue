<template>
  <section class="upgrades">
    <h2>Upgrades</h2>
    <div class="upgrade">
      <span>Adventurer capacity (level {{ guild.adventurerCapacity.level }})</span>
      <small>Increases the maximum amount of recruited adventurers</small>
      <button
          class="button metal"
          v-if="guild.adventurerCapacity.nextLevelCost"
          :disabled="guild.gold < guild.adventurerCapacity.nextLevelCost"
          @click="upgradeAdventurerCapacity()"
      >
        Upgrade ({{ formatGold(guild.adventurerCapacity.nextLevelCost) }} gold)
      </button>
    </div>
    <div class="upgrade" v-if="guild.level >= guild.expModifier.guildLevelRequirement">
      <span>Quest exp modifier (level {{ guild.expModifier.level }})</span>
      <small>Increases exp from newly offered quests by 10% per level</small>
      <button
          class="button metal"
          v-if="guild.expModifier.nextLevelCost"
          :disabled="guild.gold < guild.expModifier.nextLevelCost"
          @click="upgradeQuestExpModifier()"
      >
        Upgrade ({{ formatGold(guild.expModifier.nextLevelCost) }} gold)
      </button>
    </div>
    <div class="upgrade" v-if="guild.level >= guild.goldModifier.guildLevelRequirement">
      <span>Quest gold modifier (level {{ guild.goldModifier.level }})</span>
      <small>Increases gold from newly offered quests by 10% per level</small>
      <button
          class="button metal"
          v-if="guild.goldModifier.nextLevelCost"
          :disabled="guild.gold < guild.goldModifier.nextLevelCost"
          @click="upgradeQuestGoldModifier()"
      >
        Upgrade ({{ formatGold(guild.goldModifier.nextLevelCost) }} gold)
      </button>
    </div>
  </section>
</template>

<script lang="ts">
import {Guild} from "@/classes/Guild";
import {defineComponent, type PropType} from "vue";
import {formatGold} from "@/classes/NumberMagic";

export default defineComponent({
  name: "UpgradesList",
  props: {
    guild: {
      type: Object as PropType<Guild>,
      default() {
        return new Guild(1, 0) as Guild;
      },
      required: true,
    }
  },
  methods: {
    formatGold,
    upgradeAdventurerCapacity(): void {
      if (!this.guild.adventurerCapacity) return;
      if (!this.guild.adventurerCapacity.nextLevelCost) return;
      if (this.guild.gold < this.guild.adventurerCapacity.nextLevelCost) return;
      this.guild.gold -= this.guild.adventurerCapacity.nextLevelCost;
      this.guild.adventurerCapacity.upgrade();
    },
    upgradeQuestExpModifier(): void {
      if (!this.guild.expModifier) return;
      if (!this.guild.expModifier.nextLevelCost) return;
      if (this.guild.gold < this.guild.expModifier.nextLevelCost) return;
      this.guild.gold -= this.guild.expModifier.nextLevelCost;
      this.guild.expModifier.upgrade();
    },
    upgradeQuestGoldModifier(): void {
      if (!this.guild.goldModifier) return;
      if (!this.guild.goldModifier.nextLevelCost) return;
      if (this.guild.gold < this.guild.goldModifier.nextLevelCost) return;
      this.guild.gold -= this.guild.goldModifier.nextLevelCost;
      this.guild.goldModifier.upgrade();
    },
  }
});
</script>

<style lang="scss" scoped>
.upgrades {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  h2 {
    font-size: 1.75rem;
    margin: 2rem 0 0;
    padding: 0;
  }

  .upgrade {
    text-align: center;
    font-size: 1.25rem;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    width: min(25rem, 100%);
    justify-content: center;
    align-items: center;
    gap: 0.2rem;
    small {
      font-weight: normal;
      line-height: 1;
    }
  }
}
</style>