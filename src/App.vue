<template>
  <div id="app">
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
import { board } from "./board";
import { Action, State, Mutation } from "vuex-class";

@Component({
  components: {
    Board,
    CardModal
  }
})
export default class App extends Vue {
  @State boards: board[];
  private newBoardName = "";
  @Action private saveBoardsLocally;
  @Action private getBoardsLocally;
  @Mutation("addNewBoard") private addBoardToList;

  public addNewBoard() {
    if (this.newBoardName !== "") {
      this.addBoardToList(this.newBoardName);
      this.saveBoardsLocally();
      this.newBoardName = "";
    }
  }

  public mounted() {
    this.getBoardsLocally();
  }
}
</script>

<style>
body {
  background-color: #3f3f44;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #f7f7f7;
  margin-top: 60px;
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

.add-board {
  color: #f7f7f7;
  margin: 1%;
  padding: 0.5em;
  align-self: start;
}
.icon:hover {
  color: #162447;
}
</style>
