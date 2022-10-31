<template>
  <div class="comment">
    <div class="profile-pic">
      <img
        :src="comment.createdBy.picture || './profile.png'"
        alt="profile-pic"
      />
    </div>
    <div class="comment-content">
      <div class="comment-content-title">
        <p class="comment-name">{{ comment.createdBy.name || "username" }}</p>
        <p class="small">{{ cardDate }}</p>
      </div>
      <div class="comment-content-text">{{ comment.content }}</div>
    </div>
    <div v-if="isCurrentUser" class="comment-btns">
      <div class="delete-comment">
        <faIcon icon="times" class="icon" @click="deleteThisComment" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { card, comment, user } from "../board";
import { Action, Mutation, State } from "vuex-class";
import moment from "moment";

@Component
export default class Comment extends Vue {
  @Action deleteComment;
  @Mutation removeComment;
  @Prop() card!: card;
  @Prop() comment!: comment;
  @State("myUser") storeMyUser: user;
  get cardDate() {
    if (this.comment.createdOn) {
      const formattedDate = moment(this.comment.createdOn.toString()).format(
        "MMM DD, YYYY"
      );
      return formattedDate;
    }
    return "";
  }

  get isCurrentUser() {
    return (
      this.comment.createdBy.email.localeCompare(this.storeMyUser.email) === 0
    );
  }

  deleteThisComment() {
    this.deleteComment({ comment: this.comment, board: this.card.board });
    this.removeComment(this.comment);
  }
}
</script>

<style scoped>
.comment {
  display: flex;
  background-color: #fff;
  margin: 0.25em;
  align-items: center;
  width: -webkit-fill-available;
}
.comment-content {
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  margin: 0.25em;
}
.comment-content-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: --webkit-fill-available;
}
.small {
  font-size: x-small;
}

.comment-name {
  font-weight: bold;
}

.comment-content-text {
  text-align: start;
}

.comment-btns {
  display: flex;
  margin: 0.2em;
}

.delete-comment {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1em;
  transition: all 0.3s ease;
  height: 100%;
}

.delete-comment:hover .icon {
  color: #ea5151;
}
</style>
