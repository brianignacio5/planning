<template>
  <div id="home">
    <h1 class="project-title">{{selectedProject.name}}</h1>
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
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Board from "./Board.vue";
import CardModal from "./CardModal.vue";
import CommentModal from "./CommentModal.vue";
import { Action, State } from "vuex-class";
import { board, project } from "../board";

@Component({
  components: {
    Board,
    CardModal,
    CommentModal
  }
})
export default class ProjectPage extends Vue {
  private newBoardName = "";
  @Action private createBoard;
  @State boards: board[];
  @State("selectedProject") storeSelectedProject: project;

  public addNewBoard() {
    if (this.newBoardName !== "") {
      this.createBoard({ name: this.newBoardName, project: this.storeSelectedProject._id});
      this.newBoardName = "";
    }
  }

  get selectedProject() {
    return this.storeSelectedProject;
  }

}
</script>

<style scoped>
.project-title {
  color: #ea5151;
  font-size: xx-large;
  font-weight: 500;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

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
  color: #ea5151;
}
</style>
