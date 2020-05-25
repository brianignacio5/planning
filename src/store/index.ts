import Vue from "vue";
import Vuex, { ActionTree } from "vuex";
import { board, card } from "../board";
import { mutations } from "./mutations";
Vue.use(Vuex);

export interface PlanState {
  boards: board[];
  modalIsActive: boolean;
  selectedCard: card;
}

export const planningState: PlanState = {
  boards: [],
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

export const actions: ActionTree<PlanState, any> = {
  getBoardsLocally(context) {
    const localBoards = localStorage.getItem("boards");
    if (localBoards) {
      try {
        const boards = JSON.parse(localBoards);
        context.commit("setBoards", boards);
      } catch (error) {
        console.log(error);
        localStorage.removeItem("boards");
      }
    }
  },
  saveBoardsLocally(context) {
    const parsedBoards = JSON.stringify(context.state.boards);
    localStorage.setItem("boards", parsedBoards);
  }
};

export default new Vuex.Store({
  state: planningState,
  mutations,
  actions,
  modules: {}
});
