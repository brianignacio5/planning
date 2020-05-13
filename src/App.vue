<template>
  <div id="app">
    <div class="flexbox">
      <Board v-for="board in boards" :board="board" :key="board.id" />
      <CardModal />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Board from "./components/Board.vue";
import CardModal from "./components/CardModal.vue";
import { board } from "./board";
import { State } from "vuex-class";

@Component({
  components: {
    Board,
    CardModal
  }
})
export default class App extends Vue {
  @State boards: board[];
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
}
</style>
