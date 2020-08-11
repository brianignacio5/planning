<template>
  <div class="project-card" @click="toggleCardEdit">
    <span class="project-name" @click="selectProject">{{ project.name }}</span>
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

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Action, Mutation } from "vuex-class";
import { project } from "../board";
import moment from "moment";

@Component
export default class ProjectCard extends Vue {
  @Action private updateProject;
  @Prop() project!: project;
  @Mutation setSelectedProject;
  @Mutation setBoards;
  private cardEdit = false;

  get projectDescription() {
    return this.project._id + "-desc";
  }

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

  public toggleCardEdit() {
    this.cardEdit = !this.cardEdit;
    if (this.cardEdit) {
      this.$nextTick(() => {
        const projDescElem = document.getElementById(this.projectDescription);
        if (projDescElem) {
          projDescElem.focus();
        }
      });
    }
  }

  public saveCard() {
    this.updateProject(this.project);
    this.toggleCardEdit();
  }
}
</script>

<style scoped>
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
