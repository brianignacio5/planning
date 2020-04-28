<template>
  <div id="app">
    <div class="flexbox">
      <Board v-for="board in boards" :board="board" :key="board.id" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Board from "./components/Board.vue";
import { board } from "./board";

const myBoards: board[] = [
  {
    id: "first",
    name: "first",
    cards: [
      {
        id: "card1",
        title: "card1",
        description: "This awesome card",
        assignee: { id: "user1", name: "Me" },
        comments: [
          {
            id: "comment1",
            content: "Awesome task",
            createdOn: new Date(),
            createdBy: { id: "user1", name: "Me" }
          }
        ],
        owner: { id: "user3", name: "boss" }
      }
    ]
  },
  {
    id: "second",
    name: "second",
    cards: [
      {
        id: "card2",
        title: "card2",
        description: "This crappy card",
        assignee: { id: "user2", name: "He" },
        comments: [
          {
            id: "comment1",
            content: "Awesome task",
            createdOn: new Date(),
            createdBy: { id: "user3", name: "boss" }
          }
        ],
        owner: { id: "user3", name: "boss" }
      }
    ]
  }
];

@Component({
  components: {
    Board
  }
})
export default class App extends Vue {
  private boards: board[] = myBoards;
}
</script>

<style>
body {
  background-color: #4d3e3e;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.flexbox {
  display: flex;
  flex-direction: row;
}
</style>
