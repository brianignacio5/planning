import Vue from "vue";
import Vuex, { ActionTree } from "vuex";
import { board, card, user } from "../board";
import { mutations } from "./mutations";
import PlanningDataService from "../dataService";
Vue.use(Vuex);

export interface PlanState {
  boards: board[];
  modalIsActive: boolean;
  myUser: user;
  selectedCard: card;
}

export const planningState: PlanState = {
  boards: [],
  modalIsActive: false,
  myUser: {
    token: "madsStrings",
    name: "Mads Nielsen",
    picture:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
  },
  selectedCard: {
    assignee: { token: "", name: "", picture: "" },
    comments: [],
    createdOn: new Date(),
    description: "",
    id: "",
    owner: { token: "", name: "", picture: "" },
    picture: "",
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
  async loginByGithub() {
    try {
      const requestedUser = await PlanningDataService.loginUserByGithub();
      console.log(requestedUser.data);
    } catch (error) {
      console.log(error);
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
