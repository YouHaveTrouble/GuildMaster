<template>
  <div class="changelog">
    <h1>Changelog</h1>
    <div class="changelog-entry" v-for="release in releases">
      <h2>Version {{ release.name }}</h2>
      <pre>{{ release.body }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";


export default defineComponent({
  name: "ChangelogComponent",
  data: () => ({
    releases: [] as Array<any>,
    lastPage: 1,
  }),
  methods: {
    async getReleases(page: number): Promise<void> {
      const result = await fetch("https://api.github.com/repos/YouHaveTrouble/GuildMaster/releases?per_page=10")
          .catch((e) => {
            return null;
          });

      if (result === null) return;
      const json = await result.json();


      for (const release of json) {
        const version = {} as any;
        version.body = release.body.trim();
        version.name = release.name;
        if (release.body.length === 0) continue;
        this.releases.push(version);
      }
    }
  },
  async mounted() {
    this.getReleases(1);

  }
});
</script>

<style lang="scss" scoped>
.changelog {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  max-width: 45rem;
  h1 {
    font-size: 3rem;
    line-height: 1;
    margin: 0;
    text-align: center;
  }
  .changelog-entry {
    width: 100%;
    h2 {
      margin: 0;
    }
    pre {
      line-height: 1.2;
      margin: 0;
      white-space: pre-wrap;
      font-family: 'EB Garamond', serif;
    }
  }
}
</style>