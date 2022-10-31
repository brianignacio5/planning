<template>
  <div class="projects">
    <ProjectCard
      v-for="project in projects"
      :key="project._id"
      :project="project"
    />
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

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { project } from "../board";
import { Action, State, Mutation } from "vuex-class";
import ProjectCard from "./ProjectCard.vue";

@Component({
  components: {
    ProjectCard,
  },
})
export default class Projects extends Vue {
  private newProjectName = "";
  @Action private getProjects;
  @Action createProject;
  @State projects: project[];

  public addNewProject() {
    if (this.newProjectName != "") {
      const newProject = {
        name: this.newProjectName,
        createdOn: new Date(),
        description: "",
      };
      this.createProject(newProject);
      this.newProjectName = "";
    }
  }

  public mounted() {
    this.getProjects();
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
