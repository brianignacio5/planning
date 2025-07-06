import type { board, card, comment, project, user, userInfo } from "../types";
import type { AbstractDataService, CardByBoard } from "./index";

class LocalDataService implements AbstractDataService {
  async getAllProjects(user: user): Promise<project[]> {
    const localProjects = localStorage.getItem("projects");
    if (localProjects) {
      try {
        const projects: project[] = JSON.parse(localProjects);
        return projects;
      } catch (error) {
        console.log(error);
        localStorage.removeItem("projects");
      }
    }
    return [];
  }

  saveProjectsLocally(projects: project[]) {
    const parsedProjects = JSON.stringify(projects);
    localStorage.setItem("projects", parsedProjects);
  }

  getCurrentProject() {
    const currentProject = localStorage.getItem("currentProject");
    if (currentProject) {
      try {
        const curProject: project = JSON.parse(currentProject);
        return curProject;
      } catch (error) {
        console.log(error);
        localStorage.removeItem("currentProject");
      }
    }
  }

  async getAllCardsOfUser(user: user): Promise<card[]> {
    const localProjects = await this.getAllProjects(user);
    if (!localProjects) {
      return [];
    }
    const curProject = this.getCurrentProject();
    if (!curProject) {
      return [];
    }
    const projectIndex = localProjects.findIndex((p) => p._id === curProject._id);
    if (projectIndex === -1) {
      return [];
    }
    const resultCards: card[] = [];
    for (let i = 0; i < localProjects[projectIndex].boards.length; i++) {
      for (let j = 0; j < localProjects[projectIndex].boards[i].cards.length; j++) {
        const curCard = localProjects[projectIndex].boards[i].cards[j];
        if (curCard.assignee && curCard.assignee.token === user.token) {
          resultCards.push(curCard);
        }
      }
    }
    return resultCards;
  }

  async createBoard(newBoardName: string, projectId: string, user: user): Promise<board> {
    const localProjects = await this.getAllProjects(user);
    if (!localProjects) {
      throw new Error("No local projects found");
    }
    const projectIndex = localProjects.findIndex((p) => p._id === projectId);
    if (projectIndex === -1) {
      throw new Error("Project not found");
    }
    const boardId = localProjects[projectIndex].boards.length;
    const newBoard: board = {
      name: newBoardName,
      user,
      cards: [],
      _id: boardId.toString(),
      project: projectId,
    } as board;
    localProjects[projectIndex].boards.push(newBoard);
    this.saveProjectsLocally(localProjects);
    return newBoard;
  }

  async createCard(newCard: card, user: user): Promise<card> {
    const localProjects = await this.getAllProjects(user);
    if (!localProjects) {
      throw new Error("No local projects found");
    }
    const curProject = this.getCurrentProject();
    if (!curProject) {
      throw new Error("No current project found");
    }
    const projectIndex = localProjects.findIndex((p) => p._id === curProject._id);
    if (projectIndex === -1) {
      throw new Error("Project not found");
    }
    const boardIndex = localProjects[projectIndex].boards.findIndex((b) => b._id === newCard.board);
    if (boardIndex === -1) {
      throw new Error("Board not found");
    }
    newCard._id = localProjects[projectIndex].boards[boardIndex].cards.length.toString();
    newCard.assignee = user;
    localProjects[projectIndex].boards[boardIndex].cards.push(newCard);
    this.saveProjectsLocally(localProjects);
    return newCard;
  }

