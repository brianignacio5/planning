<template>
  <div class="project-card" @click="selectProject">
    <span class="project-name">{{ project.name }}</span>
    <span class="project-date">{{ cardDate }}</span>
    <span class="project-description">{{ project.description }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Mutation } from "vuex-class";
import { project } from "../board";
import moment from "moment";

@Component
export default class ProjectCard extends Vue {
  @Prop() project!: project;
  @Mutation setSelectedProject;
  @Mutation setBoards;
  get cardDate() {
    if (this.project.createdOn) {
      const formattedDate = moment(this.project.createdOn.toString()).format(
        "MMM DD, YYYY"
      );
      return formattedDate;
    }
    return "";
  }
  public selectProject() {
      this.setBoards(this.project.boards);
      this.setSelectedProject(this.project);
      this.$router.push({ path: "/project" });
    }
}
</script>

<style scoped>
.project-card {
  background-color: #fff;
  color: #000000;
  box-shadow: 3px 3px 6px #2e2d2d29;
  border-radius: 20px;
  margin: 0.5em;
  display: flex;
  flex-direction: column;
  justify-items: center;
  width: 320px;
}

.project-card:hover {
  border-left: 10px solid #ea5151;
}

.project-name {
  color: #ea5151;
  font-size: x-large;
  font-weight: 500;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 0.25em;
}

.project-date {
  font-size: small;
}

.project-description {
  margin: 1.5em;
}
</style>