<template>
  <div class="project-card">
    <span class="project-name">{{ project.name }}</span>
    <span class="project-date">{{ cardDate }}</span>
    <p>{{ project.description }}</p>
    <p v-for="user in project.users" :key="user.email">{{ user.name }}</p>
    <label for="addUserToProject">Add selected user to project</label>
    <select name="addUserToProject" v-model="selectedUser">
      <option v-for="user in project.users" :value="user" :key="user.email"
        >{{ user.name }} - {{ user.email }} -</option
      >
    </select>
    <div class="add-new-user" @click="addNewUserToProject">
      <faIcon icon="plus" class="icon" />
      Add user...
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Action } from "vuex-class";
import { project, user } from "../board";
import moment from "moment";

@Component
export default class ProjectTeam extends Vue {
  @Action updateProject;
  @Prop() project!: project;
  private selectedUser: user = {
    _id: "",
    name: "",
    email: "",
    picture: "",
    token: "",
  };

  get cardDate() {
    if (this.project.createdOn) {
      const formattedDate = moment(this.project.createdOn.toString()).format(
        "MMM DD, YYYY"
      );
      return formattedDate;
    }
    return "";
  }

  addNewUserToProject() {
    if (
      this.project.users.findIndex((u) => u.token === this.selectedUser.token) <
      0
    ) {
      this.project.users.push(this.selectedUser);
      this.updateProject(this.project);
    }
  }
}
</script>

<style scoped>
label {
  font-size: medium;
}

.add-new-user {
  display: flex;
  justify-content: center;
  background-color: #bebebe;
  box-shadow: 3px 3px 8px #0000004b;
  border: 0.25em solid #efefef;
  border-radius: 5px;
  padding: 0.5em;
}

.add-new-user:hover {
  border: 0.25em solid #ea5151;
  color: #ea5151;
}

.project-card select {
  padding: 0.5rem;
  border: 0;
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.5);
  margin: 1rem;
  width: 60%;
  align-self: center;
}
</style>
