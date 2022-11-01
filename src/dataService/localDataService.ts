import { board, card, comment, project, user, userInfo } from "../board";
import { AbstractDataService, CardByBoard } from "./index";

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
      return;
    }
    const curProject = this.getCurrentProject();
    const projectIndex = parseInt(curProject._id);
    const resultCards: card[] = [];
    for (let i = 0; i < localProjects[projectIndex].boards.length; i++) {
      for (
        let j = 0;
        j < localProjects[projectIndex].boards[i].cards.length;
        j++
      ) {
        const curCard = localProjects[projectIndex].boards[i].cards[j];
        if ((curCard.assignee.token === user.token)) {
          resultCards.push(curCard);
        }
      }
    }
    return resultCards;
  }

  async createBoard(
    newBoardName: string,
    projectId: string,
    user: user
  ): Promise<board> {
    const localProjects = await this.getAllProjects(user);
    if (!localProjects) {
      return;
    }
    const projectIndex = parseInt(projectId);
    const boardId = localProjects[projectIndex].boards.length;
    const newBoard: board = {
      name: newBoardName,
      user,
      cards: [],
      _id: boardId.toString(),
      project: projectId,
    } as board;
    localProjects[projectId].boards.push(newBoard);
    this.saveProjectsLocally(localProjects);
    return newBoard;
  }

  async createCard(newCard: card, user: user): Promise<card> {
    const localProjects = await this.getAllProjects(user);
    if (!localProjects) {
      return;
    }
    const curProject = this.getCurrentProject();
    const projectIndex = parseInt(curProject._id);
    newCard._id = localProjects[projectIndex].boards[
      newCard.board
    ].cards.length.toString();
    newCard.assignee = user;
    localProjects[projectIndex].boards[newCard.board].cards.push(newCard);
    this.saveProjectsLocally(localProjects);
    return newCard;
  }

  async createComment(
    newComment: comment,
    user: user,
    board?: string
  ): Promise<comment> {
    const localProjects = await this.getAllProjects(user);
    if (!localProjects) {
      return;
    }
    const curProject = this.getCurrentProject();
    const projectIndex = parseInt(curProject._id);
    newComment._id = localProjects[projectIndex].boards[parseInt(board)].cards[
      parseInt(newComment.card)
    ].comments.length.toString();
    newComment.createdBy = user;

    localProjects[projectIndex].boards[parseInt(board)].cards[
      parseInt(newComment.card)
    ].comments.push(newComment);
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
      return;
    }
    const boardId = localProjects[board.project].boards.findIndex(
      (b) => b._id === board._id
    );
    const deletedBoard = localProjects[board.project].boards.splice(boardId, 1);
    this.saveProjectsLocally(localProjects);
    return deletedBoard as board;
  }

  async deleteCard(card: card, user: user): Promise<card> {
    const localProjects = await this.getAllProjects(user);
    if (!localProjects) {
      return;
    }
    const curProject = this.getCurrentProject();
    const projectIndex = parseInt(curProject._id);
    const cardId = localProjects[projectIndex].boards[
      parseInt(card.board)
    ].cards.findIndex((c) => c._id === card._id);
    const deletedCard = localProjects[projectIndex].boards[
      parseInt(card.board)
    ].cards.splice(cardId, 1);
    this.saveProjectsLocally(localProjects);
    return deletedCard[0] as card;
  }

  async deleteComment(
    comment: comment,
    user: user,
    board?: string
  ): Promise<comment> {
    const localProjects = await this.getAllProjects(user);
    if (!localProjects) {
      return;
    }
    const curProject = this.getCurrentProject();
    const projectIndex = parseInt(curProject._id);
    const deletedComment = localProjects[projectIndex].boards[
      parseInt(board)
    ].cards[parseInt(comment.card)].comments.splice(parseInt(comment._id), 1);
    this.saveProjectsLocally(localProjects);
    return deletedComment[0] as comment;
  }

  async updateCard(newCard: card, user: user): Promise<card> {
    const localProjects = await this.getAllProjects(user);
    if (!localProjects) {
      return;
    }
    const curProject = this.getCurrentProject();
    const projectIndex = parseInt(curProject._id);
    const cardId = localProjects[projectIndex].boards[
      parseInt(newCard.board)
    ].cards.findIndex((c: card) => c._id === newCard._id);
    const updatedCard = localProjects[projectIndex].boards[
      parseInt(newCard.board)
    ].cards.splice(cardId, 1, newCard);
    this.saveProjectsLocally(localProjects);
    return updatedCard[0] as card;
  }

  async updateCardByBoard(cardInfo: CardByBoard, user: user): Promise<card> {
    const localProjects = await this.getAllProjects(user);
    if (!localProjects) {
      return;
    }
    const curProject = this.getCurrentProject();
    const projectIndex = parseInt(curProject._id);
    const cardId = localProjects[projectIndex].boards[
      parseInt(cardInfo.card.board)
    ].cards.findIndex((c: card) => c._id === cardInfo.card._id);
    localProjects[projectIndex].boards[
      parseInt(cardInfo.card.board)
    ].cards.splice(cardId, 1);
    cardInfo.card.board = cardInfo.newBoard._id;
    const updatedCard = localProjects[projectIndex].boards[
      parseInt(cardInfo.newBoard._id)
    ].cards.splice(cardInfo.boardInsertIndex, 0, cardInfo.card);
    this.saveProjectsLocally(localProjects);
    return updatedCard[0] as card;
  }

  async updateProject(newProject: project, user: user): Promise<project> {
    const localProjects = await this.getAllProjects(user);
    if (localProjects) {
      const projIndex = localProjects.findIndex(
        (p) => p._id === newProject._id
      );
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
