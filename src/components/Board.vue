<template>
  <div class="board" :id="board._id" @dragover.prevent @drop.prevent="drop">
    <div class="board-title" @mouseenter="toggleBoardHover" @mouseleave="toggleBoardHover">
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

<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue";
import { usePlanningStore } from "@/store/planning";
import Card from "./Card.vue";
import type { board, card } from "@/types";
import type { CardByBoard } from "@/dataService";

const props = defineProps<{ board: board }>();
const planningStore = usePlanningStore();

const isNewCardInputVisible = ref(false);
const isBoardHovered = ref(false);
const newCardTitle = ref("");
const contentTextArea = ref<HTMLTextAreaElement | null>(null);

function toggleNewCardInput() {
  isNewCardInputVisible.value = !isNewCardInputVisible.value;
  if (isNewCardInputVisible.value) {
    nextTick(() => {
      contentTextArea.value?.focus();
    });
  }
}

function toggleBoardHover() {
  isBoardHovered.value = !isBoardHovered.value;
}

function removeBoard() {
  planningStore.deleteBoard(props.board);
}

function addNewCardToBoard() {
  if (newCardTitle.value !== "") {
    // Generate new _id by incrementing the last card's index (as string)
    let newId = "0";
    const cards = props.board.cards;
    if (cards.length > 0) {
      const lastCard = cards[cards.length - 1];
      // Try to parse last card's _id as int, increment, fallback to string increment
      const lastIdNum = parseInt(lastCard._id, 10);
      if (!isNaN(lastIdNum)) {
        newId = (lastIdNum + 1).toString();
      } else {
        // fallback: append timestamp
        newId = `${Date.now()}`;
      }
    }
    const newCard = {
      board: props.board._id,
      comments: [],
      title: newCardTitle.value.trim(),
      description: "",
      picture: "",
      createdOn: new Date(),
      dueOn: new Date(),
      assignee: planningStore.myUser, // or set to a default user
      _id: newId,
    };
    planningStore.createCard(newCard);
    newCardTitle.value = "";
  }
}

function drop(e: DragEvent) {
  const cardId = e.dataTransfer?.getData("card_id");
  const cardDragged = e.dataTransfer?.getData("dragged_card");
  if (!cardId || !cardDragged) return;
  const cardObj = JSON.parse(cardDragged) as card;
  const dropYPosition = e.pageY;
  let isBoardUpdated = false;
  for (let i = 0; i < props.board.cards.length; i++) {
    const cardYPosition = document.getElementById(props.board.cards[i]._id);
    if (cardYPosition && cardYPosition.getBoundingClientRect().y > dropYPosition) {
      planningStore.updateCardByBoard(cardObj, {
        card: cardObj,
        newBoard: props.board,
        boardInsertIndex: i,
      });
      isBoardUpdated = true;
      break;
    }
  }
  if (!isBoardUpdated) {
    planningStore.updateCardByBoard(cardObj, {
      card: cardObj,
      newBoard: props.board,
      boardInsertIndex: props.board.cards.length,
    });
  }
}

onMounted(() => {
  window.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
      isNewCardInputVisible.value = false;
    }
  });
});
</script>

<style scoped>
.board {
  background: #bebebe 0% 0% no-repeat padding-box;
  color: #000000;
  width: 340px;
  height: fit-content;
  margin: 0.5em;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.1s ease;
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
  border: 0.25em solid #ea5151;
  color: #ea5151;
}

.icon {
  margin-right: 0.5em;
}
.icon:hover {
  color: #ea5151;
}
</style>
