<template>
  <div class="card-modal" :class="{ active: isActive }">
    <div class="modal-content">
      <span class="close-button" @click="toggleModal">&times;</span>
      <h2>{{ card.title }}</h2>

      <Comment v-for="comment in card.comments" :comment="comment" :key="comment._id" />

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

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { card, user } from "../board";
import { Action, Mutation, State } from "vuex-class";
import Comment from "./Comment.vue";
const ESC_KEY_CODE = 27;

@Component({
  components: {
    Comment
  }
})
export default class CommentModal extends Vue {
  @Action createComment;
  @Action deleteComment;
  @Mutation setCommentsModalIsActive;
  @State("myUser") storeMyUser: user;
  @State("selectedCard") card!: card;
  @State("commentsModalIsActive") isActive: boolean;
  private isNewCommentInputVisible = false;
  private newCommentContent = "";

  public toggleNewCommentInput() {
    this.isNewCommentInputVisible = !this.isNewCommentInputVisible;
    if (this.isNewCommentInputVisible) {
      this.$nextTick(() => {
        (this.$refs.contextCommentArea as HTMLElement).focus();
      });
    }
  }

  toggleModal() {
    this.setCommentsModalIsActive(!this.isActive);
  }

  addCommentToCard() {
    if (this.newCommentContent !== "") {
      const newComment = {
        newComment: {
          card: this.card._id,
          content: this.newCommentContent.trim(),
          createdOn: new Date()
        },
        board: this.card.board
      };
      this.createComment(newComment);
      this.newCommentContent = "";
    }
  }

  mounted() {
    window.addEventListener("keyup", e => {
      if (e.keyCode === ESC_KEY_CODE) {
        this.setCommentsModalIsActive(false);
      }
    });
  }
}
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
