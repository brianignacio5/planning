<template>
  <div
    :id="card.id"
    class="card"
    @dragstart="dragStart"
    @dragover.stop
    :draggable="true"
    @mouseenter="toggleCardHover"
    @mouseleave="toggleCardHover"
  >
    <div class="picture" v-if="card.picture">
      <img :src="card.picture" alt="card-picture" />
    </div>
    <div class="card-content">
      <div class="main-card" @click="showComments">
        <div class="small-card-title">
          <span>
            {{ card.title }}
          </span>
          <div>{{ cardDate }}</div>
        </div>
        <p>{{ card.description }}</p>
      </div>
      <div class="edit-card" v-if="isCardHovered" @click="showDetail">
        <faIcon icon="edit" class="icon" />
      </div>
      <div class="delete-card" v-if="isCardHovered" @click="removeCard">
        <faIcon icon="times" class="icon" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { card } from "../board";
import { Action, Mutation } from "vuex-class";
import moment from "moment";

@Component
export default class Card extends Vue {
  @Action private saveBoardsLocally;
  @Action private deleteCard;
  @Prop() card!: card;
  @Mutation setCommentsModalIsActive;
  @Mutation setModalIsActive;
  @Mutation setSelectedCard;
  @Mutation("removeCard") removeCardById;
  private isCardHovered = false;

  public toggleCardHover() {
    this.isCardHovered = !this.isCardHovered;
  }

  public dragStart(e) {
    e.dataTransfer.dropEffect = "move";
    console.log(this.card);
    e.dataTransfer.setData("card_id", this.card._id);
  }

  get cardDate() {
    if (this.card.createdOn) {
      const formattedDate = moment(this.card.createdOn.toString()).format(
        "MMM DD, YYYY"
      );
      return formattedDate;
    }
    return "";
  }

  removeCard() {
    this.deleteCard(this.card._id);
    this.removeCardById(this.card._id);
    this.saveBoardsLocally();
  }

  public showDetail() {
    this.setSelectedCard(this.card);
    this.setModalIsActive(true);
  }

  public showComments() {
    this.setSelectedCard(this.card);
    this.setCommentsModalIsActive(true);
  }
}
</script>

<style scoped>
.card {
  background-color: #efefef;
  color: #000000;
  box-shadow: 3px 3px 6px #2e2d2d29;
  border-radius: 5px;
  margin: 0.5em;
  display: flex;
  flex-direction: column;
  justify-items: center;
  width: 320px;
}
.card p {
  margin: 0 15px 15px;
  transition: all 0.3s ease;
}

.card-content {
  display: flex;
  flex-direction: row;
}

.main-card {
  width: -webkit-fill-available;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.small-card-title {
  display: flex;
  flex-direction: column;
  margin: 10px 0 5px 15px;
}
.small-card-title span {
  font-weight: bold;
  font-size: x-large;
}

.small-card-title div {
  font-size: x-small;
  text-align: left;
}

.icon {
  margin: 1em;
}
.icon:hover {
  color: #3f87ce;
}

.delete-card,
.edit-card {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2em;
  transition: all 0.3s ease;
}

.delete-card:hover {
  width: 5em;
  background-color: #ea5151;
}

.edit-card:hover {
  width: 5em;
  background-color: #f2db8f;
}

.picture {
  width: -webkit-fill-available;
  height: 125px;
  display: flex;
  align-items: center;
  justify-content: center;
  object-fit: cover;
}

.picture img {
  width: 100%;
  height: 100%;
  border-radius: 5px 5px 0 0;
  object-fit: cover;
}
</style>
