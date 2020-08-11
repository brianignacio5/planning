<template>
  <div class="teams">
    <ProjectTeam :project="proj" v-for="proj in projects" :key="proj._id" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Action, State } from "vuex-class";
import ProjectTeam from "./ProjectTeam.vue";
import { project } from "../board";

@Component({
  components: {
    ProjectTeam
  }
})
export default class Teams extends Vue {
  @Action private getProjectsLocally;
  @State("projects") storeProjects: project[];

  get projects() {
    return this.storeProjects;
  }

  public mounted() {
    this.getProjectsLocally();
  }
}
</script>

<style scoped>
.teams {
  display: flex;
}
</style>