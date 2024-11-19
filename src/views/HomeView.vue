<template>
  <main>
    <section class="title panel note-paper">
      <h1>Guild Master</h1>
      <h3>Adventurer's guild management game</h3>
      <small>v{{ version }}</small>
      <p class="news">{{ news }}</p>
    </section>
  </main>
</template>

<script lang="ts">
import {defineComponent} from "vue";

import {version} from "../../package.json"

export default defineComponent({
  name: "GuildView",
  methods: {},
  components: {},
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
  }
});
</script>

<style lang="scss">


</style>
