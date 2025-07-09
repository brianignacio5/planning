<template>
  <div id="settings">
    <form>
      <span v-if="errors.length" class="alert">
        <b>Please fix the following errors</b>
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </span>
      <label for="useremail">Email</label>
      <input
        type="email"
        name="name"
        id="useremail"
        v-model="userInfo.email"
        @keyup="clearErrors"
        placeholder="Enter user email"
        :class="{ error: userInfoFieldErrors.email }"
      />
      <label for="username">Name</label>
      <input
        type="text"
        name="name"
        id="username"
        v-model="userInfo.name"
        @keyup="clearErrors"
        placeholder="Enter the user name"
        :class="{ error: userInfoFieldErrors.name }"
      />
      <label for="userpicture">Picture</label>
      <input
        :class="{ error: userInfoFieldErrors.picture }"
        type="text"
        name="userpicture"
        id="userpicture"
        placeholder="Enter picture URL"
        v-model="userInfo.picture"
        @keyup="clearErrors"
      />
      <label for="oldpassword">Old password</label>
      <input
        :class="{ error: userInfoFieldErrors.oldPassword }"
        type="password"
        name="oldpassword"
        id="oldpassword"
        placeholder="Enter old password"
        v-model="userInfo.oldPassword"
        @keyup="clearErrors"
      />
      <label for="newpassword">New password</label>
      <input
        :class="{ error: userInfoFieldErrors.newPassword }"
        type="password"
        name="newpassword"
        id="newpassword"
        placeholder="Enter new password"
        v-model="userInfo.newPassword"
        @keyup="clearErrors"
      />
      <label for="newnewpassword">Confirm new password</label>
      <input
        :class="{ error: userInfoFieldErrors.newNewPassword }"
        type="password"
        name="newnewpassword"
        id="newnewpassword"
        placeholder="Confirm new password"
        v-model="userInfo.newNewPassword"
        @keyup="clearErrors"
      />
      <button @click="saveChanges">Save changes</button>
      <button @click="exportLocalStorage" class="export-storage-btn">Export Local Storage</button>
      <button @click="clearLocalStorage" class="clear-storage-btn">Clear Local Storage</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { usePlanningStore } from "@/store/planning";
import type { userInfo } from "@/types";

const planningStore = usePlanningStore();

const userInfo = ref<userInfo>({
  email: "",
  name: "",
  password: undefined,
  picture: "",
  oldPassword: undefined,
  newPassword: undefined,
  newNewPassword: undefined,
});

const userInfoFieldErrors = ref({
  email: false,
  name: false,
  password: false,
  picture: false,
  oldPassword: false,
  newPassword: false,
  newNewPassword: false,
});

const errors = computed(() => planningStore.settingsError);

function clearErrors() {
  planningStore.settingsError = [];
  userInfoFieldErrors.value = {
    email: false,
    name: false,
    password: false,
    picture: false,
    oldPassword: false,
    newPassword: false,
    newNewPassword: false,
  };
}

function saveChanges(e: Event) {
  e.preventDefault();
  planningStore.settingsError = [];
  if (!userInfo.value.email) {
    planningStore.settingsError.push("Email is required");
    userInfoFieldErrors.value.email = true;
  }
  if (!userInfo.value.name) {
    planningStore.settingsError.push("Name is required");
    userInfoFieldErrors.value.name = true;
  }
  if (userInfo.value.newPassword && !userInfo.value.oldPassword) {
    planningStore.settingsError.push("Please input the old password");
    userInfoFieldErrors.value.oldPassword = true;
  }
  if (userInfo.value.newPassword && userInfo.value.newPassword !== userInfo.value.newNewPassword) {
    planningStore.settingsError.push("New password and confirmation doesn't match");
    userInfoFieldErrors.value.newPassword = true;
    userInfoFieldErrors.value.newNewPassword = true;
  } else {
    userInfo.value.password = userInfo.value.newPassword;
  }
  if (planningStore.settingsError.length < 1) {
    const newUser = { ...planningStore.myUser };
    newUser.email = userInfo.value.email ?? "";
    newUser.picture = userInfo.value.picture ?? "";
    newUser.name = userInfo.value.name ?? "";
    planningStore.updateUserInfo(userInfo.value);
  }
}

function exportLocalStorage() {
  // Collect all localStorage items created by localDataService
  const exportData = {
    projects: localStorage.getItem("projects"),
    currentProjectId: localStorage.getItem("currentProjectId"),
    planningUser: localStorage.getItem("planningUser"),
    exportDate: new Date().toISOString(),
    exportVersion: "1.0",
  };

  // Create a JSON blob
  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `planning-app-backup-${new Date().toISOString().split("T")[0]}.json`;

  // Trigger download
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  alert("Local storage data has been exported successfully!");
}

function clearLocalStorage() {
  if (
    confirm(
      "Are you sure you want to clear all local storage? This will remove all projects, cards, and user data. This action cannot be undone.",
    )
  ) {
    // Clear all localStorage items created by localDataService
    localStorage.removeItem("projects");
    localStorage.removeItem("currentProjectId");
    localStorage.removeItem("planningUser");

    // Reset the store state
    planningStore.projects = [];
    planningStore.selectedProjectId = null;
    planningStore.selectedCardId = null;
    planningStore.selectedCardBoardId = null;
    planningStore.userCards = [];
    planningStore.modalIsActive = false;
    planningStore.commentsModalIsActive = false;

    // Reset user to default
    planningStore.myUser = {
      token: "madsStrings",
      name: "Mads Nielsen",
      email: "me@mail.com",
      picture: "/profile.png",
    };

    // Reset form
    userInfo.value = {
      email: planningStore.myUser.email,
      name: planningStore.myUser.name,
      password: undefined,
      picture: planningStore.myUser.picture,
      oldPassword: undefined,
      newPassword: undefined,
      newNewPassword: undefined,
    };

    alert("Local storage has been cleared. The page will refresh to apply changes.");
    window.location.reload();
  }
}

onMounted(() => {
  userInfo.value = {
    email: planningStore.myUser.email,
    name: planningStore.myUser.name,
    password: undefined,
    picture: planningStore.myUser.picture,
    oldPassword: undefined,
    newPassword: undefined,
    newNewPassword: undefined,
  };
});
</script>

<style scoped>
#settings form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0.5em;
}

#settings form input {
  padding: 0.5rem;
  border: 0;
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.5);
  margin: 1rem;
  width: 60%;
}

#settings form input.error {
  background-color: #fce4e4;
  border: 1px solid #ea5151;
  outline: none;
}

#settings form button {
  border-radius: 5px;
  padding: 0.5em;
  margin: 0.5em;
}

#settings form button:hover {
  color: #ea5151;
  border: 0.25em solid #ea5151;
}

.export-storage-btn {
  background-color: #28a745;
  color: white;
  border: 2px solid #28a745;
  margin-top: 1rem;
}

.export-storage-btn:hover {
  background-color: #218838;
  border-color: #218838;
  color: white;
}

.clear-storage-btn {
  background-color: #ea5151;
  color: white;
  border: 2px solid #ea5151;
  margin-top: 1rem;
}

.clear-storage-btn:hover {
  background-color: #d43d3d;
  border-color: #d43d3d;
  color: white;
}

.alert {
  padding: 20px;
  background-color: #ea5151;
  color: white;
  margin-bottom: 15px;
}
</style>
