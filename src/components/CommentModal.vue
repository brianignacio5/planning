<template>
  <div class="card-modal" :class="{ active: isActive }">
    <div class="modal-content">
      <span class="close-button" @click="toggleModal">&times;</span>
      <h2>{{ card.title }}</h2>

      <Comment
        v-for="comment in card.comments"
        :comment="comment"
        :card="card"
        :key="comment._id"
      />

      <div class="add-comment-input" v-if="isNewCommentInputVisible">
        <textarea
          cols="30"
          rows="3"
          ref="contextCommentArea"
          v-model="newCommentContent"
          @keyup.enter="addCommentToCard"
          placeholder="Comment title"
        ></textarea>
        <div class="add-sections-btns">
          <faIcon icon="plus" @click="addCommentToCard" class="icon" />
          <faIcon icon="times" @click="toggleNewCommentInput" class="icon" />
        </div>
      </div>
      <div v-else class="add-new-comment" @click="toggleNewCommentInput">
        <faIcon icon="plus" class="icon" />Add new comment
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from "vue";
import { usePlanningStore } from "@/store/planning";
import Comment from "./Comment.vue";

const planningStore = usePlanningStore();
const card = computed(() => planningStore.selectedCard);
const isActive = computed(() => planningStore.commentsModalIsActive);
const isNewCommentInputVisible = ref(false);
const newCommentContent = ref("");
const contextCommentArea = ref<HTMLTextAreaElement | null>(null);

function toggleNewCommentInput() {
  isNewCommentInputVisible.value = !isNewCommentInputVisible.value;
  if (isNewCommentInputVisible.value) {
    nextTick(() => {
      contextCommentArea.value?.focus();
    });
  }
}

function toggleModal() {
  planningStore.commentsModalIsActive = !planningStore.commentsModalIsActive;
}

function addCommentToCard() {
  if (newCommentContent.value !== "") {
    // Generate _id based on last comment index
    const comments = card.value.comments || [];
    let newId = "0";
    if (comments.length > 0) {
      const lastId = comments[comments.length - 1]._id;
      const lastNum = parseInt(lastId, 10);
      newId = isNaN(lastNum) ? `${comments.length}` : `${lastNum + 1}`;
    }
    const newComment = {
      newComment: {
        card: card.value._id,
        content: newCommentContent.value.trim(),
        createdOn: new Date(),
        _id: newId,
        createdBy: planningStore.myUser,
      },
      board: card.value.board,
    };
    planningStore.createComment(newComment);
    newCommentContent.value = "";
  }
}

onMounted(() => {
  window.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
      planningStore.commentsModalIsActive = false;
    }
  });
});
</script>

<style>
.add-new-comment {
  margin: 0.5em;
  transition: all 0.3s ease;
}
.add-new-comment:hover {
  background-color: #fff;
}
.add-sections-btns {
  display: flex;
  justify-content: space-around;
}
</style>
