<template>
  <div
    class="board"
    :id="board.id"
    @dragover.prevent
    @drop.prevent="drop"
    v-on:dragenter="onDragEnter"
    v-on:dragleave="onDragLeave"
  >
    <h2 @dragover.stop>{{ board.name }}</h2>
    <Card
      v-for="card in board.cards"
      :card="card"
      :key="card.id"
      :class="{ dragHover: isDragEntered }"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { board } from "../board";
import Card from "./Card.vue";

@Component({
  components: {
    Card
  }
})
export default class Board extends Vue {
  @Prop() private board!: board;
  private isDragEntered = false;

  public drop(e) {
    const cardId = e.dataTransfer.getData("card_id");
    const card = document.getElementById(cardId);
    card.style.display = "block";
    e.target.appendChild(card);
  }

  public onDragEnter() {
    this.isDragEntered = true;
  }

  public onDragLeave() {
    this.isDragEntered = false;
  }
}
</script>

<style scoped>
.board {
  background-color: #ffc38b;
  width: 25vh;
  margin: 1%;
  padding-bottom: 2%;
}
.dragHover {
  margin-top: 4%;
  margin-bottom: 4%;
}
h2 {
  margin-top: 0;
}
</style>
