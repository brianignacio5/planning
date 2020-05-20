import Vue from "vue";
import Vuex from "vuex";
import { board, card } from "../board";
import { myBoards } from "./myBoards";
import { mutations } from "./mutations";
Vue.use(Vuex);

export interface PlanState {
  boards: board[];
  modalIsActive: boolean;
  selectedCard: card;
}

export const planningState: PlanState = {
  boards: myBoards, // [],
  modalIsActive: false,
  selectedCard: {
    assignee: { id: "", name: "" },
    comments: [],
    description: "",
    id: "",
    owner: { id: "", name: "" },
    title: ""
  }
};


export default new Vuex.Store({
  state: planningState,
  mutations,
  actions: {},
  modules: {}
});
