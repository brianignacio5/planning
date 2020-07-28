<template>
  <div id="app">
    <div class="navbar">
      <div class="profile-pic">
        <img :src="myUser.picture || './profile.png'" alt="profile-pic" />
      </div>
      <div class="profile-name">{{ myUser.name }}</div>
    </div>
    <div class="flexbox">
      <Board v-for="board in boards" :board="board" :key="board.id" />
      <div class="add-board">
        <input
          type="text"
          name="new-board-name"
          placeholder="Add a board"
          v-model="newBoardName"
          @keyup.enter="addNewBoard"
        />
        <faIcon icon="plus" class="icon" @click="addNewBoard" />
      </div>
      <CardModal />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Board from "./components/Board.vue";
import CardModal from "./components/CardModal.vue";
import { board, user } from "./board";
import { Action, State, Mutation } from "vuex-class";

@Component({
  components: {
    Board,
    CardModal
  }
})
export default class App extends Vue {
  @State boards: board[];
  @State("myUser") storeMyUser: user;
  private newBoardName = "";
  @Action private getBoardsLocally;
  @Action private saveBoardsLocally;
  @Mutation("addNewBoard") private addBoardToList;
  @Mutation setUser;

  public addNewBoard() {
    if (this.newBoardName !== "") {
      this.addBoardToList(this.newBoardName);
      this.saveBoardsLocally();
      this.newBoardName = "";
    }
  }

  get myUser() {
    return this.storeMyUser;
  }

  public mounted() {
    const newUserData = this.$cookies.get("planningJwt");
    if (newUserData) {
      const newUser = {
        name: newUserData.name,
        picture: newUserData.picture,
        token: newUserData.token,
      };
      this.setUser(newUser);
    }
    this.getBoardsLocally();
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

.flexbox {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
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
}

.profile-pic {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5em;
  height: 5em;
  margin: 0.25em;
  border: 0.25em solid #3f87ce;
  border-radius: 1em;
}
.profile-name {
  margin: 0.25em;
  font-family: Avenir;
  color: #3f87ce;
  font-size: 36px;
}

.profile-pic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1em;
}

.add-board {
  margin: 1%;
  padding: 0.5em;
  align-self: start;
}
.icon:hover {
  color: #3f87ce;
}
</style>