  async createComment(newComment: comment, user: user, board?: string): Promise<comment> {
    const localProjects = await this.getAllProjects(user);
    if (!localProjects) {
      throw new Error("No local projects found");
    }
    const curProject = this.getCurrentProject();
    if (!curProject) {
      throw new Error("No current project found");
    }
    const projectIndex = localProjects.findIndex((p) => p._id === curProject._id);
    if (projectIndex === -1) {
      throw new Error("Project not found");
    }
    if (!board) {
      throw new Error("No board id provided");
    }
    const boardIndex = localProjects[projectIndex].boards.findIndex((b) => b._id === board);
    if (boardIndex === -1) {
      throw new Error("Board not found");
    }
    const cardIndex = localProjects[projectIndex].boards[boardIndex].cards.findIndex(
      (c) => c._id === newComment.card,
    );
    if (cardIndex === -1) {
      throw new Error("Card not found");
    }
    newComment._id =
      localProjects[projectIndex].boards[boardIndex].cards[cardIndex].comments.length.toString();
    newComment.createdBy = user;
    localProjects[projectIndex].boards[boardIndex].cards[cardIndex].comments.push(newComment);
    this.saveProjectsLocally(localProjects);
    return newComment;
  }

  async createProject(newProject: project, user: user): Promise<project> {
    let localProjects = await this.getAllProjects(user);
    newProject._id = localProjects ? localProjects.length.toString() : "0";
    newProject.users = [user];
    newProject.boards = [];
    if (localProjects && localProjects.length) {
      localProjects.push(newProject);
    } else {
      localProjects = [newProject];
    }
    this.saveProjectsLocally(localProjects);
    return newProject;
  }

  async deleteBoard(board: board, user: user): Promise<board> {
    const localProjects = await this.getAllProjects(user);
    if (!localProjects) {
      throw new Error("No local projects found");
    }
    const projectIndex = localProjects.findIndex((p) => p._id === board.project);
    if (projectIndex === -1) {
      throw new Error("Project not found");
    }
    const boardId = localProjects[projectIndex].boards.findIndex((b) => b._id === board._id);
    if (boardId === -1) {
      throw new Error("Board not found");
    }
    const deletedBoard = localProjects[projectIndex].boards.splice(boardId, 1);
    this.saveProjectsLocally(localProjects);
    return deletedBoard[0] as board;
  }

  async deleteCard(card: card, user: user): Promise<card> {
    const localProjects = await this.getAllProjects(user);
    if (!localProjects) {
      throw new Error("No local projects found");
    }
    const curProject = this.getCurrentProject();
    if (!curProject) {
      throw new Error("No current project found");
    }
    const projectIndex = localProjects.findIndex((p) => p._id === curProject._id);
    if (projectIndex === -1) {
      throw new Error("Project not found");
    }
    const boardIndex = localProjects[projectIndex].boards.findIndex((b) => b._id === card.board);
    if (boardIndex === -1) {
      throw new Error("Board not found");
    }
    const cardId = localProjects[projectIndex].boards[boardIndex].cards.findIndex(
      (c) => c._id === card._id,
    );
    if (cardId === -1) {
      throw new Error("Card not found");
    }
    const deletedCard = localProjects[projectIndex].boards[boardIndex].cards.splice(cardId, 1);
    this.saveProjectsLocally(localProjects);
    return deletedCard[0] as card;
  }

