<template>
  <div class="save-manager panel pinned-paper">
    <dialog ref="importDialog" >
      <div class="import-dialog">
        <textarea
            v-model="importSaveText"
            placeholder="Paste your save data here"
        ></textarea>
        <div style="display: flex; flex-direction: row; flex-wrap: wrap; gap: 0.5rem;">
          <button type="button" class="button metal" @click="importSave()" :disabled="importSaveText === ''">
            Import
          </button>
          <button class="close" @click="closeSaveImport">✗</button>
        </div>
      </div>

    </dialog>
    <div class="nail top-left">
      <img src="/img/quests/overlays/nail.png" alt="" draggable="false"/>
    </div>
    <div class="nail top-right">
      <img src="/img/quests/overlays/nail.png" alt="" draggable="false"/>
    </div>
    <h1>Save file</h1>
    <div class="buttons">
      <button class="button metal" @click="exportSave()">
        Export
      </button>
      <button class="button metal" @click="openSaveImport()">
        Import
      </button>
      <button class="button metal" @click="wipeSave()">
        <span class="red">Wipe</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "ChangelogComponent",
  data: () => ({
    importSaveText: "",
  }),
  methods: {
    openSaveImport() {
      const dialog = this.$refs.importDialog as HTMLDialogElement;
      dialog.showModal();
    },
    closeSaveImport() {
      const dialog = this.$refs.importDialog as HTMLDialogElement;
      dialog.close();
    },
    exportSave() {
      const save = window.localStorage.getItem("savedGame");
      if (!save) {
        alert("No save file found!");
        return;
      }
      navigator.clipboard.writeText(btoa(save));
      setTimeout(() => alert("Save data copied to clipboard!"), 100);
    },
    importSave() {
      const saveBase64 = this.importSaveText;
      try {
        const save = atob(saveBase64);
        JSON.parse(save);
        window.localStorage.setItem("savedGame", save);
        window.location.reload();
      } catch (e) {
        alert("Invalid save file!");
        return;
      }

    },
    wipeSave() {
      if (!confirm("You are about to wipe your save file. Are you sure?")) return;
      window.localStorage.removeItem("savedGame");
      window.location.reload();
    },
  }
});
</script>

<style scoped lang="scss">
.save-manager {
  padding-block: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  max-width: 45rem;
  width: 100%;
  h1 {
    margin-block: 0;
    font-size: 2rem;
  }
  dialog {
    padding: 0;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.25rem;
    .red {
      color: #d52121;
    }
  }
  .import-dialog {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: url("/img/background/panels/plaster.png");
    background-size: 100% 100%;
    gap: 1rem;
    position: relative;
    textarea {
      width: 90%;
      height: 10rem;
      resize: none;
      border: 1px solid var(--color-metal);
      border-radius: 0.25rem;
      padding: 0.5rem;
      font-family: monospace;
    }
    .close {
      color: #ab0707;
      font-size: 2rem;
      border: none;
      background: transparent;
      &:hover {
        color: #d52121;
        cursor: pointer;
      }
    }
  }
}
</style>