<template>
  <div class="project-card">
    <span class="project-name">{{ project.name }}</span>
    <span class="project-date">{{ cardDate }}</span>
    <p>{{ project.description }}</p>
    <p v-for="user in project.users" :key="user.email">{{ user.name }}</p>
    <label for="addUserToProject">Add selected user to project</label>
    <select name="addUserToProject" v-model="selectedUser">
      <option v-for="user in project.users" :value="user" :key="user.email">
        {{ user.name }} - {{ user.email }} -
      </option>
    </select>
    <div class="add-new-user" @click="addNewUserToProject">
      <faIcon icon="plus" class="icon" />
      Add user...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { usePlanningStore } from "@/store/planning";
import type { project, user } from "../types";
import moment from "moment";

const props = defineProps<{ project: project }>();
const planningStore = usePlanningStore();
const selectedUser = ref<user>({
  _id: "",
  name: "",
  email: "",
  picture: "",
  token: "",
});

const cardDate = computed(() => {
  if (props.project.createdOn) {
    return moment(props.project.createdOn.toString()).format("MMM DD, YYYY");
  }
  return "";
});

function addNewUserToProject() {
  if (
    props.project.users.findIndex((u) => u.token === selectedUser.value.token) < 0 &&
    selectedUser.value.token !== ""
  ) {
    props.project.users.push({ ...selectedUser.value });
    planningStore.updateProject(props.project);
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
  background-color: var(--color-surface-muted);
  box-shadow: 3px 3px 8px var(--color-shadow-strong);
  border: 0.25em solid var(--color-border);
  border-radius: 5px;
  padding: 0.5em;
}

.add-new-user:hover {
  border: 0.25em solid var(--color-accent);
  color: var(--color-accent);
}

.project-card select {
  padding: 0.5rem;
  border: 0;
  box-shadow: 0 0 10px 1px var(--color-shadow-strong);
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  margin: 1rem;
  width: 60%;
  align-self: center;
}
</style>
