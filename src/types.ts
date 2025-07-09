export interface board {
  _id: string;
  name: string;
  user: user;
  project: string;
  cards: card[];
}

export interface card {
  assignee: user;
  board: string;
  comments: comment[];
  createdOn: Date;
  description: string;
  dueOn: Date;
  _id: string;
  picture: string;
  title: string;
}

export interface comment {
  card: string;
  content: string;
  _id: string;
  createdOn: Date;
  createdBy: user;
}

export interface project {
  _id: string;
  boards: board[];
  createdOn: Date;
  description: string;
  name: string;
  users: user[];
}

export interface user {
  _id?: string;
  email: string;
  name: string;
  picture: string;
  token: string;
}

export interface userInfo {
  email?: string;
  name?: string;
  password?: string;
  picture?: string;
  oldPassword?: string;
  newPassword?: string;
  newNewPassword?: string;
}
