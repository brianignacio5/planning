<template>
  <div id="app">
    <div class="columns">
      <div class="sidenav">
        <div class="board-section">
          <router-link to="/boards"><faIcon icon="th-large" class="icon" size="2x" /> <p>Boards</p></router-link>
        </div>
        <div class="calendar-section">
          <router-link to="/calendar"><faIcon icon="calendar-day" class="icon" size="2x" /> <p>Calendar</p></router-link>
        </div>
        <div class="settings-section">
          <router-link to="/settings"><faIcon icon="cog" class="icon" size="2x" /> <p>Settings</p></router-link>
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
  @Action private getBoardsLocally;
  @State("myUser") storeMyUser: user;
  @Mutation setUser;

  get myUser() {
    return this.storeMyUser;
  }

  public mounted() {
    const newUserData = this.$cookies.get("planningJwt");
    if (newUserData) {
      const newUser = {
        name: newUserData.name,
        email: newUserData.email,
        picture: newUserData.picture,
        token: newUserData.token,
      };
      this.setUser(newUser);
      this.getBoardsLocally();
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
  background: transparent linear-gradient(90deg, #272626 0%, #4A4949 100%) 0% 0% no-repeat padding-box;
}

.columns {
  display: flex;
}

.content {
  flex-grow: 2;
}

.sidenav {
  display: flex;
  background-color: #ffffff;
  flex-direction: column;
  width: 10em;
  justify-content: space-around;
}

.sidenav a {
  text-decoration: none;
  color: #000;
}

.sidenav a:hover {
  color: #EA5151;
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
  font-family: Avenir;
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
