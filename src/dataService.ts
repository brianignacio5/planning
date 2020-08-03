import http from "./http-common";
import { card, board } from "./board";

class PlanningDataService {
  async getAllBoardsForUser(token: string) {
    const response = await http.get("http://localhost:3000/board", {
      headers: {
        Authorization: `${token}`,
      },
      withCredentials: true,
    });
    const boards: board[] = response.data;
    console.log(boards);
    return boards;
  }
  async createBoard(newBoardName: string, token: string) {
    const response = await http.post(
      "http://localhost:3000/board",
      { name: newBoardName },
      {
        headers: {
          Authorization: `${token}`,
        },
        withCredentials: true,
      }
    );
    const savedBoard: board = response.data;
    return savedBoard;
  }
  async deleteBoard(boardId: string, token: string) {
    const response = await http.delete(
      "http://localhost:3000/board/" + boardId,
      {
        headers: {
          Authorization: `${token}`,
        },
        withCredentials: true,
      }
    );
    const deletedBoard: board = response.data;
    return deletedBoard;
  }
  async createCard(newCard: card, token: string) {
    const response = await http.post("http://localhost:3000/card", newCard, {
      headers: {
        Authorization: `${token}`,
      },
      withCredentials: true,
    });
    const savedCard: card = response.data;
    return savedCard;
  }
  async updateCard(newCard: card, token: string) {
    const response = await http.put(
      `http://localhost:3000/card/${newCard._id}`,
      newCard,
      {
        headers: {
          Authorization: `${token}`,
        },
        withCredentials: true,
      }
    );
    console.log(response.data);
    const updateCard: card = response.data;
    return updateCard;
  }
  async deleteCard(cardId: string, token: string) {
    const response = await http.delete(
      `http://localhost:3000/card/${cardId}`,
      {
        headers: {
          Authorization: `${token}`,
        },
        withCredentials: true,
      }
    );
    console.log(response.data);
    const deletedCard: card = response.data;
    return deletedCard;
  }
}

export default new PlanningDataService();
