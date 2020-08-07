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
    <Card v-for="card in board.cards" :card="card" :key="card._id" />
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
      <div v-else class="add-new-card" @click="toggleNewCardInput">
        <faIcon icon="plus" class="icon" />
        Add new card
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Action, Mutation } from "vuex-class";
import { board, card } from "../board";
import Card from "./Card.vue";

const ESC_KEY_CODE = 27;

@Component({
  components: {
    Card
  }
})
export default class Board extends Vue {
  @Action private createCard;
  @Action private deleteBoard;
  @Action private updateCard;
  @Prop() private board!: board;
  @Mutation updateBoardWithCardIndex;
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
    this.deleteBoard(this.board._id);
    this.removeBoardWithId(this.board._id);
  }

  public addNewCardToBoard() {
    if (this.newCardTitle !== "") {
      const newCard = {
        board: this.board._id,
        comments: [],
        title: this.newCardTitle.trim(),
        description: "",
        picture: "",
        createdOn: new Date(),
      };
      this.createCard(newCard);
      this.newCardTitle = "";
    }
  }

  public drop(e) {
    const cardId = e.dataTransfer.getData("card_id");
    console.log(cardId);    
    const dropYPosition = e.pageY;
    let isBoardUpdated = false;
    for (let i = 0; i < this.board.cards.length; i++) {
      const cardYPosition = document.getElementById(this.board.cards[i]._id);
      if (
        cardYPosition &&
        cardYPosition.getBoundingClientRect().y > dropYPosition
      ) {
        this.updateCard({ _id: cardId, board: this.board, insertIndex: i });
        this.updateBoardWithCardIndex({
          cardId,
          destBoardId: this.board._id,
          destIndex: i
        });
        isBoardUpdated = true;
        break;
      }
    }
    if (!isBoardUpdated) {
      this.updateCard({ _id: cardId, board: this.board, insertIndex: this.board.cards.length });
      this.updateBoardWithCardIndex({
        cardId,
        destBoardId: this.board._id,
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
  background: #BEBEBE 0% 0% no-repeat padding-box;
  color: #000000;
  width: 340px;
  height: fit-content;
  margin: 0.5em;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.board:hover {
  border-top: 10px solid #ea5151;
}
.board-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0.5em;
}
.board-title h2 {
  color: #ffffff;
  text-shadow: 0px 3px 6px #00000070;
  width: 300px;
  text-align: left;
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

.add-new-card {
  display: flex;
  justify-content: center;
  width: 100%;
  background-color: #efefef;
  box-shadow: 3px 3px 8px #0000004b;
  border: 0.25em solid #efefef;
  border-radius: 5px;
  padding: 0.5em;
}

.add-new-card:hover {
  border: 0.25em solid #EA5151;
  color: #EA5151;
}

.icon {
  margin-right: 0.5em;
}
.icon:hover {
  color: #EA5151;
}
</style>
