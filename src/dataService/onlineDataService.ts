import http from "../http-common";
import { board, card, comment, project, user, userInfo } from "../board";
import { AbstractDataService, CardByBoard } from "./index";

class PlanningDataService implements AbstractDataService {
  async getAllProjects(user: user) {
    const response = await http.get(`/project`, {
      headers: {
        Authorization: `${user.token}`,
      },
      withCredentials: true,
    });
    const projects: project[] = response.data;
    return projects;
  }

  async getAllCardsOfUser(user: user) {
    const response = await http.get("/card/user", {
      headers: {
        Authorization: `${user.token}`,
      },
      withCredentials: true,
    });
    const cards: card[] = response.data;
    return cards;
  }

  async createBoard(newBoardName: string, projectId: string, user: user) {
    const response = await http.post(
      "/board",
      { name: newBoardName, project: projectId },
      {
        headers: {
          Authorization: `${user.token}`,
        },
        withCredentials: true,
      }
    );
    const savedBoard: board = response.data;
    return savedBoard;
  }

  async createCard(newCard: card, user: user) {
    const response = await http.post("/card", newCard, {
      headers: {
        Authorization: `${user.token}`,
      },
      withCredentials: true,
    });
    const savedCard: card = response.data;
    return savedCard;
  }

  async createComment(newComment: comment, user: user) {
    const response = await http.post("/comment", newComment, {
      headers: {
        Authorization: `${user.token}`,
      },
      withCredentials: true,
    });
    const savedComment: comment = response.data;
    return savedComment;
  }

  async createProject(newProject: project, user: user) {
    const response = await http.post("/project", newProject, {
      headers: {
        Authorization: `${user.token}`,
      },
      withCredentials: true,
    });
    const savedProject: project = response.data;
    return savedProject;
  }

  async deleteBoard(board: board, user: user) {
    const response = await http.delete("/board/" + board._id, {
      headers: {
        Authorization: `${user.token}`,
      },
      withCredentials: true,
    });
    const deletedBoard: board = response.data;
    return deletedBoard;
  }

  async deleteCard(card: card, user: user) {
    const response = await http.delete(`/card/${card._id}`, {
      headers: {
        Authorization: `${user.token}`,
      },
      withCredentials: true,
    });
    const deletedCard: card = response.data;
    return deletedCard;
  }

  async deleteComment(comment: comment, user: user) {
    const response = await http.delete(`/comment/${comment._id}`, {
      headers: {
        Authorization: `${user.token}`,
      },
      withCredentials: true,
    });
    const deletedComment: comment = response.data;
    return deletedComment;
  }

  async updateCard(newCard: card, user: user) {
    const response = await http.put(`/card/${newCard._id}`, newCard, {
      headers: {
        Authorization: `${user.token}`,
      },
      withCredentials: true,
    });
    const updateCard: card = response.data;
    return updateCard;
  }

  async updateCardByBoard(cardInfo: CardByBoard, user: user) {
    cardInfo.card.board = cardInfo.newBoard._id;
    const response = await http.put(`/card/${cardInfo.card._id}`, cardInfo.card, {
      headers: {
        Authorization: `${user.token}`,
      },
      withCredentials: true,
    });
    const updateCard: card = response.data;
    return updateCard;
  }

  async updateProject(newProject: project, user: user) {
    const response = await http.put(`/project/${newProject._id}`, newProject, {
      headers: {
        Authorization: `${user.token}`,
      },
      withCredentials: true,
    });
    const updatedProject: project = response.data;
    return updatedProject;
  }

  async updateUserInfo(userInfo: userInfo, user: user) {
    const response = await http.put("/auth/user", userInfo, {
      headers: {
        Authorization: `${user.token}`,
      },
      withCredentials: true,
    });
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    const updatedUser: user = response.data;
    return updatedUser;
  }
}

export default new PlanningDataService();
