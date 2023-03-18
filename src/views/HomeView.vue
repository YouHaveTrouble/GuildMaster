<template>
  <main>
    <section class="title">
      <h1>Guild Master</h1>
      <h3>Adventurer's guild management game</h3>
    </section>
    <section class="coffer">
      <p>Coffer: {{guild.gold}} gold</p>
    </section>
    <section class="upgrade">
      <p>Guild level: {{ guild.level }}</p>
      <button :disabled="guild.gold < 1000">
        <span>Upgrade guild level</span><br>
        <span>(1000 gold)</span>
      </button>
    </section>
  </main>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import type {PropType} from "vue";
import type {Guild} from "@/classes/Guild";

export default defineComponent({
  name: "GuildView",
  props: {
    guild: {
      type: Object as PropType<Guild>,
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
  p {
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
  }
}

</style>
