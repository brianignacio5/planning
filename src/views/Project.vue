<template>
  <div id="home">
    <h1 class="project-title">{{ selectedProject?.name ?? "" }}</h1>
    <div class="flexbox">
      <Board v-for="board in boards" :board="board" :key="board._id" />
      <div class="add-board">
        <input
          type="text"
          name="new-board-name"
          placeholder="Add a board"
          v-model="newBoardName"
          @keyup.enter="addNewBoard"
        />
        <faIcon icon="plus" class="icon" @click="addNewBoard" />
      </div>
      <CardModal />
      <CommentModal />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { usePlanningStore } from "@/store/planning";
import Board from "@/components/Board.vue";
import CardModal from "@/components/CardModal.vue";
import CommentModal from "@/components/CommentModal.vue";

const planningStore = usePlanningStore();
const route = useRoute();
const newBoardName = ref("");

const selectedProject = computed(() =>
  planningStore.projects.find((p) => p._id === planningStore.selectedProjectId),
);
const boards = computed(() => selectedProject.value?.boards ?? []);

function setProjectFromRoute() {
  const id = route.params.id;
  if (id && typeof id === "string") {
    planningStore.selectedProjectId = id;
    planningStore.setCurrentProject();
  }
}

onMounted(() => {
  setProjectFromRoute();
});

watch(
  () => route.params.id,
  () => {
    setProjectFromRoute();
  },
);

function addNewBoard() {
  if (newBoardName.value !== "" && selectedProject.value) {
    planningStore.createBoard({
      name: newBoardName.value,
      project: selectedProject.value._id,
    });
    newBoardName.value = "";
  }
}
</script>

<style scoped>
.project-title {
  color: #ea5151;
  font-size: xx-large;
  font-weight: 800;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.flexbox {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.add-board {
  margin: 1%;
  padding: 0.5em;
  align-self: start;
}
.icon:hover {
  color: #ea5151;
}
</style>
