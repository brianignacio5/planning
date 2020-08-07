export interface board {
  _id: string;
  name: string;
  user: user;
  cards: card[];
}

export interface card {
  board: string;
  comments: comment[];
  description: string;
  _id: string;
  picture: string;
  title: string;
  createdOn: Date;
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
  email: string;
  name: string;
  picture: string;
  token: string;
}