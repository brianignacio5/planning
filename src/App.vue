<template>
  <div id="app">
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
          <div class="profile-name">{{ myUser.name }}</div>
          <div class="profile-pic">
            <img :src="myUser.picture || './profile.png'" alt="profile-pic" />
          </div>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { user } from "./board";
import { Action, State, Mutation } from "vuex-class";

@Component
export default class App extends Vue {
  @State("myUser") storeMyUser: user;
  @Action updateUserInfo;

  get myUser() {
    return this.storeMyUser;
  }

  public mounted() {
    let newUserData = this.$cookies.get("planningJwt");
    if (!newUserData) {
      try {
        const currentUser = localStorage.getItem("planningUser");
        newUserData = JSON.parse(currentUser);
      } catch (error) {
        console.log(error);
        localStorage.removeItem("planningUser");
      }
    }
    if (newUserData) {
      const newUser = {
        name: newUserData.name,
        email: newUserData.email,
        picture: newUserData.picture,
        token: newUserData.token
      };
      this.updateUserInfo(newUser);
    }
  }
}
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
  background: transparent linear-gradient(90deg, #272626 0%, #4a4949 100%) 0% 0%
    no-repeat padding-box;
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
  width: 105px;
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
}
.profile-name {
  margin: 0.25em;
  color: #ffffff;
  font-size: 36px;
}

.profile-pic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}
</style>
