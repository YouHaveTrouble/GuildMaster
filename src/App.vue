<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
import {version} from "../package.json"
</script>

<template>
  <section class="loading-screen" :class="{disabled: !loading}">
    <div class="title panel note-paper">
      <h1>Guild Master</h1>
      <h3>Adventurer's guild management game</h3>
      <small>v{{ version }}</small>
      <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <h3>Loading assets...</h3>
    </div>
  </section>
  <header>
    <nav>
      <RouterLink
        :to="{name: 'guild'}"
      >
        Guild
      </RouterLink>
    </nav>
  </header>
  <RouterView/>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import AdventurerIdentity from "@/models/AdventurerIdentity.ts";
import Adventurer from "@/models/Adventurer.ts";

export default defineComponent({
  name: "GuildMaster",
  data: () => ({
    loading: true,
    screenWakeLock: null as null | WakeLockSentinel,
    possibleRecruits: {} as { [key: string]: AdventurerIdentity },
    adventurers: {} as { [key: string]: Adventurer },
  }),
  methods: {
    async acquireScreenWakeLock(): Promise<void> {
      if (!("wakeLock" in navigator)) {
        return;
      }
      if (this.screenWakeLock !== null) {
        return;
      }
      try {
        this.screenWakeLock = await navigator.wakeLock.request("screen");
      } catch (e) {
        setTimeout(() => {
          this.acquireScreenWakeLock();
        }, 1000);
      }
    },
    async loadAdventurers(): Promise<void> {
      await fetch("/data/adventurers.json")
        .then(response => response.json())
        .then(data => {
          if (!Array.isArray(data)) throw new Error("Data was expected to be an array");

          for (const rawData of data) {
            if (typeof rawData.id !== "string" || typeof rawData.name !== "string" || typeof rawData.portrait !== "string") {
              console.error("Failed to load one of the adventurer's data: invalid data");
              continue;
            }
            this.possibleRecruits[rawData.id] = new AdventurerIdentity(
              rawData.id,
              rawData.name,
              rawData.portrait,
            );
          }

          // TODO load adventurers from save file and remove their data from possible recruits

        })
        .catch(error => {
          console.error("Failed to load adventurer data:", error);
        });

    },
  },
  async mounted() {

    await this.acquireScreenWakeLock();

    await this.loadAdventurers();

    this.loading = false;
    console.debug("Game loaded");

  },
})
</script>

<style lang="scss" scoped>
header {
  line-height: 1;
  max-height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

nav {
  width: max-content;
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding-inline: 2rem;
  padding-bottom: 2rem;
  padding-top: 0.5rem;
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: bottom;
  filter: drop-shadow(0 0 0.5rem rgba(0, 0, 0, 0.25));

  .icon {
    width: 2rem;
    height: 2rem;
    transform: translateY(0.35rem);
  }

  a {
    font-size: 2rem;
    color: #000;
    text-decoration: none;

    &.router-link-active {
      text-decoration: underline;
    }
  }

}

.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 5;
  user-select: none;
  background-size: cover;
  background-position: center;
  background-image: url("/img/promo/chicken_mage.jpg");
  background-repeat: no-repeat;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  transition: opacity 0.25s linear;

  .title {
    margin-block: 2.5%;
    margin-inline: 2.5%;
  }

  &.disabled {
    opacity: 0;
    pointer-events: none;
  }

  .lds-ring {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }

  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 64px;
    height: 64px;
    margin: 8px;
    border: 8px solid;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #000 transparent transparent transparent;
  }

  .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }

  .lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
  }

  .lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
  }

  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}

</style>
