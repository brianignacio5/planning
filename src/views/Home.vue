<template>
  <div class="projects">
    <ProjectCard v-for="project in projects" :key="project._id" :project="project" />
    <div class="add-project">
      <input
        type="text"
        name="new-project-name"
        placeholder="Add a project"
        v-model="newProjectName"
        @keyup.enter="addNewProject"
      />
      <faIcon icon="plus" class="icon" @click="addNewProject" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { usePlanningStore } from "@/store/planning";
import ProjectCard from "@/components/ProjectCard.vue";

const planningStore = usePlanningStore();
const newProjectName = ref("");

const projects = computed(() => planningStore.projects);

function addNewProject() {
  if (newProjectName.value !== "") {
    const newProject = {
      name: newProjectName.value,
      createdOn: new Date(),
      description: "",
      _id: "",
      boards: [],
      users: [],
    };
    planningStore.createProject(newProject);
    newProjectName.value = "";
  }
}
</script>

<style scoped>
.projects {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.add-project {
  margin: 1%;
  padding: 0.5em;
  align-self: start;
}
.icon:hover {
  color: #ea5151;
}
</style>
