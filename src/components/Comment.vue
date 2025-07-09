<template>
  <div class="comment">
    <div class="profile-pic">
      <img :src="comment.createdBy.picture || '/profile.png'" alt="profile-pic" />
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

<script setup lang="ts">
import { computed } from "vue";
import { usePlanningStore } from "@/store/planning";
import type { card, comment } from "@/types";
import moment from "moment";

const props = defineProps<{ card: card; comment: comment }>();
const planningStore = usePlanningStore();

const cardDate = computed(() => {
  if (props.comment.createdOn) {
    return moment(props.comment.createdOn.toString()).format("MMM DD, YYYY");
  }
  return "";
});

const isCurrentUser = computed(() => {
  return props.comment.createdBy.email.localeCompare(planningStore.myUser.email) === 0;
});

function deleteThisComment() {
  planningStore.deleteComment(props.comment);
  // Optionally remove from local state if needed
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
