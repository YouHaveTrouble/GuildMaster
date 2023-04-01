<template>
  <main class="guild-view">
    <section class="title">
      <h1>Guild Master</h1>
      <h3>Adventurer's guild management game</h3>
      <small>v{{ version }}</small>
    </section>
    <section class="coffer">
      <p>Coffer: {{guild.gold}} gold</p>
    </section>
    <section class="upgrade">
      <p>Guild level: {{ guild.level }}</p>
      <button class="upgrade-button" :disabled="guild.upgradeCost ? guild.gold < guild.upgradeCost : true" @click="guild.upgrade()">
        <span>Upgrade guild level</span><br>
        <span>({{ guild.displayUpgradeCost }})</span>
      </button>
    </section>
    <section class="upgrades">
      <UpgradesList :guild="guild" />
    </section>
    <section class="wipe">
      <span class="wipe-save" @click="$emit('wipeSave')">Wipe your save data</span>
    </section>

  </main>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import type {PropType} from "vue";
import {Guild} from "@/classes/Guild";

import {version} from "../../package.json"
import UpgradesList from "@/components/UpgradesList.vue";

export default defineComponent({
  name: "GuildView",
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
.guild-view {
  background-color: #f5f5f5;
  padding: 2rem;
  background-image: url("https://wallpaperaccess.com/full/628286.jpg");
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

.title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  text-align: center;
  width: 100%;
  max-width: 45rem;
  gap: 0.5rem;

  h1 {
    font-size: 5rem;
    line-height: 0.75;
    margin: 0;
    font-family: 'Roboto', sans-serif;
    color: #292929;
    text-shadow: 2px 2px 4px #a6a6a6;
  }

  h3 {
    margin: 0;
    line-height: 0.9;
    font-family: 'Roboto', sans-serif;
    color: #292929;
    text-shadow: 2px 2px 4px #a6a6a6;
  }

  small {
    font-size: 1rem;
    font-weight: bold;
    line-height: 0.25;
    font-family: 'Roboto', sans-serif;
    color: #292929;
    text-shadow: 2px 2px 4px #a6a6a6;
  }
}

.coffer {
  text-align: center;
  margin-bottom: 2rem;
  p {
    font-size: 2rem;
    font-weight: bold;
    font-family: 'Roboto', sans-serif;
    color: #292929;
    text-shadow: 2px 2px 4px #a6a6a6;
  }
}

.upgrade {
  text-align: center;
  margin-bottom: 2rem;
  p {
    font-size: 1.5rem;
    font-weight: bold;
    font-family: 'Roboto', sans-serif;
    color: #292929;
    text-shadow: 2px 2px 4px #a6a6a6;
  }
  .upgrade-button {
    background-color: #00b3e3;
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    padding: 0.5rem 2rem;
    border-radius: 1rem;
    border: none;
    box-shadow: 2px 2px 4px #a6a6a6;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    
    &:hover {
      background-color: #008CBA;
      box-shadow: 2px 2px 8px #a6a6a6;
    }
  }
}
.upgrades 
  h2[data-v-fa2248b8] {
    font-size: 1.5rem;
    font-weight: bold;
    font-family: 'Roboto', sans-serif;
    color: #292929;
    text-shadow: 2px 2px 4px #a6a6a6;
}
  .upgrade[data-v-fa2248b8] {
    font-size: 1.5rem;
    font-weight: bold;
    font-family: 'Roboto', sans-serif;
    color: #292929;
    text-shadow: 2px 2px 4px #a6a6a6;
}
  button:disabled {
    background-color: #00b3e3;
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    padding: 0.5rem 2rem;
    border-radius: 1rem;
    border: none;
    box-shadow: 2px 2px 4px #a6a6a6;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    
    &:hover {
      background-color: #008CBA;
      box-shadow: 2px 2px 8px #a6a6a6;
    }
  }
</style>