<template>
  <div class="teams">
    <ProjectTeam :project="proj" v-for="proj in projects" :key="proj._id" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { usePlanningStore } from "@/store/planning";
import ProjectTeam from "@/components/ProjectTeam.vue";

const planningStore = usePlanningStore();
const projects = computed(() => planningStore.projects);

onMounted(() => {
  planningStore.getProjects();
});
</script>

<style scoped>
.teams {
  display: flex;
}
</style>
