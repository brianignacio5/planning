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
          <router-link to="/settings" class="profile-name">{{
            planningStore.myUser.name
          }}</router-link>
          <router-link to="/settings" class="profile-pic">
            <img :src="planningStore.myUser.picture || '/profile.png'" alt="profile-pic" />
          </router-link>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { usePlanningStore } from "./store/planning";

const planningStore = usePlanningStore();

onMounted(() => {
  try {
    const currentUser = localStorage.getItem("planningUser");
    if (currentUser) {
      let newUserData = JSON.parse(currentUser);
      const newUser = {
        name: newUserData.name,
        email: newUserData.email,
        picture: newUserData.picture,
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
  background-color: #eeeeee;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
  top: 0;
  left: 0;
  width: 100%;
  height: 98vh;
  margin: 0.5em;
}

input[type="text"],
textarea {
  padding: 0.5rem;
  border: 0;
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.5);
  margin: 0.5rem;
}

label {
  font-size: x-large;
}

.navbar {
  display: flex;
  align-items: center;
  margin: 0.25em;
  justify-content: flex-end;
  background: transparent linear-gradient(90deg, #272626 0%, #4a4949 100%) 0% 0% no-repeat
    padding-box;
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
  background-color: #ffffff;
  flex-direction: column;
  width: 120px;
  justify-content: space-between;
  margin: 0.25em;
}

.sidenav .title a {
  color: #ea5151;
}

.sidenav .title a:hover {
  text-shadow: 1px 0px 10px rgba(0, 0, 0, 0.5);
}

.sidenav-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.sidenav-section:hover {
  border-left: 5px solid #ea5151;
}

.sidenav .title {
  font-weight: 500;
  font-family: "Kaushan Script", cursive;
  color: #ea5151;
}

.sidenav a {
  text-decoration: none;
  color: #000;
}

.sidenav a:hover {
  color: #ea5151;
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
  color: #ffffff;
  font-size: 36px;
  text-decoration: none;
}

.profile-name:hover {
  color: #ea5151;
  text-shadow: 1px 0px 10px rgba(0, 0, 0, 0.5);
}

.profile-pic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}
</style>
