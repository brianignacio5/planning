<template>
  <div class="project-card" @click="toggleCardEdit">
    <span class="project-name" @click.stop="selectProject">{{ project.name }}</span>
    <span class="project-date">{{ cardDate }}</span>
    <p v-show="!cardEdit">{{ project.description }}</p>
    <input
      type="text"
      name="project-inline-description"
      :id="projectDescription"
      v-model="project.description"
      v-show="cardEdit"
      @blur="saveCard"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { useRouter } from "vue-router";
import { usePlanningStore } from "@/store/planning";
import type { project } from "../types";
import moment from "moment";

const props = defineProps<{ project: project }>();
const planningStore = usePlanningStore();
const router = useRouter();
const cardEdit = ref(false);

const projectDescription = computed(() => props.project._id + "-desc");
const cardDate = computed(() => {
  if (props.project.createdOn) {
    return moment(props.project.createdOn.toString()).format("MMM DD, YYYY");
  }
  return "";
});

function selectProject(e?: Event) {
  // Prevent parent click from toggling edit
  if (e) e.stopPropagation();
  // Set the selected project id in the store
  planningStore.selectedProjectId = props.project._id;
  planningStore.setCurrentProject();
  router.push({ name: "project", params: { id: props.project._id } });
}

function toggleCardEdit() {
  cardEdit.value = !cardEdit.value;
  if (cardEdit.value) {
    nextTick(() => {
      const projDescElem = document.getElementById(projectDescription.value);
      if (projDescElem) {
        (projDescElem as HTMLInputElement).focus();
      }
    });
  }
}

function saveCard() {
  planningStore.updateProject(props.project);
  toggleCardEdit();
}
</script>

<style>
.project-card {
  background-color: #fff;
  color: #000000;
  box-shadow: 3px 3px 6px #2e2d2d29;
  border-radius: 10px;
  margin: 0.5em;
  display: flex;
  flex-direction: column;
  justify-items: center;
  width: 320px;
  transition: all 0.1s ease;
}

.project-card:hover {
  border-top: 5px solid #ea5151;
}

.project-name {
  color: #ea5151;
  font-size: x-large;
  font-weight: 500;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 0.25em;
}

.project-name:hover {
  text-decoration-line: underline;
}

.project-date {
  font-size: small;
}

.project-description {
  margin: 1.5em;
}
</style>
