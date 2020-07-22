import http from "./http-common";

class PlanningDataService {
  loginUserByGithub() {
    return http.get("auth/github");
  }
}

export default new PlanningDataService();