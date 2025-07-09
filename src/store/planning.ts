import { defineStore } from "pinia";
import type { board, card, comment, project, user, userInfo } from "../types";
import { type CardByBoard, dataService } from "../dataService";

export interface PlanState {
  commentsModalIsActive: boolean;
  modalIsActive: boolean;
  myUser: user;
  projects: project[];
  selectedCardId: string | null;
  selectedCardBoardId: string | null;
  selectedProjectId: string | null;
  settingsError: string[];
  userCards: card[];
}

export const usePlanningStore = defineStore("planning", {
  state: (): PlanState => ({
    commentsModalIsActive: false,
    modalIsActive: false,
    myUser: {
      token: "madsStrings",
      name: "Mads Nielsen",
      email: "me@mail.com",
      picture: "/profile.png",
    },
    projects: [],
    selectedCardId: null,
    selectedCardBoardId: null,
    selectedProjectId: null,
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
        const project = this.projects.find((p) => p._id === payload.project);
        if (project) {
          project.boards.push(savedBoard);
        }
      } catch (error) {
        console.error("Error creating board:", error);
      }
    },
    async createCard(newCard: card) {
      try {
        const savedCard = await dataService.createCard(newCard, this.myUser);
        const project = this.selectedProject;
        if (project) {
          const boardIndex = project.boards.findIndex((board) => board._id === savedCard.board);
          if (boardIndex !== -1) {
            project.boards[boardIndex].cards.push(savedCard);
          }
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
        const project = this.selectedProject;
        if (project) {
          const boardIndex = project.boards.findIndex((board) => board._id === payload.board);
          if (boardIndex !== -1) {
            const cardIndex = project.boards[boardIndex].cards.findIndex(
              (card) => card._id === payload.newComment.card,
            );
            if (cardIndex !== -1) {
              project.boards[boardIndex].cards[cardIndex].comments.push(savedComment);
            }
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
        const project = this.selectedProject;
        if (project) {
          project.boards = project.boards.filter((b) => b._id !== board._id);
        }
      } catch (error) {
        console.error("Error deleting board:", error);
      }
    },
    async deleteCard(card: card) {
      try {
        await dataService.deleteCard(card, this.myUser);
        const project = this.selectedProject;
        if (project) {
          for (const board of project.boards) {
            const cardIndex = board.cards.findIndex((c) => c._id === card._id);
            if (cardIndex !== -1) {
              board.cards.splice(cardIndex, 1);
              break;
            }
          }
        }
      } catch (error) {
        console.error("Error deleting card:", error);
      }
    },
    async deleteComment(comment: comment) {
      try {
        await dataService.deleteComment(comment, this.myUser);
        const project = this.selectedProject;
        if (project) {
          for (const board of project.boards) {
            for (const card of board.cards) {
              const commentIndex = card.comments.findIndex((c) => c._id === comment._id);
              if (commentIndex !== -1) {
                card.comments.splice(commentIndex, 1);
                return;
              }
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
    async updateCard(modifiedCard: card): Promise<card | undefined> {
      try {
        const resultCard = await dataService.updateCard(modifiedCard, this.myUser);
        const project = this.selectedProject;
        if (project) {
          const boardIndex = project.boards.findIndex((board) => board._id === resultCard.board);
          if (boardIndex !== -1) {
            const cardIndex = project.boards[boardIndex].cards.findIndex(
              (c) => c._id === resultCard._id,
            );
            if (cardIndex !== -1) {
              project.boards[boardIndex].cards[cardIndex] = resultCard;
              // Set selectedCard to the updated card in the array (reactive reference)
              this.selectedCardId = resultCard._id;
              this.selectedCardBoardId = resultCard.board;
              return project.boards[boardIndex].cards[cardIndex];
            }
          }
        }
        return undefined;
      } catch (error) {
        console.error("Error updating card:", error);
        return undefined;
      }
    },
    async updateCardByBoard(modifiedCard: card, cardInfo: CardByBoard) {
      try {
        // Store the original board id before the update
        const originalBoardId = cardInfo.card.board;
        const resultCard = await dataService.updateCardByBoard(cardInfo, this.myUser);
        const project = this.selectedProject;
        if (project) {
          // Remove card from the original board
          const oldBoardIndex = project.boards.findIndex((board) => board._id === originalBoardId);
          if (oldBoardIndex !== -1) {
            const oldCardIndex = project.boards[oldBoardIndex].cards.findIndex(
              (c) => c._id === resultCard._id,
            );
            if (oldCardIndex !== -1) {
              project.boards[oldBoardIndex].cards.splice(oldCardIndex, 1);
            }
          }
          // Add card to new board at the correct index
          const newBoardIndex = project.boards.findIndex(
            (board) => board._id === cardInfo.newBoard._id,
          );
          if (newBoardIndex !== -1) {
            project.boards[newBoardIndex].cards.splice(cardInfo.boardInsertIndex, 0, resultCard);
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
      localStorage.setItem("currentProjectId", this.selectedProjectId || "");
    },
    saveUserLocally(user: user) {
      const parsedUser = JSON.stringify(user);
      localStorage.setItem("planningUser", parsedUser);
    },
  },
  // Optionally, add getters here
  getters: {
    selectedProject(state): project | undefined {
      return state.projects.find((p) => p._id === state.selectedProjectId);
    },
    selectedCard(state): card | undefined {
      const project = state.projects.find((p) => p._id === state.selectedProjectId);
      if (!project) return undefined;
      const board = project.boards.find((b) => b._id === state.selectedCardBoardId);
      if (!board) return undefined;
      return board.cards.find((c) => c._id === state.selectedCardId);
    },
  },
});
