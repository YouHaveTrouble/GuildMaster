<template>
  <main>
    <section class="title panel note-paper">
      <h1>Guild Master</h1>
      <h3>Adventurer's guild management game</h3>
      <small>v{{ version }}</small>
      <p class="news">{{ news }}</p>
    </section>
    <section class="upgrades panel pinned-paper">
      <div class="nail top-left">
        <Nail/>
      </div>
      <div class="nail top-right">
        <Nail/>
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
import Nail from "@/components/misc/Nail.vue";

export default defineComponent({
  name: "GuildView",
  methods: {formatGold},
  components: {Nail, UpgradesList},
  data: () => {
    return {
      version: version,
    }
  },
  props: {
    news: {
      type: String,
      default: "",
    },
    guild: {
      type: Object as PropType<Guild>,
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
    padding-bottom: 1rem;
  }
}

.news {
  max-width: 75%;
  color: #ab0707;
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
