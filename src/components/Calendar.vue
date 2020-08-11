<template>
  <div class="calendar">
    <div class="task-list">
      <h2>{{ cardDate }}</h2>
      <ul>
        <li v-for="card in userCards" :key="card._id">
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
        </li>
      </ul>
    </div>
    <div class="datepicker">
      <DatePicker :inline="true" v-model="currentDate"></DatePicker>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DatePicker from "vuejs-datepicker";
import { card } from "@/board";
import { Action, State } from "vuex-class";
import moment from "moment";

@Component({
  components: {
    DatePicker
  }
})
export default class Calendar extends Vue {
  @Action getCardsByUser;
  @State("userCards") storeUserCards: card[];
  private currentDate = new Date();

  get userCards() {
    if (this.storeUserCards.length > 0) {
      return this.storeUserCards.filter(c => {
        const storeDate = new Date(c.dueOn);
        return (
          this.currentDate.getDay() === storeDate.getDay() &&
          this.currentDate.getMonth() === storeDate.getMonth() &&
          this.currentDate.getFullYear() === storeDate.getFullYear()
        );
      });
    }
    return this.storeUserCards;
  }

  get cardDate() {
    if (this.currentDate) {
      const formattedDate = moment(this.currentDate).format("MMM DD, YYYY");
      return formattedDate;
    }
    return "";
  }

  mounted() {
    this.getCardsByUser();
  }
}
</script>

<style scoped>
.calendar {
  display: flex;
  flex-direction: row;
  margin: 0.25em;
}

.task-list {
  width: 107vh;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.task-list h2 {
  margin: 0.5em;
  color: #ea5151;
  font-size: xx-large;
  font-weight: 500;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.task-list ul {
  width: 40%;
  align-self: center;
}

.task-list ul li {
  list-style-type: none;
  margin: 0.5em;
  background-color: #ffffff;
  transition: all 0.1s ease;
  color: #000000;
  box-shadow: 3px 3px 6px #2e2d2d29;
  border-radius: 10px;
}

.task-list ul li h3 {
  color: #ea5151;
  font-size: x-large;
}

.task-list ul li:hover {
  border-top: 5px solid #ea5151;
}
</style>