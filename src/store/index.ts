import Vue from "vue";
import Vuex from "vuex";
import { board, card, project, user } from "../board";
import { mutations } from "./mutations";
import { actions } from "./actions";
Vue.use(Vuex);

export interface PlanState {
  boards: board[];
  commentsModalIsActive: boolean;
  modalIsActive: boolean;
  myUser: user;
  projects: project[];
  selectedCard: card;
  selectedProject: project;
  settingsError: string[];
}

export const planningState: PlanState = {
  boards: [],
  commentsModalIsActive: false,
  modalIsActive: false,
  myUser: {
    token: "madsStrings",
    name: "Mads Nielsen",
    email: "me@mail.com",
    picture: "./profile.png",
  },
  projects: [],
  selectedCard: {
    board: "",
    comments: [],
    createdOn: new Date(),
    description: "",
    _id: "",
    picture: "",
    title: "",
  },
  selectedProject: {
    boards: [],
    createdOn: new Date(),
    name: "",
    description: "",
    users: [],
    _id: ""
  },
  settingsError: [],
};

export default new Vuex.Store({
  state: planningState,
  mutations,
  actions,
  modules: {},
});
