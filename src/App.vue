<template>
  <div id="main-app">
    <div class="columns">
      <div class="sidenav">
        <div class="title">
          <router-link to="/">
            <h1><small>Abilitare</small></h1>
          </router-link>
        </div>
        <div class="sidenav-section">
          <router-link to="/teams"
            ><faIcon icon="users" class="icon" size="2x" />
            <p>Teams</p></router-link
          >
        </div>
        <div class="sidenav-section">
          <router-link to="/"
            ><faIcon icon="th-large" class="icon" size="2x" />
            <p>Projects</p></router-link
          >
        </div>
        <div class="sidenav-section">
          <router-link to="/calendar"
            ><faIcon icon="calendar-day" class="icon" size="2x" />
            <p>Calendar</p></router-link
          >
        </div>
        <div class="sidenav-section">
          <router-link to="/settings"
            ><faIcon icon="cog" class="icon" size="2x" />
            <p>Settings</p></router-link
          >
        </div>
      </div>
      <div class="content">
        <div class="navbar">
          <div class="theme-toggle" role="group" aria-label="Color theme">
            <button
              type="button"
              :class="{ active: planningStore.theme === 'light' }"
              @click="planningStore.setTheme('light')"
            >
              Light
            </button>
            <button
              type="button"
              :class="{ active: planningStore.theme === 'dark' }"
              @click="planningStore.setTheme('dark')"
            >
              Dark
            </button>
          </div>
          <router-link to="/settings" class="profile-name">{{
            planningStore.myUser.name
          }}</router-link>
          <router-link to="/settings" class="profile-pic">
            <img
              :src="resolveProfilePicture(planningStore.myUser.picture)"
              alt="profile-pic"
            />
          </router-link>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import { resolveProfilePicture, usePlanningStore } from "./store/planning";

const planningStore = usePlanningStore();

watch(
  () => planningStore.theme,
  (theme) => {
    document.documentElement.dataset.theme = theme;
  },
  { immediate: true },
);

onMounted(() => {
  try {
    const currentUser = localStorage.getItem("planningUser");
    if (currentUser) {
      let newUserData = JSON.parse(currentUser);
      const newUser = {
        name: newUserData.name,
        email: newUserData.email,
        picture: resolveProfilePicture(newUserData.picture),
        token: newUserData.token,
      };
      planningStore.updateUserInfo(newUser);
    }
  } catch (error) {
    console.log(error);
    localStorage.removeItem("planningUser");
  }

  planningStore.getProjects();
});
</script>

<style>
body {
  background-color: var(--color-bg);
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--color-text);
  top: 0;
  left: 0;
  width: 100%;
  height: 98vh;
  margin: 0.5em;
}

input[type="text"],
textarea {
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  box-shadow: 0 0 10px 1px var(--color-shadow-strong);
  margin: 0.5rem;
  background-color: var(--color-surface);
  color: var(--color-text);
}

label {
  font-size: x-large;
}

.navbar {
  display: flex;
  align-items: center;
  margin: 0.25em;
  justify-content: flex-end;
  background: linear-gradient(90deg, var(--color-navbar-start) 0%, var(--color-navbar-end) 100%);
}

.theme-toggle {
  display: flex;
  margin-right: 0.75em;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--color-navbar-text) 35%, transparent);
}

.theme-toggle button {
  background: transparent;
  color: var(--color-navbar-text);
  border: 0;
  padding: 0.4em 0.9em;
  cursor: pointer;
}

.theme-toggle button.active {
  background: var(--color-accent);
  color: var(--color-on-accent);
}

.columns {
  display: flex;
  height: 98vh;
  padding: 0.25em;
}

.content {
  flex-grow: 2;
}

.sidenav {
  display: flex;
  background-color: var(--color-surface);
  flex-direction: column;
  width: 120px;
  justify-content: space-between;
  margin: 0.25em;
}

.sidenav .title a {
  color: var(--color-accent);
}

.sidenav .title a:hover {
  text-shadow: 1px 0px 10px var(--color-shadow-strong);
}

.sidenav-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.sidenav-section:hover {
  border-left: 5px solid var(--color-accent);
}

.sidenav .title {
  font-weight: 500;
  font-family: "Kaushan Script", cursive;
  color: var(--color-accent);
}

.sidenav a {
  text-decoration: none;
  color: var(--color-text);
}

.sidenav a:hover {
  color: var(--color-accent);
}

.profile-pic {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5em;
  height: 5em;
  margin: 0.25em;
  border-radius: 1em;
  text-decoration: none;
  transition: transform 0.2s ease;
}

.profile-pic:hover {
  transform: scale(1.05);
}
.profile-name {
  margin: 0.25em;
  color: var(--color-navbar-text);
  font-size: 36px;
  text-decoration: none;
}

.profile-name:hover {
  color: var(--color-accent);
  text-shadow: 1px 0px 10px var(--color-shadow-strong);
}

.profile-pic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}
</style>
