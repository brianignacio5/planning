<template>
  <div id="home">
    <div class="flexbox">
      <Board v-for="board in boards" :board="board" :key="board._id" />
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
      <CommentModal />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from "vue-property-decorator";
import Board from "./Board.vue";
import CardModal from "./CardModal.vue";
import CommentModal from "./CommentModal.vue";
import { Action, Mutation, State } from "vuex-class";
import { board, user } from "../board";

@Component({
  components: {
    Board,
    CardModal,
    CommentModal
  }
})
export default class ProjectPage extends Vue {
  private newBoardName = "";
  @Action private saveBoardsLocally;
  @Action private createBoard;
  @State boards: board[];

  public addNewBoard() {
    if (this.newBoardName !== "") {
      this.createBoard(this.newBoardName);
      this.saveBoardsLocally();
      this.newBoardName = "";
    }
  }
}
</script>

<style scoped>
.flexbox {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
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