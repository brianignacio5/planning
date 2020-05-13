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
      :card.sync="card"
      :key="card.id"
      :class="{ dragHover: isDragEntered }"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Mutation } from "vuex-class";
import { board } from "../board";
import Card from "./Card.vue";

@Component({
  components: {
    Card
  }
})
export default class Board extends Vue {
  @Prop() private board!: board;
  @Mutation updateBoardWithCardIndex;
  private isDragEntered = false;

  public drop(e) {
    const cardId = e.dataTransfer.getData("card_id");
    const dropYPosition = e.pageY;
    let isBoardUpdated = false;
    for (let i = 0; i < this.board.cards.length; i++) {
      const cardYPosition = document.getElementById(this.board.cards[i].id);
      if (
        cardYPosition &&
        cardYPosition.getBoundingClientRect().y > dropYPosition
      ) {
        this.updateBoardWithCardIndex({
          cardId,
          destBoardId: this.board.id,
          destIndex: i
        });
        isBoardUpdated = true;
        break;
      }
    }
    if (!isBoardUpdated) {
      this.updateBoardWithCardIndex({
        cardId,
        destBoardId: this.board.id,
        destIndex: this.board.cards.length
      });
    }
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
  background-color: #162447;
  color: #f7f7f7;
  width: 25vh;
  margin: 1%;
  padding-bottom: 2%;
}
.dragHover {
  margin-top: 4%;
  margin-bottom: 4%;
}
h2 {
  margin-top: 1%;
}
</style>
