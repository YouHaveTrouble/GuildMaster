<template>
  <main>
    <section class="title panel note-paper">
      <h1>Guild Master</h1>
      <h3>Adventurer's guild management game</h3>
      <small>v{{ version }}</small>
    </section>
    <section class="upgrades panel pinned-paper">
      <div class="nail top-left">
        <img src="/img/quests/overlays/nail.png" alt="" draggable="false"/>
      </div>
      <div class="nail top-right">
        <img src="/img/quests/overlays/nail.png" alt="" draggable="false"/>
      </div>
      <section class="coffer">
        <p>Coffer: {{ formatGold(guild.gold) }} gold</p>
      </section>
      <section class="upgrade">
        <p>Guild level: {{ guild.level }}</p>
        <button
            class="button metal"
            :disabled="guild.upgradeCost ? guild.gold < guild.upgradeCost : true"
            @click="guild.upgrade()"
        >
          <span>Upgrade guild level </span>
          <span>({{ guild.displayUpgradeCost }})</span>
        </button>
      </section>
      <section class="upgrade">
        <UpgradesList :guild="guild"/>
      </section>
      <section class="upgrade">
        <span class="wipe-save" @click="$emit('wipeSave')">Wipe your save data</span>
      </section>
    </section>

  </main>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import type {PropType} from "vue";
import {Guild} from "@/classes/Guild";

import {version} from "../../package.json"
import UpgradesList from "@/components/UpgradesList.vue";
import {formatGold} from "@/classes/NumberMagic";

export default defineComponent({
  name: "GuildView",
  methods: {formatGold},
  components: {UpgradesList},
  data: () => {
    return {
      version: version,
    }
  },
  props: {
    guild: {
      type: Object as PropType<Guild>,
      default: () => new Guild(1, 0) as Guild,
      required: true,
    },
  }
});
</script>

<style lang="scss">
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-block: 1rem;
  gap: 1rem;

  .upgrades {
    max-width: 45rem;
    width: 100%;
  }
}

.coffer {
  text-align: center;

  p {
    font-size: 1.5rem;
    font-weight: bold;
  }
}

.upgrade {
  text-align: center;

  .wipe-save {
    display: inline-flex;
    font-weight: bold;
    margin-block: 1rem;
    color: #d52121;
    cursor: pointer;
  }

  p {
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
  }
}

</style>
