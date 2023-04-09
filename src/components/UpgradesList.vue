<template>
  <section class="upgrades">
    <h2>Upgrades</h2>
    <div class="upgrade">
      <span>Adventurer capacity (level {{ guild.adventurerCapacity.level }})</span>
      <button
          class="button metal"
          v-if="guild.adventurerCapacity.nextLevelCost"
          :disabled="guild.gold < guild.adventurerCapacity.nextLevelCost"
          @click="upgradeAdventurerCapacity()"
      >
        Upgrade ({{ formatGold(guild.adventurerCapacity.nextLevelCost) }} gold)
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
    }
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
    flex-direction: row;
    flex-wrap: wrap;
    width: min(25rem, 100%);
    justify-content: center;
    align-items: center;
    gap: 0.2rem;
  }
}
</style>