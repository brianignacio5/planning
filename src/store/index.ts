import Vue from "vue";
import Vuex, { ActionTree } from "vuex";
import { board, card, comment, project, user } from "../board";
import { mutations } from "./mutations";
import PlanningDataService from "../dataService";
Vue.use(Vuex);

export interface PlanState {
  boards: board[];
  commentsModalIsActive: boolean;
  modalIsActive: boolean;
  myUser: user;
  projects: project[];
  selectedCard: card;
  selectedProject: project;
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
};

export const actions: ActionTree<PlanState, any> = {
  async getProjectsLocally(context) {
    const onlineProjects = await PlanningDataService.getAllProjects(
      context.state.myUser.token
    );
    if (onlineProjects) {
      context.commit("setProjects", onlineProjects);
      return;
    }
    const localProjects = localStorage.getItem("projects");
    if (localProjects) {
      try {
        const projects = JSON.parse(localProjects);
        context.commit("setProjects", projects);
      } catch (error) {
        console.log(error);
        localStorage.removeItem("projects");
      }
    }
  },
  async createBoard(context, payload: { name: string; project: string }) {
    try {
      const savedBoard = await PlanningDataService.createBoard(
        payload.name,
        payload.project,
        context.state.myUser.token
      );
      context.state.boards.push(savedBoard);
    } catch (error) {
      console.log(error);
    }
  },
  async createCard(context, newCard: card) {
    try {
      const savedCard = await PlanningDataService.createCard(
        newCard,
        context.state.myUser.token
      );
      for (let i = 0; i < context.state.boards.length; i++) {
        const board = context.state.boards[i];
        if (board._id === savedCard.board) {
          context.state.boards[i].cards.push(savedCard);
          break;
        }
      }
      this.dispatch("saveBoardsLocally");
    } catch (error) {
      console.log(error);
    }
  },
  async createComment(
    context,
    payload: { newComment: comment; board: string }
  ) {
    try {
      const savedComment = await PlanningDataService.createComment(
        payload.newComment,
        context.state.myUser.token
      );
      for (let i = 0; i < context.state.boards.length; i++) {
        if (context.state.boards[i]._id === payload.board) {
          for (let j = 0; j < context.state.boards[i].cards.length; j++) {
            if (
              context.state.boards[i].cards[j]._id === payload.newComment.card
            ) {
              context.state.boards[i].cards[j].comments.push(savedComment);
              break;
            }
          }
        }
      }
      this.dispatch("saveBoardsLocally");
    } catch (error) {
      console.log(error);
    }
  },
  async createProject(context, newProject: project) {
    try {
      const savedProject = await PlanningDataService.createProject(
        newProject,
        context.state.myUser.token
      );
      context.state.projects.push(savedProject);
    } catch (error) {
      console.log(error);
    }
  },
  async deleteBoard(context, boardId: string) {
    try {
      const resultBoard = await PlanningDataService.deleteBoard(
        boardId,
        context.state.myUser.token
      );
    } catch (error) {
      console.log(error);
    }
  },
  async deleteCard(context, cardId: string) {
    try {
      const resultCard = await PlanningDataService.deleteCard(
        cardId,
        context.state.myUser.token
      );
    } catch (error) {
      console.log(error);
    }
  },
  async deleteComment(context, commentId: string) {
    try {
      const resultComment = await PlanningDataService.deleteComment(
        commentId,
        context.state.myUser.token
      );
    } catch (error) {
      console.log(error);
    }
  },
  async updateCard(context, modifiedCard: card) {
    try {
      const resultCard = await PlanningDataService.updateCard(
        modifiedCard,
        context.state.myUser.token
      );
    } catch (error) {
      console.log(error);
    }
  },
  saveBoardsLocally(context) {
    const parsedBoards = JSON.stringify(context.state.boards);
    localStorage.setItem("boards", parsedBoards);
  },
};

export default new Vuex.Store({
  state: planningState,
  mutations,
  actions,
  modules: {},
});