  async deleteComment(comment: comment, user: user, board?: string): Promise<comment> {
    const localProjects = await this.getAllProjects(user);
    if (!localProjects) {
      throw new Error("No local projects found");
    }
    const curProject = this.getCurrentProject();
    if (!curProject) {
      throw new Error("No current project found");
    }
    const projectIndex = localProjects.findIndex((p) => p._id === curProject._id);
    if (projectIndex === -1) {
      throw new Error("Project not found");
    }
    if (!board) {
      throw new Error("No board id provided");
    }
    const boardIndex = localProjects[projectIndex].boards.findIndex((b) => b._id === board);
    if (boardIndex === -1) {
      throw new Error("Board not found");
    }
    const cardIndex = localProjects[projectIndex].boards[boardIndex].cards.findIndex(
      (c) => c._id === comment.card,
    );
    if (cardIndex === -1) {
      throw new Error("Card not found");
    }
    const commentIndex = localProjects[projectIndex].boards[boardIndex].cards[
      cardIndex
    ].comments.findIndex((c) => c._id === comment._id);
    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }
    const deletedComment = localProjects[projectIndex].boards[boardIndex].cards[
      cardIndex
    ].comments.splice(commentIndex, 1);
    this.saveProjectsLocally(localProjects);
    return deletedComment[0] as comment;
  }

  async deleteProject(project: project, user: user): Promise<project> {
    const localProjects = await this.getAllProjects(user);
    if (!localProjects) {
      throw new Error("No local projects found");
    }
    const projectIndex = localProjects.findIndex((p) => p._id === project._id);
    if (projectIndex === -1) {
      throw new Error("Project not found");
    }
    const deletedProject = localProjects.splice(projectIndex, 1);
    this.saveProjectsLocally(localProjects);
    return deletedProject[0] as project;
  }

  async updateCard(newCard: card, user: user): Promise<card> {
    const localProjects = await this.getAllProjects(user);
    if (!localProjects) {
      throw new Error("No local projects found");
    }
    const curProject = this.getCurrentProject();
    if (!curProject) {
      throw new Error("No current project found");
    }
    const projectIndex = localProjects.findIndex((p) => p._id === curProject._id);
    if (projectIndex === -1) {
      throw new Error("Project not found");
    }
    const boardIndex = localProjects[projectIndex].boards.findIndex((b) => b._id === newCard.board);
    if (boardIndex === -1) {
      throw new Error("Board not found");
    }
    const cardId = localProjects[projectIndex].boards[boardIndex].cards.findIndex(
      (c: card) => c._id === newCard._id,
    );
    if (cardId === -1) {
      throw new Error("Card not found");
    }
    const updatedCard = localProjects[projectIndex].boards[boardIndex].cards.splice(
      cardId,
      1,
      newCard,
    );
    this.saveProjectsLocally(localProjects);
    return updatedCard[0] as card;
  }

  async updateCardByBoard(cardInfo: CardByBoard, user: user): Promise<card> {
    const localProjects = await this.getAllProjects(user);
    if (!localProjects) {
      throw new Error("No local projects found");
    }
    const curProject = this.getCurrentProject();
    if (!curProject) {
      throw new Error("No current project found");
    }
    const projectIndex = localProjects.findIndex((p) => p._id === curProject._id);
    if (projectIndex === -1) {
      throw new Error("Project not found");
    }
    // Store the original board id before changing it
    const oldBoardId = cardInfo.card.board;
    const oldBoardIndex = localProjects[projectIndex].boards.findIndex((b) => b._id === oldBoardId);
    if (oldBoardIndex === -1) {
      throw new Error("Old board not found");
    }
    const cardId = localProjects[projectIndex].boards[oldBoardIndex].cards.findIndex(
      (c: card) => c._id === cardInfo.card._id,
    );
    if (cardId === -1) {
      throw new Error("Card not found in old board");
    }
    // Remove from old board
    localProjects[projectIndex].boards[oldBoardIndex].cards.splice(cardId, 1);
    // Update card's board property
    cardInfo.card.board = cardInfo.newBoard._id;
    // Insert into new board at the correct index
    const newBoardIndex = localProjects[projectIndex].boards.findIndex(
      (b) => b._id === cardInfo.newBoard._id,
    );
    if (newBoardIndex === -1) {
      throw new Error("New board not found");
    }
    localProjects[projectIndex].boards[newBoardIndex].cards.splice(
      cardInfo.boardInsertIndex,
      0,
      cardInfo.card,
    );
    this.saveProjectsLocally(localProjects);
    return cardInfo.card;
  }

  async updateProject(newProject: project, user: user): Promise<project> {
    const localProjects = await this.getAllProjects(user);
    if (localProjects) {
      const projIndex = localProjects.findIndex((p) => p._id === newProject._id);
      localProjects.splice(projIndex, 1, newProject);
      this.saveProjectsLocally(localProjects);
    }
    return newProject;
  }

  async updateUserInfo(userInfo: userInfo, user: user): Promise<user> {
    const updatedUser = {
      email: userInfo.email || user.email,
      name: userInfo.name || user.name,
      picture: userInfo.picture || user.picture,
    };
    return updatedUser as user;
  }
}

export default new LocalDataService();
