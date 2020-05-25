<template>
  <div class="board" :id="board.id" @dragover.prevent @drop.prevent="drop">
    <div
      class="board-title"
      @mouseenter="toggleBoardHover"
      @mouseleave="toggleBoardHover"
    >
      <h2 @dragover.stop>{{ board.name }}</h2>
      <faIcon
        icon="times"
        @click="removeBoard"
        class="icon"
        :style="{ visibility: isBoardHovered ? 'visible' : 'hidden' }"
      />
    </div>
    <Card v-for="card in board.cards" :card.sync="card" :key="card.id" />
    <div class="add-section">
      <div class="add-card-input" v-if="isNewCardInputVisible">
        <textarea
          cols="30"
          rows="3"
          ref="contentTextArea"
          v-model="newCardTitle"
          @keyup.enter="addNewCardToBoard"
          placeholder="Card title"
        ></textarea>
        <div class="add-sections-btns">
          <faIcon icon="plus" @click="addNewCardToBoard" class="icon" />
          <faIcon icon="times" @click="toggleNewCardInput" class="icon" />
        </div>
      </div>
      <faIcon icon="plus" @click="toggleNewCardInput" class="icon" v-else />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Action, Mutation } from "vuex-class";
import { board } from "../board";
import Card from "./Card.vue";

const ESC_KEY_CODE = 27;

@Component({
  components: {
    Card
  }
})
export default class Board extends Vue {
  @Action private saveBoardsLocally;
  @Prop() private board!: board;
  @Mutation updateBoardWithCardIndex;
  @Mutation addNewCardInBoard;
  @Mutation("removeBoard") removeBoardWithId;
  private isNewCardInputVisible = false;
  private isBoardHovered = false;
  private newCardTitle = "";

  public toggleNewCardInput() {
    this.isNewCardInputVisible = !this.isNewCardInputVisible;
    if (this.isNewCardInputVisible) {
      this.$nextTick(() => {
        (this.$refs.contentTextArea as HTMLElement).focus();
      });
    }
  }

  public toggleBoardHover() {
    this.isBoardHovered = !this.isBoardHovered;
  }

  public removeBoard() {
    this.removeBoardWithId(this.board.id);
    this.saveBoardsLocally();
  }

  public addNewCardToBoard() {
    if (this.newCardTitle !== "") {
      this.addNewCardInBoard({
        boardId: this.board.id,
        cardName: this.newCardTitle
      });
      this.newCardTitle = "";
      this.saveBoardsLocally();
    }
  }

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

  mounted() {
    window.addEventListener("keyup", e => {
      if (e.keyCode === ESC_KEY_CODE) {
        this.isNewCardInputVisible = false;
      }
    });
  }
}
</script>

<style scoped>
.board {
  background-color: #162447;
  color: #f7f7f7;
  width: 25vh;
  height: fit-content;
  margin: 0.25em;
  border-radius: 5px;
}
.board-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.5%;
}
.board-title h2 {
  flex-grow: 2;
  padding-left: 10%;
}
.board-title .icon {
  margin: 5%;
}
.add-section {
  margin: 1em;
  display: flex;
  justify-content: center;
}

.add-sections-btns {
  display: flex;
  justify-content: space-around;
}

.icon:hover {
  color: #3f3f44;
}
</style>
