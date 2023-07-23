<template>
  <div class="changelog panel pinned-paper">
    <div class="nail top-left">
      <Nail/>
    </div>
    <div class="nail top-right">
      <Nail/>
    </div>
    <h1>Changelog</h1>
    <div class="changelog-entry" v-for="release in releases">
      <hr>
      <h2><span>Version {{ release.name }}</span><small class="date">{{ timeFormat.format(release.createdAt) }}</small></h2>
      <pre>{{ release.body }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Nail from "@/components/misc/Nail.vue";


export default defineComponent({
  name: "ChangelogComponent",
  components: {Nail},
  data: () => ({
    timeFormat: Intl.DateTimeFormat(Intl.DateTimeFormat().resolvedOptions().locale, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }),
    releases: [] as Array<{body: string, name: string, createdAt: Date}>,
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
        version.createdAt = new Date(release.published_at);
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
  padding-block: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  max-width: 45rem;
  width: 100%;

  h1 {
    font-size: 3rem;
    line-height: 1;
    margin: 0;
    text-align: center;
  }

  .changelog-entry {
    width: 100%;

    h2 {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: flex-end;
      margin: 0;
      padding-inline: 1rem;
      gap: 0.5rem;
    }

    .date {
      color: rgba(0,0,0, 0.6);
      font-size: 1rem;
    }

    hr {
      border: 0;
      width: calc(100% - 2rem);
      border-bottom: 1px solid black;
    }

    pre {
      line-height: 1.2;
      margin: 0;
      white-space: pre-wrap;
      font-family: 'EB Garamond', serif;
      padding-inline: 1rem;
    }
  }
}
</style>