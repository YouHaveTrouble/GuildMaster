<template>
  <main>
    <section class="title">
      <h1>Guild Master</h1>
      <h3>Adventurer's guild management game</h3>
      <small>v{{version}}</small>
    </section>
    <section class="coffer">
      <p>Coffer: {{guild.gold}} gold</p>
    </section>
    <section class="upgrade">
      <p>Guild level: {{ guild.level }}</p>
      <button :disabled="guild.gold < guild.getUpgradeCost()" @click="guild.upgrade()">
        <span>Upgrade guild level</span><br>
        <span>({{ guild.displayUpgradeCost }})</span>
      </button>
    </section>
    <section class="upgrade">
      <span class="wipe-save" @click="$emit('wipeSave')">Wipe your save data</span>
    </section>
  </main>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import type {PropType} from "vue";
import {Guild} from "@/classes/Guild";

import {version} from "../../package.json"

export default defineComponent({
  name: "GuildView",
  data: () => {
    return {
      version: version,
    }
  },
  props: {
    guild: {
      type: Object as PropType<Guild>,
      default: () => new Guild(1, 0) as Guild,
    },
  }
});
</script>

<style lang="scss">
.title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2.5rem;
  text-align: center;

  gap: 0.5rem;
  h1 {
    font-size: 4rem;
    line-height: 0.75;

    margin: 0;
  }
  h3 {
    margin: 0;
    line-height: 0.9;
  }
  small {
    font-size: 0.9rem;
    font-weight: bold;
    line-height: 0.25;
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
