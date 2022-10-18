import { board, card, comment, project, user, userInfo } from "@/board";
import LocalDataService from "./localDataService";
import PlanningDataService from "./onlineDataService";

interface AbstractDataService {
  getAllProjects(user: user): Promise<project[]>;
  getAllCardsOfUser(user: user): Promise<card[]>;
  createBoard(
    newBoardName: string,
    projectId: string,
    user: user
  ): Promise<board>;
  createCard(newCard: card, user: user): Promise<card>;
  createComment(newComment: comment, user: user): Promise<comment>;
  createProject(newProject: project, user: user): Promise<project>;
  deleteBoard(board: board, user: user): Promise<board>;
  deleteCard(card: card, user: user): Promise<card>;
  deleteComment(comment: comment, user: user): Promise<comment>;
  updateCard(newCard: card, user: user): Promise<card>;
  updateProject(newProject: project, user: user): Promise<project>;
  updateUserInfo(userInfo: userInfo, user: user): Promise<user>;
}

const dataService = process.env.BACKEND_URL
  ? PlanningDataService
  : LocalDataService;

export { AbstractDataService, dataService };
