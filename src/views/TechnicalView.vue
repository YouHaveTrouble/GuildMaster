<template>
  <section class="technical-view">
    <div class="socials panel pinned-paper">
      <div class="nail top-left small">
        <Nail/>
      </div>
      <div class="nail top-right small">
        <Nail/>
      </div>
      <h1>Socials</h1>
      <div class="links">
        <a class="link" href="https://discord.gg/j8KK5dGBps">
          <img class="icon" src="/img/icons/discord.svg" alt="Discord"/>
          Discord
        </a>
        <a class="link" href="https://github.com/YouHaveTrouble/GuildMaster">
          <img class="icon" src="/img/icons/github.svg" alt="GitHub"/>
          GitHub
        </a>
      </div>
    </div>
    <SaveManagerComponent/>
    <ChangelogComponent/>

  </section>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import ChangelogComponent from "@/components/technical/ChangelogComponent.vue";
import SaveManagerComponent from "@/components/technical/SaveManagerComponent.vue";
import Nail from "@/components/misc/Nail.vue";

export default defineComponent({
  name: "TechnicalView",
  components: {Nail, SaveManagerComponent, ChangelogComponent},
});
</script>

<style lang="scss" scoped>
.technical-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding-block: 1rem;

  h1 {
    font-size: 3rem;
    line-height: 1;
    margin: 0;
  }

  .socials {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 1rem;

    .links {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 1rem;

      .link {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.05rem;
        text-decoration: underline;
        font-size: 1.5rem;
        color: #000;
        font-weight: bold;
      }
    }
  }


  .icon {
    width: 2rem;
    height: 2rem;
  }
}
</style>