<template>
  <div class="comment">
    <div class="profile-pic">
      <img :src="comment.createdBy.picture || './profile.png'" alt="profile-pic" />
    </div>
    <div class="comment-content">
      <div class="comment-content-title">
        <p class="comment-name">{{comment.createdBy.name || "username"}}</p>
        <p class="small">{{cardDate}}</p>
      </div>
      <p>{{comment.content}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { comment } from "../board";
import { Action, Mutation } from "vuex-class";
import moment from "moment";

@Component
export default class Comment extends Vue {
  @Prop() comment!: comment;
  get cardDate() {
    if (this.comment.createdOn) {
      const formattedDate = moment(this.comment.createdOn.toString()).format(
        "MMM DD, YYYY"
      );
      return formattedDate;
    }
    return "";
  }
}
</script>

<style scoped>
.comment {
  display: flex;
  justify-content: flex-start;
  background-color: #efefef;
  margin: 0.25em;
  align-items: center;
  justify-content: flex-start;
}
.comment-content {
  display: flex;
  flex-direction: column;
}
.comment-content-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 15em;
}
.small {
  font-size: x-small;
}

.comment-name {
  font-weight: bold;
}

</style>