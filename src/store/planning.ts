import { defineStore } from "pinia";
import type { board, card, comment, project, user, userInfo } from "../types";
import { type CardByBoard, dataService } from "../dataService";

export interface PlanState {
  boards: board[];
  commentsModalIsActive: boolean;
  modalIsActive: boolean;
  myUser: user;
  projects: project[];
  selectedCard: card;
  selectedProject: project;
  settingsError: string[];
  userCards: card[];
}

export const usePlanningStore = defineStore("planning", {
  state: (): PlanState => ({
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
      assignee: {
        token: "madsStrings",
        name: "Mads Nielsen",
        email: "me@mail.com",
        picture: "./profile.png",
      },
      board: "",
      comments: [],
      createdOn: new Date(),
      description: "",
      dueOn: new Date(),
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
      _id: "",
    },
    settingsError: [],
    userCards: [],
  }),
  actions: {
    async getProjects() {
      try {
        const projects = await dataService.getAllProjects(this.myUser);
        this.projects = projects;
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    },
    async getCardsByUser() {
      try {
        const cardsByUser = await dataService.getAllCardsOfUser(this.myUser);
        this.userCards = cardsByUser;
      } catch (error) {
        console.error("Error fetching user cards:", error);
      }
    },
    async createBoard(payload: { name: string; project: string }) {
      try {
        const savedBoard = await dataService.createBoard(
          payload.name,
          payload.project,
          this.myUser,
        );
        this.boards.push(savedBoard);
      } catch (error) {
        console.error("Error creating board:", error);
      }
    },
    async createCard(newCard: card) {
      try {
        const savedCard = await dataService.createCard(newCard, this.myUser);
        const boardIndex = this.boards.findIndex((board) => board._id === savedCard.board);
        if (boardIndex !== -1) {
          this.boards[boardIndex].cards.push(savedCard);
        }
      } catch (error) {
        console.error("Error creating card:", error);
      }
    },
    async createComment(payload: { newComment: comment; board: string }) {
      try {
        const savedComment = await dataService.createComment(
          payload.newComment,
          this.myUser,
          payload.board,
        );
        // Update the relevant card with the new comment
        const boardIndex = this.boards.findIndex((board) => board._id === payload.board);
        if (boardIndex !== -1) {
          const cardIndex = this.boards[boardIndex].cards.findIndex(
            (card) => card._id === payload.newComment.card,
          );
          if (cardIndex !== -1) {
            this.boards[boardIndex].cards[cardIndex].comments.push(savedComment);
          }
        }
      } catch (error) {
        console.error("Error creating comment:", error);
      }
    },
    async createProject(newProject: project) {
      try {
        const savedProject = await dataService.createProject(newProject, this.myUser);
        this.projects.push(savedProject);
      } catch (error) {
        console.error("Error creating project:", error);
      }
    },
    async deleteBoard(board: board) {
      try {
        await dataService.deleteBoard(board, this.myUser);
        this.boards = this.boards.filter((b) => b._id !== board._id);
      } catch (error) {
        console.error("Error deleting board:", error);
      }
    },
    async deleteCard(card: card) {
      try {
        await dataService.deleteCard(card, this.myUser);
        for (const board of this.boards) {
          const cardIndex = board.cards.findIndex((c) => c._id === card._id);
          if (cardIndex !== -1) {
            board.cards.splice(cardIndex, 1);
            break;
          }
        }
      } catch (error) {
        console.error("Error deleting card:", error);
      }
    },
    async deleteComment(comment: comment) {
      try {
        await dataService.deleteComment(comment, this.myUser);
        for (const board of this.boards) {
          for (const card of board.cards) {
            const commentIndex = card.comments.findIndex((c) => c._id === comment._id);
            if (commentIndex !== -1) {
              card.comments.splice(commentIndex, 1);
              return;
            }
          }
        }
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    },
    async deleteProject(project: project) {
      try {
        await dataService.deleteProject(project, this.myUser);
        this.projects = this.projects.filter((p) => p._id !== project._id);
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    },
    async updateCard(modifiedCard: card) {
      try {
        const resultCard = await dataService.updateCard(modifiedCard, this.myUser);
        const boardIndex = this.boards.findIndex((board) => board._id === resultCard.board);
        if (boardIndex !== -1) {
          const cardIndex = this.boards[boardIndex].cards.findIndex(
            (c) => c._id === resultCard._id,
          );
          if (cardIndex !== -1) {
            this.boards[boardIndex].cards[cardIndex] = resultCard;
          }
        }
      } catch (error) {
        console.error("Error updating card:", error);
      }
    },
    async updateCardByBoard(modifiedCard: card, cardInfo: CardByBoard) {
      try {
        const resultCard = await dataService.updateCardByBoard(cardInfo, this.myUser);
        const boardIndex = this.boards.findIndex((board) => board._id === resultCard.board);
        if (boardIndex !== -1) {
          const cardIndex = this.boards[boardIndex].cards.findIndex(
            (c) => c._id === resultCard._id,
          );
          if (cardIndex !== -1) {
            this.boards[boardIndex].cards[cardIndex] = resultCard;
          }
        }
      } catch (error) {
        console.error("Error updating card:", error);
      }
    },
    async updateProject(modifiedProject: project) {
      try {
        const resultProject = await dataService.updateProject(modifiedProject, this.myUser);
        const projectIndex = this.projects.findIndex((p) => p._id === resultProject._id);
        if (projectIndex !== -1) {
          this.projects[projectIndex] = resultProject;
        }
      } catch (error) {
        console.error("Error updating project:", error);
      }
    },
    async updateUserInfo(info: userInfo) {
      try {
        const resultUser = await dataService.updateUserInfo(info, this.myUser);
        this.myUser = resultUser;
      } catch (error) {
        console.error("Error updating user info:", error);
      }
    },
    setCurrentProject() {
      const parsedProject = JSON.stringify(this.selectedProject);
      localStorage.setItem("currentProject", parsedProject);
    },
    saveUserLocally(user: user) {
      const parsedUser = JSON.stringify(user);
      localStorage.setItem("planningUser", parsedUser);
    },
  },
  // Optionally, add getters here
});
