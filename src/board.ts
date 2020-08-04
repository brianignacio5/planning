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

export interface user {
  name: string;
  picture: string;
  boards: board[];
  token: string;
}

export interface comment {
  card: string;
  content: string;
  _id: string;
  createdOn: Date;
  createdBy: user;
}