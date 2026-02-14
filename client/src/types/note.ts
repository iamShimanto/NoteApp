export type Note = {
  _id: string;
  title: string;
  text?: string;
  tags?: string[];
  completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type NoteCreatePayload = {
  title: string;
  text?: string;
  tags?: string[];
};

export type NoteUpdatePayload = {
  title?: string;
  text?: string;
  tags?: string[];
  completed?: boolean;
};
